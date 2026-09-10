import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync, appendFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const stable = value => {
  if (!/^\d+\.\d+\.\d+$/.test(value)) throw new Error(`Expected stable version: ${value}`);
  return value.split('.').map(Number);
};
const compare = (a,b) => {
  const x=stable(a), y=stable(b);
  return x[0]-y[0] || x[1]-y[1] || x[2]-y[2];
};
const bump = value => { const [a,b,c]=stable(value); return `${a}.${b}.${c+1}`; };

export function plan(local, latest, head, publishedHead, versions=[latest], ancestor=true) {
  stable(local); stable(latest);
  if (head && head === publishedHead) return {version:latest,published:true,publish:false,reason:'This commit was already published (including manual publication).'};
  if (!publishedHead || !ancestor) return {version:local,published:false,publish:false,reason:'Latest npm source is unknown or not contained in main; preserve the manual release.'};
  let version=compare(local,latest)>0 ? local : bump(latest);
  while(versions.includes(version)) version=bump(version);
  return {version,published:false,publish:true,reason:'Unoccupied stable version selected.'};
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const pkg=JSON.parse(readFileSync('package.json','utf8'));
  const view=(...args)=>JSON.parse(execFileSync('npm',['view',...args,'--json','--prefer-online','--registry=https://registry.npmjs.org'],{encoding:'utf8'}));
  // Registry errors are not evidence that a version is available.
  const latest=view(`${pkg.name}@latest`,'version','gitHead');
  const versions=view(pkg.name,'versions');
  const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
  const ancestor=!!latest.gitHead && spawnSync('git',['merge-base','--is-ancestor',latest.gitHead,head],{stdio:'ignore'}).status===0;
  const result=plan(pkg.version,latest.version,head,latest.gitHead,versions,ancestor);
  for(const [key,value] of Object.entries({...result,latest:latest.version,latestHead:latest.gitHead||''})) appendFileSync(process.env.GITHUB_OUTPUT,`${key}=${value}\n`);
  console.log(result.reason);
  if(!result.publish && !result.published) console.log(`::warning::${result.reason}`);
}
