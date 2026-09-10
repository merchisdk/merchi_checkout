import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
const pkg=JSON.parse(readFileSync('package.json','utf8'));
const [archive]=JSON.parse(execFileSync('npm',['pack','--dry-run','--ignore-scripts','--json'],{encoding:'utf8'}));
const files=new Set(archive.files.map(file=>file.path));
for(const key of ['main','module','types']) {
 if(pkg[key] && !files.has(pkg[key].replace(/^\.\//,''))) throw Error(`Missing packaged ${key}: ${pkg[key]}`);
}
console.log(`${pkg.name}: declared package entry points are included`);
