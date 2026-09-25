const fs = require('fs');
const path = require('path');
const data = require('./comprehensive_translations_data');

const dictPath = path.join(__dirname, '..', 'locales', 'tr.json');
const trJson = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

// ── 1. Update Rule 10 (gDe with _cat and _tr) ────────────────────────────────
const gdeRule = trJson.rules.workbench.find(r => r.replace && r.replace.includes('_cat'));
if (!gdeRule) {
  throw new Error('Rule 10 (_cat) not found in locales/tr.json');
}

const catStart = gdeRule.replace.indexOf('const _cat=') + 'const _cat='.length;
const catEnd = gdeRule.replace.indexOf(';const _tr=');
const currentCat = JSON.parse(gdeRule.replace.slice(catStart, catEnd));

const trStart = gdeRule.replace.indexOf(';const _tr=') + ';const _tr='.length;
const catCalcStart = gdeRule.replace.indexOf(';const cat=');
const currentTr = JSON.parse(gdeRule.replace.slice(trStart, catCalcStart));

// Merge extra categories
Object.assign(currentCat, data.extraCategories);

// Merge all translations into _tr:
// 1. Full key -> Turkish
// 2. Leaf (camelCase) -> Turkish
// 3. TitleCase Leaf -> Turkish
for (const [key, trVal] of Object.entries(data.comprehensiveTranslations)) {
  currentTr[key] = trVal;
  
  const parts = key.split('.');
  const leaf = parts[parts.length - 1];
  currentTr[leaf] = trVal;
  
  const titleCaseLeaf = leaf
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/^[a-z]/, c => c.toUpperCase());
  currentTr[titleCaseLeaf] = trVal;
}

// Rebuild gdeRule.replace
const newGdeReplace =
  gdeRule.replace.slice(0, catStart) +
  JSON.stringify(currentCat) +
  ';const _tr=' +
  JSON.stringify(currentTr) +
  gdeRule.replace.slice(catCalcStart);

gdeRule.replace = newGdeReplace;
console.log('✓ Rule 10 (gDe: _cat ve _tr) başarıyla güncellendi.');

// ── 2. Update Rule 86 (enum values and _disp logic) ─────────────────────────
const enumRule = trJson.rules.workbench.find(r => r.replace && r.replace.includes('const _eTr='));
if (!enumRule) {
  throw new Error('Rule 86 (_eTr) not found in locales/tr.json');
}

const eStart = enumRule.replace.indexOf('const _eTr=') + 'const _eTr='.length;
const eEnd = enumRule.replace.indexOf('},d=wBa', eStart) + 1;
const currentETr = JSON.parse(enumRule.replace.slice(eStart, eEnd));

// Merge extra enums
Object.assign(currentETr, data.extraEnums);

// Improved _disp logic:
// const _disp = _eTr[f] || (n[g] ? (_eTr[n[g]] || n[g]) : (_eTr[f] || (typeof f === "string" ? f.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[-_]/g, " ").replace(/^./, c => c.toUpperCase()) : f)));
let afterETr = enumRule.replace.slice(eEnd);
const oldDispPattern = 'const _disp=n[g]?n[g]:(_eTr[f]||(typeof f==="string"?f.replace(/([a-z])([A-Z])/g,"$1 $2").replace(/[-_]/g," ").replace(/^./,c=>c.toUpperCase()):f))';
const newDispPattern = 'const _disp=_eTr[f]||(n[g]?(_eTr[n[g]]||n[g]):(typeof f==="string"?f.replace(/([a-z])([A-Z])/g,"$1 $2").replace(/[-_]/g," ").replace(/^./,c=>c.toUpperCase()):f))';

if (afterETr.includes(oldDispPattern)) {
  afterETr = afterETr.replace(oldDispPattern, newDispPattern);
  console.log('✓ Enum _disp mantığı _eTr öncelikli olarak güncellendi.');
}

enumRule.replace =
  enumRule.replace.slice(0, eStart) +
  JSON.stringify(currentETr) +
  afterETr;

console.log('✓ Rule 86 (_eTr) başarıyla güncellendi.');

// ── 3. Save locales/tr.json ────────────────────────────────────────────────
fs.writeFileSync(dictPath, JSON.stringify(trJson, null, 2), 'utf8');
console.log('✓ locales/tr.json kaydedildi.');

// ── 4. Synchronize src/settings_dictionary.js ──────────────────────────────
const dictJsPath = path.join(__dirname, '..', 'src', 'settings_dictionary.js');
const dictJs = require(dictJsPath);

Object.assign(dictJs.categories, data.extraCategories);
Object.assign(dictJs.settings, data.comprehensiveTranslations);
Object.assign(dictJs.settings, data.labelMappings);

const dictOut = '// Tam kategori segmentleri ve ayar etiketleri Türkçe sözlüğü\n' +
  'const categories = ' + JSON.stringify(dictJs.categories, null, 2) + ';\n\n' +
  'const settings = ' + JSON.stringify(dictJs.settings, null, 2) + ';\n\n' +
  'module.exports = { categories, settings };\n';

fs.writeFileSync(dictJsPath, dictOut, 'utf8');
console.log('✓ src/settings_dictionary.js senkronize edildi.');
