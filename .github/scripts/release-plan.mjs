import { execFileSync } from 'node:child_process';
import { readFileSync, appendFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export function plan(local, latest, head, publishedHead) {
  const parse = value => {
    if (!/^\d+\.\d+\.\d+$/.test(value)) throw new Error(`Expected stable version: ${value}`);
    return value.split('.').map(Number);
  };
  const l = parse(local), r = parse(latest);
  if (head && head === publishedHead && local === latest) return { version: local, published: true };
  const greater = l[0] > r[0] || (l[0] === r[0] && (l[1] > r[1] || (l[1] === r[1] && l[2] > r[2])));
  return { version: greater ? local : `${r[0]}.${r[1]}.${r[2] + 1}`, published: false };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  // Registry errors fail the run; never guess a version during an outage.
  const latest = JSON.parse(execFileSync('npm', ['view', `${pkg.name}@latest`, 'version', 'gitHead', '--json', '--registry=https://registry.npmjs.org'], { encoding: 'utf8' }));
  const head = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const result = plan(pkg.version, latest.version, head, latest.gitHead);
  // A failed prior publish leaves its version commit on main. Reuse it.
  const subject = execFileSync('git', ['log', '-1', '--format=%s'], { encoding: 'utf8' }).trim();
  if (!result.published && subject === `chore: release ${pkg.version} [skip ci]`) {
    const versions = JSON.parse(execFileSync('npm', ['view', pkg.name, 'versions', '--json', '--registry=https://registry.npmjs.org'], { encoding: 'utf8' }));
    if (!versions.includes(pkg.version)) result.version = pkg.version;
  }
  for (const [key,value] of Object.entries(result)) appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`);
}
