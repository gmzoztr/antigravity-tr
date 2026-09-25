const fs = require('fs');

const wbPath = 'C:/Users/Work-D/AppData/Local/Programs/Antigravity IDE/resources/app/out/vs/workbench/workbench.desktop.main.js';
const content = fs.readFileSync(wbPath, 'utf8');

// gDe ve jIh fonksiyonlarını bundle'dan çek
const gDeStart = content.indexOf('function gDe(t,e="",i=!1){');
const jIhStart = content.indexOf('function jIh(t,e){');
const jIhEnd = content.indexOf('function ', jIhStart + 20);

const gDeCode = content.substring(gDeStart, jIhStart);
const jIhCode = content.substring(jIhStart, jIhEnd);

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
const { gDe } = fn();

const testKeys = [
  // Sık Kullanılanlar
  ['files.autoSave', ''],
  ['editor.tabSize', ''],
  ['editor.renderWhitespace', ''],
  ['editor.fontSize', ''],
  ['editor.fontFamily', ''],
  ['editor.cursorStyle', ''],
  ['editor.wordWrap', ''],

  // Telemetri
  ['telemetry.feedback.enabled', ''],
  ['telemetry.telemetryLevel', ''],

  // Eklentiler
  ['ipynb.pasteImagesAsAttachments.enabled', ''],
  ['remote.antigravityDevContainers.enableSSHAgentForwarding', ''],
  ['remote.antigravitySSH.configFile', ''],
  ['remote.WSL.serverDownloadUrlTemplate', ''],
  ['clangd.arguments', ''],
  ['clangd.checkUpdates', ''],
  ['git.autoRepositoryDetection', ''],
  ['git.allowForcePush', ''],
  ['markdown.preview.fontSize', ''],
  ['typescript.format.enable', ''],
  ['go.buildOnSave', ''],
  ['python.analysis.inlayHints', ''],

  // Gemini Code Assist & Cloud Code & Prettier
  ['geminicodeassist.debug.telemetry', ''],
  ['geminicodeassist.beta.forceOobLogin', ''],
  ['geminicodeassist.inlineSuggestions.enableAuto', ''],
  ['geminicodeassist.localCodebaseAwareness', ''],
  ['cloudcode.enableKubernetesSupport', ''],
  ['cloudcode.enableBigqueryExplorer', ''],
  ['cloudcode.enableGcsExplorer', ''],
  ['prettier.singleQuote', ''],
  ['prettier.bracketSpacing', '']
];

for (const [key, parentId] of testKeys) {
  console.log(key, '->', gDe(key, parentId));
}
