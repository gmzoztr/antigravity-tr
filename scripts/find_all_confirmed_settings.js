const fs = require('fs');
const path = require('path');

const wbPath = 'C:/Users/Work-D/AppData/Local/Programs/Antigravity IDE/resources/app/out/vs/workbench/workbench.desktop.main.js';
const content = fs.readFileSync(wbPath, 'utf8');

const currentTr = require('./all_current_tr.json');

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

const bracketProps = new Set();
const bpRegex = /\[([a-zA-Z0-9_$.]+)\]\s*:/g;
let m;
while ((m = bpRegex.exec(content)) !== null) {
  const full = m[1];
  const short = full.includes('.') ? full.split('.').pop() : full;
  bracketProps.add(short);
}
console.log('Computed property identifiers [IDENT]:', bracketProps.size);

const confirmedSettings = new Set();

// 1. Direct "prefix.key":{
const directRegex = /"([a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_$-]+)+)"\s*:\s*\{/g;
while ((m = directRegex.exec(content)) !== null) {
  confirmedSettings.add(m[1]);
}

// 2. Commonly used
const common = [
  "files.autoSave","editor.fontSize","editor.fontFamily","editor.tabSize",
  "editor.renderWhitespace","editor.cursorStyle","editor.multiCursorModifier",
  "editor.insertSpaces","editor.wordWrap","files.exclude","files.associations",
  "workbench.editor.enablePreview","editor.formatOnSave","editor.defaultFormatter",
  "workbench.colorTheme","editor.mouseWheelZoom","editor.formatOnPaste"
];
common.forEach(k => confirmedSettings.add(k));

// 3. Single pass over content for IDENT="prefix.xxx"
const assignRegex = /\b([a-zA-Z0-9_$]+)\s*=\s*"([a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)+)"/g;
while ((m = assignRegex.exec(content)) !== null) {
  if (bracketProps.has(m[1])) {
    confirmedSettings.add(m[2]);
  }
}

// 4. Built-in and installed extensions contributes.configuration
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
              confirmedSettings.add(k);
            }
          }
        }
      } catch (e) {}
    }
  }
}

console.log('Total confirmed settings:', confirmedSettings.size);

// Check which confirmedSettings from workbench (core prefixes) have untranslated leaf in currentTr
const corePrefixes = new Set([
  'editor', 'files', 'workbench', 'window', 'terminal', 'search', 'diffEditor',
  'multiDiffEditor', 'explorer', 'security', 'debug', 'scm', 'http',
  'problems', 'output', 'comments', 'notebook', 'interactiveWindow',
  'testing', 'task', 'zenMode', 'screencastMode', 'breadcrumbs', 'settingsSync',
  'accessibility', 'telemetry', 'update', 'extensions', 'remote', 'mergeEditor',
  'chat', 'inlineChat', 'antigravity', 'application', 'outline', 'audioCues', 'issueReporter'
]);

const missingCoreConfirmed = [];
for (const k of Array.from(confirmedSettings).sort()) {
  const p = k.split('.')[0];
  if (!corePrefixes.has(p)) continue;
  if (k.startsWith('workbench.action') || k.startsWith('editor.action') || k.startsWith('terminal.action') || k.startsWith('workbench.view.')) continue;
  const n = k.lastIndexOf('.');
  const leaf = k.substring(n + 1);
  const s = NLa(leaf);
  if (!currentTr[s] && !currentTr[leaf] && !currentTr[k]) {
    missingCoreConfirmed.push({ key: k, leaf, s });
  }
}

console.log('Core confirmed settings missing from _tr:', missingCoreConfirmed.length);
fs.writeFileSync(path.join(__dirname, 'missing_confirmed_settings.json'), JSON.stringify(missingCoreConfirmed, null, 2), 'utf8');
missingCoreConfirmed.forEach((item, idx) => {
  console.log(`${idx + 1}. ${item.key} => s="${item.s}"`);
});
