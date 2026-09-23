const fs = require('fs');
const path = require('path');
const { categories, settings } = require('../src/settings_dictionary');

const p = 'C:/Users/Work-D/AppData/Local/Programs/Antigravity IDE/resources/app/out/vs/workbench/workbench.desktop.main.js';
const c = fs.readFileSync(p, 'utf8');

function NLa(t){
  return t.replace(/\.([a-z0-9])/g, (e, i) => ' \u203A ' + i.toUpperCase())
   .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
   .replace(/([A-Z]{1,})([A-Z][a-z])/g, '$1 $2')
   .replace(/^[a-z]/g, e => e.toUpperCase());
}

const idx = c.indexOf('colorDecoratorsActivatedOn');
const snippet = c.substring(idx - 6000, idx + 1000);

const re = /t\[t\.([a-zA-Z0-9]+)=\d+\]="([a-zA-Z0-9]+)"/g;
let m;
const allOpts = [];
while ((m = re.exec(snippet)) !== null) {
  allOpts.push(m[2]);
}
console.log('Total extracted:', allOpts.length);

const missing = [];
for (const opt of allOpts) {
  const label = NLa(opt);
  if (!settings[label]) {
    missing.push({ opt, label });
  }
}

console.log('Missing EditorOption labels:', missing.length);
console.log(JSON.stringify(missing, null, 2));
