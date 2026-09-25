const fs = require('fs');
const path = require('path');

const wbPath = 'C:/Users/Work-D/AppData/Local/Programs/Antigravity IDE/resources/app/out/vs/workbench/workbench.desktop.main.js';
const content = fs.readFileSync(wbPath, 'utf8');

const prefixes = new Set([
  'editor', 'files', 'workbench', 'window', 'terminal', 'search', 'diffEditor',
  'multiDiffEditor', 'explorer', 'security', 'debug', 'scm', 'git', 'http',
  'html', 'css', 'less', 'scss', 'json', 'javascript', 'typescript', 'js/ts',
  'markdown', 'problems', 'output', 'comments', 'notebook', 'interactiveWindow',
  'testing', 'task', 'zenMode', 'screencastMode', 'breadcrumbs', 'settingsSync',
  'accessibility', 'telemetry', 'update', 'extensions', 'remote', 'mergeEditor',
  'chat', 'inlineChat', 'antigravity', 'application', 'outline', 'emmet', 'npm',
  'php', 'python', 'ipynb', 'audioCues', 'simpleBrowser', ' issueReporter'
]);

// 1. Find all string literals in workbench.desktop.main.js that start with a known prefix + "."
const allKeys = new Set();
const strRegex = /"([a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)+)"/g;
let m;
while ((m = strRegex.exec(content)) !== null) {
  const s = m[1];
  const dot = s.indexOf('.');
  const prefix = s.substring(0, dot);
  if (prefixes.has(prefix)) {
    // Exclude commands/views/contexts that aren't settings if we can, or include all and test gDe!
    // Actually, testing gDe on all of them is completely harmless and guarantees 100% coverage!
    allKeys.add(s);
  }
}

// 2. Also scan all extensions (built-in and user) for contributes.configuration properties
const extDirs = [
  'C:/Users/Work-D/AppData/Local/Programs/Antigravity IDE/resources/app/extensions',
  'C:/Users/Work-D/.antigravity-ide/extensions'
];

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
            for (const k of Object.keys(cfg.properties)) {
              allKeys.add(k);
            }
          }
        }
      } catch (e) {}
    }
  }
}

console.log(`Total setting/identifier keys collected: ${allKeys.size}`);

// 3. Load gDe from workbench.desktop.main.js
const gDeIdx = content.indexOf('function gDe(');
const gDeEnd = content.indexOf('function ', gDeIdx + 20);
const jihIdx = content.indexOf('function jIh(');
const jihEnd = content.indexOf('function ', jihIdx + 20);

const jihCode = content.substring(jihIdx, jihEnd);
const gDeCode = content.substring(gDeIdx, gDeEnd);

const fullCode = `
const FLa = new Set(["html","scss","less","json","js","ts","ie","id","php","scm"]);
const Lee = new Map();
Lee.set("power shell","PowerShell");
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
const { gDe } = fn();

// Now let's specifically check the ones in Commonly Used (Sık Kullanılan), Text Editor, Diff Editor, Files, Workbench, etc.
// Wait: where is "Sık Kullanılan" (Commonly Used) list defined in workbench.desktop.main.js?
const commonlyUsedMatch = content.match(/COMMONLY_USED_SETTINGS\s*=\s*\[([^\]]+)\]/);
console.log('Commonly used match:', commonlyUsedMatch ? commonlyUsedMatch[0].substring(0, 200) : 'not found by name');
