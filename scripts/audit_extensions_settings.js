const fs = require('fs');
const path = require('path');

const wbPath = 'C:/Users/Work-D/AppData/Local/Programs/Antigravity IDE/resources/app/out/vs/workbench/workbench.desktop.main.js';
const content = fs.readFileSync(wbPath, 'utf8');

const trJson = require('../locales/tr.json');
const gdeRule = trJson.rules.workbench.find(r => r.replace && r.replace.includes('_cat'));

const catStart = gdeRule.replace.indexOf('const _cat=') + 'const _cat='.length;
const catEnd = gdeRule.replace.indexOf(';const _tr=');
const currentCat = JSON.parse(gdeRule.replace.slice(catStart, catEnd));

const trStart = gdeRule.replace.indexOf(';const _tr=') + ';const _tr='.length;
const catCalcStart = gdeRule.replace.indexOf(';const cat=');
const currentTr = JSON.parse(gdeRule.replace.slice(trStart, catCalcStart));

// Load gDe and NLa
const gDeIdx = content.indexOf('function gDe(');
const gDeEnd = content.indexOf('function ', gDeIdx + 20);
const jihIdx = content.indexOf('function jIh(');
const jihEnd = content.indexOf('function ', jihIdx + 20);

const jihCode = content.substring(jihIdx, jihEnd);
const gDeCode = content.substring(gDeIdx, gDeEnd);

const fullCode = `
const FLa = new Set(["html","scss","less","json","js","ts","ie","id","php","scm"]);
const Lee = new Map([
  ["power shell","PowerShell"],["powershell","PowerShell"],
  ["javascript","JavaScript"],["typescript","TypeScript"],
  ["github","GitHub"],["jet brains","JetBrains"],["jetbrains","JetBrains"],
  ["re sharper","ReSharper"],["resharper","ReSharper"]
]);
function NLa(t){
  t=t.replace(/\\.([a-z0-9])/g,(e,i)=>' \\u203A '+i.toUpperCase())
     .replace(/([a-z0-9])([A-Z])/g,"$1 $2")
     .replace(/([A-Z]{1,})([A-Z][a-z])/g,"$1 $2")
     .replace(/^[a-z]/g,e=>e.toUpperCase())
     .replace(/\\b\\w+\\b/g,e=>FLa.has(e.toLowerCase())?e.toUpperCase():e);
  for(const[e,i]of Lee)t=t.replace(new RegExp('\\\\b'+e+'\\\\b',"gi"),i);
  return t;
}
${jihCode}
function oln(t) { return t; }
${gDeCode}
return { gDe, NLa, jIh };
`;

const fn = new Function(fullCode);
const { gDe, NLa, jIh } = fn();

// Scan extensions
const extDirs = [
  'C:/Users/Work-D/AppData/Local/Programs/Antigravity IDE/resources/app/extensions',
  'C:/Users/Work-D/.antigravity-ide/extensions'
];

const extensionSettings = [];

for (const d of extDirs) {
  if (!fs.existsSync(d)) continue;
  for (const sub of fs.readdirSync(d, { withFileTypes: true })) {
    if (!sub.isDirectory()) continue;
    const pkgPath = path.join(d, sub.name, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        const configs = pkg.contributes?.configuration;
        const configList = Array.isArray(configs) ? configs : (configs ? [configs] : []);
        for (const cfg of configList) {
          if (cfg.properties) {
            for (const [propKey, propVal] of Object.entries(cfg.properties)) {
              extensionSettings.push({
                extension: pkg.name || sub.name,
                key: propKey,
                title: cfg.title || '',
                description: propVal.description || propVal.markdownDescription || '',
                enumVals: propVal.enum || []
              });
            }
          }
        }
      } catch (e) {}
    }
  }
}

console.log(`Total extension settings discovered: ${extensionSettings.length}`);

// Test gDe on every single extension setting!
const untranslatedExt = [];
for (const item of extensionSettings) {
  const parts = item.key.split('.');
  const parentId = parts[0];
  const { category, label } = gDe(item.key, parentId);
  
  // Check if label or category is in English
  // If label is equal to NLa(leaf) and NOT in currentTr, it is untranslated!
  const leaf = parts[parts.length - 1];
  const s = NLa(leaf);
  const isLabelUntranslated = (!currentTr[s] && !currentTr[leaf] && !currentTr[item.key]);
  
  // Also check if any category segment is in English (not in currentCat)
  const catSegments = category ? category.split(' \u203A ') : [];
  const untranslatedCatSegs = catSegments.filter(seg => !currentCat[seg]);
  
  if (isLabelUntranslated || untranslatedCatSegs.length > 0) {
    untranslatedExt.push({
      extension: item.extension,
      key: item.key,
      category,
      label,
      isLabelUntranslated,
      untranslatedCatSegs,
      description: typeof item.description === 'string' ? item.description.substring(0, 100) : ''
    });
  }
}

console.log(`Untranslated extension settings: ${untranslatedExt.length}`);
fs.writeFileSync(path.join(__dirname, 'untranslated_extensions.json'), JSON.stringify(untranslatedExt, null, 2), 'utf8');

// Group by extension
const byExt = {};
for (const u of untranslatedExt) {
  byExt[u.extension] = (byExt[u.extension] || 0) + 1;
}
console.log('Untranslated count by extension:');
console.log(byExt);
