const fs = require('fs');
const vm = require('vm');

const dictPath = 'C:\\Users\\Work-D\\source\\antigravity-tr\\locales\\tr.json';
const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
const wRule = dict.rules.workbench.find(r => r.replace && r.replace.includes('_eTr'));

// Enum objesini alalım
const startObj = wRule.replace.indexOf('{');
const endObj = wRule.replace.indexOf('},d=');
const objStr = wRule.replace.slice(startObj, endObj + 1);

const targetReplace = 'const _eTr=' + objStr + ',d=wBa(String(t.defaultValue)),u=s.map(String).map(wBa).map((f,g)=>{const m=r[g]&&(o?cQn(r[g],!1):r[g]);const _disp=n[g]?n[g]:(_eTr[f]||(typeof f==="string"?f.replace(/([a-z])([A-Z])/g,"$1 $2").replace(/[-_]/g," ").replace(/^./,c=>c.toUpperCase()):f));return{text:_disp,detail:n[g]?f:(_eTr[f]?f:""),description:m';

wRule.replace = targetReplace;
fs.writeFileSync(dictPath, JSON.stringify(dict, null, 2), 'utf8');
console.log('tr.json başarıyla güncellendi.');

// Şimdi V8 SourceTextModule ile .bak dosyasına uygulayıp test edelim:
const bak = fs.readFileSync('C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');

let testCode = bak;
for (const rule of dict.rules.workbench) {
  testCode = testCode.replaceAll(rule.search, rule.replace);
}

try {
  new vm.SourceTextModule(testCode);
  console.log('TEST BAŞARILI: VM SourceTextModule SÖZDİZİMİ TAMAMEN GEÇERLİ! [✓][✓][✓]');
} catch (e) {
  console.error('TEST BAŞARISIZ:', e);
  process.exit(1);
}
