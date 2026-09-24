const fs = require('fs');

const dictPath = 'C:\\Users\\Work-D\\source\\antigravity-tr\\locales\\tr.json';
const trJson = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

const enumRule = trJson.rules.workbench.find(r => r.replace && r.replace.includes('const _eTr='));
const eStart = enumRule.replace.indexOf('const _eTr=') + 'const _eTr='.length;
const eEnd   = enumRule.replace.indexOf('},d=wBa', eStart) + 1;
const currentETr = JSON.parse(enumRule.replace.slice(eStart, eEnd));

const newEnums = JSON.parse(fs.readFileSync('C:\\Users\\Work-D\\source\\antigravity-tr\\scripts\\all_missing_enums_mapped.json', 'utf8'));

Object.assign(currentETr, newEnums);

enumRule.replace =
  enumRule.replace.slice(0, eStart) +
  JSON.stringify(currentETr) +
  enumRule.replace.slice(eEnd);

fs.writeFileSync(dictPath, JSON.stringify(trJson, null, 2), 'utf8');

console.log(`✓ _eTr başarıyla güncellendi: Toplam ${Object.keys(currentETr).length} dropdown enum seçeneği Türkçe oldu.`);
