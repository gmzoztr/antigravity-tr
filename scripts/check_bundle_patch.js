const fs = require('fs');

const wbPath = 'C:/Users/Work-D/AppData/Local/Programs/Antigravity IDE/resources/app/out/vs/workbench/workbench.desktop.main.js';
const content = fs.readFileSync(wbPath, 'utf8');

const search = 'const s=NLa(t);return{category:r,label:s}';
console.log('Contains original search?', content.includes(search));

const hasCat = content.includes('const _cat=');
console.log('Contains _cat in bundle?', hasCat);

if (hasCat) {
  const idx = content.indexOf('const _cat=');
  console.log('Context around _cat:');
  console.log(content.slice(idx - 60, idx + 100));
}
