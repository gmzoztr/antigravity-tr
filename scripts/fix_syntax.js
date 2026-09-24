const fs = require('fs');
const vm = require('vm');

const dictPath = 'C:\\Users\\Work-D\\source\\antigravity-tr\\locales\\tr.json';
const benchBak = 'C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak';

const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
const bak = fs.readFileSync(benchBak, 'utf8');

const r = dict.rules.workbench.find(x => x.replace && x.replace.includes('_eTr'));

const targetSearch = 'const d=wBa(String(t.defaultValue)),' + r.search;

if (!bak.includes(targetSearch)) {
  console.error('HATA: targetSearch bak dosyasında bulunamadı!');
  process.exit(1);
}

// Replace stringini güvenli syntax ile yeniden inşa edelim
const startObj = r.replace.indexOf('{');
const endObj = r.replace.indexOf('};');
const objStr = r.replace.slice(startObj, endObj + 1);
const restOfMap = r.replace.slice(r.replace.indexOf('u=s.map'));

const targetReplace = 'const _eTr=' + objStr + ',d=wBa(String(t.defaultValue)),' + restOfMap;

// dict güncelle
r.search = targetSearch;
r.replace = targetReplace;
fs.writeFileSync(dictPath, JSON.stringify(dict, null, 2), 'utf8');
console.log('tr.json başarıyla güncellendi.');

// Şimdi test edelim
let testCode = bak;
for (const rule of dict.rules.workbench) {
  testCode = testCode.replaceAll(rule.search, rule.replace);
}

try {
  new vm.SourceTextModule(testCode);
  console.log('TEST BAŞARILI: VM SourceTextModule HATASIZ GEÇTİ! [✓][✓][✓]');
} catch (e) {
  console.error('TEST BAŞARISIZ:', e);
  process.exit(1);
}
