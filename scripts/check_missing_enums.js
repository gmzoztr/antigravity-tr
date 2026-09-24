const fs = require('fs');

const trJson = JSON.parse(fs.readFileSync('C:\\Users\\Work-D\\source\\antigravity-tr\\locales\\tr.json', 'utf8'));
const r86 = trJson.rules.workbench.find(r => r.replace && r.replace.includes('_eTr'));

const start = r86.replace.indexOf('const _eTr=') + 'const _eTr='.length;
const end = r86.replace.indexOf('},d=wBa', start) + 1;

const jsonStr = r86.replace.slice(start, end);
const currentETr = JSON.parse(jsonStr);

console.log('Currently in _eTr:', Object.keys(currentETr).length);

const pureEnums = JSON.parse(fs.readFileSync('C:\\Users\\Work-D\\source\\antigravity-tr\\scripts\\pure_string_enums.json', 'utf8'));

const missing = [];
const existing = [];

for (const val of pureEnums) {
  if (currentETr[val]) {
    existing.push({ val, tr: currentETr[val] });
  } else {
    missing.push(val);
  }
}

console.log('Matching pureEnums in _eTr:', existing.length);
console.log('Missing pureEnums from _eTr:', missing.length);

fs.writeFileSync('C:\\Users\\Work-D\\source\\antigravity-tr\\scripts\\missing_enums.json', JSON.stringify(missing, null, 2), 'utf8');
console.log('Saved missing_enums.json (first 30 missing below):');
console.log(missing.slice(0, 30));
