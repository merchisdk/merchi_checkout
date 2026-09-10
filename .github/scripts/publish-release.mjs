import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync, appendFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export function publishRelease({version, head, latest, latestHead}, io) {
  const current = io.latest();
  if (current.version !== latest || current.gitHead !== latestHead || io.versions().includes(version)) {
    return {published:false, reason:'Another publication changed npm state; defer to the next run.'};
  }
  const status = io.publish();
  if (!io.versions().includes(version)) throw Error(`Publication did not create ${version} (exit ${status}); retry after checking npm output.`);
  const actual = io.exact();
  if (actual.gitHead !== head) return {published:false, reason:'Another publisher claimed this version; preserve their release and retry next run.'};
  if (actual.version !== version) throw Error('Registry returned an unexpected version');
  return {published:true, reason:'Published version and source commit verified.'};
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const {name,version}=JSON.parse(readFileSync('package.json','utf8'));
  const view=(...args)=>JSON.parse(execFileSync('npm',['view',...args,'--json','--registry=https://registry.npmjs.org'],{encoding:'utf8'}));
  const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
  const result=publishRelease({version,head,latest:process.env.EXPECTED_LATEST,latestHead:process.env.EXPECTED_LATEST_HEAD},{
    latest:()=>view(`${name}@latest`,'version','gitHead'),
    versions:()=>view(name,'versions'),
    exact:()=>view(`${name}@${version}`,'version','gitHead'),
    publish:()=>spawnSync('npm',['publish','--access','public','--tag','latest','--registry=https://registry.npmjs.org'],{stdio:'inherit'}).status,
  });
  appendFileSync(process.env.GITHUB_OUTPUT,`published=${result.published}\n`);
  console.log(`${result.published ? '' : '::warning::'}${result.reason}`);
}
