const fs = require('fs');
const path = require('path');

// comprehensive_inspector mantığından untranslatedLabels listesini al
const { allSettingsMap, fn, technicalTerms } = (function() {
  const wbPath = 'C:/Users/Work-D/AppData/Local/Programs/Antigravity IDE/resources/app/out/vs/workbench/workbench.desktop.main.js';
  const wb = fs.readFileSync(wbPath, 'utf8');

  const gDeStart = wb.indexOf('function gDe(t,e="",i=!1){');
  const jIhStart = wb.indexOf('function jIh(t,e){');
  const jIhEnd = wb.indexOf('function ', jIhStart + 20);

  const gDeCode = wb.substring(gDeStart, jIhStart);
  const jIhCode = wb.substring(jIhStart, jIhEnd);

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
  function oln(t) { return t; }
  ${jIhCode}
  ${gDeCode}
  return { gDe, jIh, NLa };
  `;

  const fn = new Function(fullCode);
  const { gDe, NLa } = fn();

  const extDirs = [
    'C:/Users/Work-D/AppData/Local/Programs/Antigravity IDE/resources/app/extensions',
    'C:/Users/Work-D/.antigravity-ide/extensions',
    'C:/Users/Work-D/.vscode/extensions'
  ];

  const allSettingsMap = new Map();
  for (const d of extDirs) {
    if (!fs.existsSync(d)) continue;
    for (const sub of fs.readdirSync(d, { withFileTypes: true })) {
      if (!sub.isDirectory()) continue;
      const pkgPath = path.join(d, sub.name, 'package.json');
      if (!fs.existsSync(pkgPath)) continue;
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        const cfg = pkg.contributes?.configuration;
        if (!cfg) continue;
        const cfgs = Array.isArray(cfg) ? cfg : [cfg];
        for (const c of cfgs) {
          if (!c.properties) continue;
          for (const [key, val] of Object.entries(c.properties)) {
            allSettingsMap.set(key, { ext: sub.name, ...val });
          }
        }
      } catch (e) {}
    }
  }

  const technicalTerms = new Set([
    'Linux', 'OS X', 'Windows', 'Regex', 'URI', 'HTML5', 'JSDoc', 'JavaScript', 'TypeScript',
    'JSON', 'CSS', 'HTML', 'Markdown', 'GOPATH', 'GOROOT', 'gopls', 'Go', 'REPL', 'npm',
    'WSL', 'Clangd', 'CodeLens', 'Spark', 'Composer', 'Git', 'GitHub', 'Python', 'Jupyter',
    'Pytest', 'Unittest', 'Node.js', 'ERB', 'Delve', 'Conda', 'Pipenv', 'Poetry', 'Pixi',
    'ActiveState', 'Claude', 'Codex', 'ChatGPT', 'BigQuery', 'gcloud', 'Emmet', 'PHP',
    'CWD', 'ID', 'SSL', 'URL', 'SSH', 'PATH', 'IPYNB', 'MCP', 'LLM', 'AI', 'API', 'REST'
  ]);

  return { allSettingsMap, fn: { gDe, NLa }, technicalTerms };
})();

const { gDe, NLa } = fn;
const missingLabelsMap = {};

for (const [key, prop] of allSettingsMap.entries()) {
  const parts = key.split('.');
  const leaf = parts[parts.length - 1];
  const res = gDe(key, leaf);
  const rawLabel = NLa(leaf);

  if (res.label === rawLabel && !technicalTerms.has(res.label)) {
    if (!missingLabelsMap[res.label]) missingLabelsMap[res.label] = [];
    missingLabelsMap[res.label].push(key);
  }
}

fs.writeFileSync('scripts/remaining_194_labels.json', JSON.stringify(missingLabelsMap, null, 2), 'utf8');
console.log('Saved remaining labels count:', Object.keys(missingLabelsMap).length);
console.log('Labels list:', Object.keys(missingLabelsMap));
