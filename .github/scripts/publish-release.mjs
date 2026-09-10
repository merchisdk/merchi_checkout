import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync, appendFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export async function publishRelease({version, head, latest, latestHead}, io) {
  const current = io.latest();
  if (current.version !== latest || current.gitHead !== latestHead || io.versions().includes(version)) {
    return {published:false, reason:'Another publication changed npm state; defer to the next run.'};
  }
  const status = io.publish();
  // npm publish can succeed before a registry read sees the new version.
  // Verify the exact version with fresh reads; never publish twice in one run.
  let actual;
  for (let attempt = 0; attempt < 7; attempt++) {
    try { actual = await io.exact(); break; }
    catch (error) {
      if (attempt === 6) throw Error(`Could not verify ${version} after publication (exit ${status}); next run will reconcile it.`, {cause:error});
      await io.wait(5000);
    }
  }
  if (actual.gitHead !== head) return {published:false, reason:'Another publisher claimed this version; preserve their release and retry next run.'};
  if (actual.version !== version) throw Error('Registry returned an unexpected version');
  return {published:true, reason:'Published version and source commit verified.'};
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const {name,version}=JSON.parse(readFileSync('package.json','utf8'));
  const view=(...args)=>JSON.parse(execFileSync('npm',['view',...args,'--json','--prefer-online','--registry=https://registry.npmjs.org'],{encoding:'utf8'}));
  const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
  const result=await publishRelease({version,head,latest:process.env.EXPECTED_LATEST,latestHead:process.env.EXPECTED_LATEST_HEAD},{
    wait:ms=>new Promise(resolve=>setTimeout(resolve,ms)),
    latest:()=>view(`${name}@latest`,'version','gitHead'),
    versions:()=>view(name,'versions'),
    exact:()=>view(`${name}@${version}`,'version','gitHead'),
    publish:()=>spawnSync('npm',['publish','--access','public','--tag','latest','--registry=https://registry.npmjs.org'],{stdio:'inherit'}).status,
  });
  appendFileSync(process.env.GITHUB_OUTPUT,`published=${result.published}\n`);
  console.log(`${result.published ? '' : '::warning::'}${result.reason}`);
}
