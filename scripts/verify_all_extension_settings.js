const fs = require('fs');
const path = require('path');

const trJson = require('../locales/tr.json');
const gdeRule = trJson.rules.workbench.find(r => r.replace && r.replace.includes('_cat'));

const catStart = gdeRule.replace.indexOf('const _cat=') + 'const _cat='.length;
const catEnd = gdeRule.replace.indexOf(';const _tr=');
const _cat = JSON.parse(gdeRule.replace.slice(catStart, catEnd));

const trStart = gdeRule.replace.indexOf(';const _tr=') + ';const _tr='.length;
const catCalcStart = gdeRule.replace.indexOf(';const cat=');
const _tr = JSON.parse(gdeRule.replace.slice(trStart, catCalcStart));

const FLa = new Set(["html","scss","less","json","js","ts","ie","id","php","scm"]);
const Lee = new Map([
  ["power shell","PowerShell"],["powershell","PowerShell"],
  ["javascript","JavaScript"],["typescript","TypeScript"],
  ["github","GitHub"],["jet brains","JetBrains"],["jetbrains","JetBrains"],
  ["re sharper","ReSharper"],["resharper","ReSharper"]
]);

function NLa(t){
  t=t.replace(/\.([a-z0-9])/g,(e,i)=>' \u203A '+i.toUpperCase())
     .replace(/([a-z0-9])([A-Z])/g,"$1 $2")
     .replace(/([A-Z]{1,})([A-Z][a-z])/g,"$1 $2")
     .replace(/^[a-z]/g,e=>e.toUpperCase())
     .replace(/\b\w+\b/g,e=>FLa.has(e.toLowerCase())?e.toUpperCase():e);
  for(const[e,i]of Lee)t=t.replace(new RegExp('\\b'+e+'\\b',"gi"),i);
  return t;
}

function oln(t) { return t; }

function jIh(e, t) {
  let i = e;
  return i.endsWith("." + t) ? (i = i.substring(0, i.length - t.length - 1)) : i === t && (i = ""), i ? NLa(oln(i)) : "";
}

function gDe(e, t) {
  const r = (jIh(e, t) || "").replace(/^settings\./, "");
  const s = NLa(t);
  const cat = r.split(' \u203A ').map(seg => _cat[seg] || seg).join(' \u203A ');
  const lab = _tr[s] || _tr[s.replace(/ \u203A /g, ': ')] || _tr[t] || _tr[e] || s;
  return { category: cat, label: lab };
}

// Eklentileri tara
const extDirs = [
  'C:/Users/Work-D/AppData/Local/Programs/Antigravity IDE/resources/app/extensions',
  'C:/Users/Work-D/.antigravity-ide/extensions'
];

const totalSettings = [];
const untranslatedSettings = [];

// Bilinen kabul edilebilir / orijinal adlar
const acceptedLabels = new Set([
  'Linux', 'OS X', 'Windows', 'Regex', 'URI', 'HTML5', 'JSDoc', 'JavaScript', 'TypeScript',
  'JSON', 'CSS', 'HTML', 'Markdown', 'GOPATH', 'GOROOT', 'gopls', 'Go', 'REPL', 'npm',
  'WSL', 'Clangd', 'CodeLens', 'Spark', 'Composer', 'Git', 'GitHub', 'Python', 'Jupyter',
  'Pytest', 'Unittest', 'Node.js', 'ERB', 'Delve', 'Conda', 'Pipenv', 'Poetry', 'Pixi',
  'ActiveState', 'Claude', 'Codex', 'ChatGPT', 'BigQuery', 'gcloud', 'Emmet',
  'Antigravity Dev Containers', 'Antigravity SSH', 'Remote.WSL', 'Pyrefly', 'Data Cloud',
  'Ruby LSP', 'Grunt', 'Gulp', 'Jake', 'PHP'
]);

for (const d of extDirs) {
  if (!fs.existsSync(d)) continue;
  for (const sub of fs.readdirSync(d, { withFileTypes: true })) {
    if (!sub.isDirectory()) continue;
    const pkgPath = path.join(d, sub.name, 'package.json');
    if (!fs.existsSync(pkgPath)) continue;

    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      const props = pkg.contributes?.configuration?.properties;
      if (!props) continue;

      for (const [key, val] of Object.entries(props)) {
        const parts = key.split('.');
        const leaf = parts[parts.length - 1];
        const res = gDe(key, leaf);
        const originalLabel = NLa(leaf);

        // Raw kategori
        const rawR = (jIh(key, leaf) || "").replace(/^settings\./, "");
        const rawSegs = rawR ? rawR.split(' \u203A ') : [];

        // Kategori segmentleri kontrolü: Orijinal İngilizce segment değişmemişse ve kabul edilenler listesinde değilse eksiktir
        const untranslatedCatSegs = [];
        const resSegs = res.category ? res.category.split(' \u203A ') : [];
        for (let idx = 0; idx < rawSegs.length; idx++) {
          const rawS = rawSegs[idx];
          const trS = resSegs[idx] || rawS;
          // Eğer rawS İngilizce ve trS === rawS ise ve accepted değilse
          if (rawS === trS && !acceptedLabels.has(rawS) && !['Antigravity'].includes(rawS)) {
            untranslatedCatSegs.push(rawS);
          }
        }

        // Label kontrolü
        const isLabelUntranslated = (res.label === originalLabel) && !acceptedLabels.has(res.label);

        totalSettings.push({ extension: sub.name, key, ...res });

        if (isLabelUntranslated || untranslatedCatSegs.length > 0) {
          untranslatedSettings.push({
            extension: sub.name,
            key,
            rawCategory: rawR,
            category: res.category,
            rawLabel: originalLabel,
            label: res.label,
            isLabelUntranslated,
            untranslatedCatSegs
          });
        }
      }
    } catch (e) {}
  }
}

console.log(`========================================`);
console.log(`Toplam taranan eklenti ayarı: ${totalSettings.length}`);
console.log(`Çevrilmemiş kalan ayar sayısı: ${untranslatedSettings.length}`);
console.log(`Başarı Oranı: %${((1 - untranslatedSettings.length / totalSettings.length) * 100).toFixed(2)}`);
console.log(`========================================`);

if (untranslatedSettings.length > 0) {
  console.log('Kalan çevrilmemiş örnekler (ilk 15):');
  console.log(untranslatedSettings.slice(0, 15));
}
