import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
const {name}=JSON.parse(readFileSync('package.json','utf8'));
const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const published=JSON.parse(execFileSync('npm',['view',`${name}@${process.env.RELEASE_VERSION}`,'version','gitHead','--json','--registry=https://registry.npmjs.org'],{encoding:'utf8'}));
if(published.version!==process.env.RELEASE_VERSION || published.gitHead!==head) throw Error('Published version does not match this release commit');
console.log(`${name}@${published.version} verified`);
