import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export function tagDecision({version,head,ancestor,existing}) {
  if (!/^\d+\.\d+\.\d+$/.test(version) || !/^[a-f0-9]{40}$/.test(head || '') || !ancestor) return 'skip';
  if (existing && existing !== head) throw Error(`Tag v${version} points to another commit; refusing to replace it.`);
  return existing ? 'present' : 'create';
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const {name}=JSON.parse(readFileSync('package.json','utf8'));
  const version=process.env.RELEASE_VERSION;
  const pkg=JSON.parse(execFileSync('npm',['view',`${name}@${version}`,'version','gitHead','--json','--prefer-online','--registry=https://registry.npmjs.org'],{encoding:'utf8'}));
  if(pkg.version!==version) throw Error('Unexpected registry version');
  const head=pkg.gitHead;
  const ancestor=/^[a-f0-9]{40}$/.test(head || '') && spawnSync('git',['merge-base','--is-ancestor',head,'HEAD'],{stdio:'ignore'}).status===0;
  const tag=`v${version}`;
  const lines=execFileSync('git',['ls-remote','--tags','origin',`refs/tags/${tag}`,`refs/tags/${tag}^{}`],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
  const peeled=lines.find(line=>line.endsWith('^{}')) || lines[0];
  const existing=peeled?.split(/\s+/)[0];
  const action=tagDecision({version,head,ancestor,existing});
  if(action==='create') {
    // Push the verified source SHA directly: no main write and no local tag overwrite.
    execFileSync('git',['push','origin',`${head}:refs/tags/${tag}`],{stdio:'inherit'});
  }
  console.log(`${name}@${version}: tag ${action}`);
}
