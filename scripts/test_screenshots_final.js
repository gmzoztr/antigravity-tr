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

console.log('=== GÖRSEL 1: TELEMETRİ TESTİ ===');
console.log('telemetry.feedback.enabled:', gDe('telemetry.feedback.enabled', 'enabled'));

console.log('\n=== GÖRSEL 2: IPYNB & REMOTE TESTİ ===');
console.log('ipynb.pasteImagesAsAttachments.enabled:', gDe('ipynb.pasteImagesAsAttachments.enabled', 'enabled'));
console.log('remote.antigravityDevContainers.enableSSHAgentForwarding:', gDe('remote.antigravityDevContainers.enableSSHAgentForwarding', 'enableSSHAgentForwarding'));
console.log('remote.antigravityDevContainers.experimental.disableServerChecksum:', gDe('remote.antigravityDevContainers.experimental.disableServerChecksum', 'disableServerChecksum'));
console.log('remote.antigravitySSH.configFile:', gDe('remote.antigravitySSH.configFile', 'configFile'));
console.log('remote.antigravitySSH.path:', gDe('remote.antigravitySSH.path', 'path'));
console.log('remote.antigravitySSH.experimental.serverDownloadUrlTemplate:', gDe('remote.antigravitySSH.experimental.serverDownloadUrlTemplate', 'serverDownloadUrlTemplate'));
console.log('remote.antigravitySSH.experimental.serverBinaryName:', gDe('remote.antigravitySSH.experimental.serverBinaryName', 'serverBinaryName'));
console.log('remote.antigravitySSH.experimental.disableServerChecksum:', gDe('remote.antigravitySSH.experimental.disableServerChecksum', 'disableServerChecksum'));
console.log('remote.WSL.serverDownloadUrlTemplate:', gDe('remote.WSL.serverDownloadUrlTemplate', 'serverDownloadUrlTemplate'));
console.log('remote.WSL.experimental.disableServerChecksum:', gDe('remote.WSL.experimental.disableServerChecksum', 'disableServerChecksum'));

console.log('\n=== GÖRSEL 3: CLANGD TESTİ ===');
const clangdSettings = [
  ['clangd.arguments', 'arguments'],
  ['clangd.checkUpdates', 'checkUpdates'],
  ['clangd.detectExtensionConflicts', 'detectExtensionConflicts'],
  ['clangd.enableCodeCompletion', 'enableCodeCompletion'],
  ['clangd.enableHover', 'enableHover'],
  ['clangd.fallbackFlags', 'fallbackFlags'],
  ['clangd.serverCompletionRanking', 'serverCompletionRanking'],
  ['clangd.restartAfterCrash', 'restartAfterCrash'],
  ['clangd.onConfigChanged', 'onConfigChanged'],
  ['clangd.semanticHighlighting', 'semanticHighlighting'],
  ['clangd.path', 'path'],
  ['clangd.trace', 'trace'],
  ['clangd.useScriptAsExecutable', 'useScriptAsExecutable']
];

for (const [key, leaf] of clangdSettings) {
  console.log(`${key}:`, gDe(key, leaf));
}
