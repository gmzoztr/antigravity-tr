const fs = require('fs');

const wbPath = 'C:/Users/Work-D/AppData/Local/Programs/Antigravity IDE/resources/app/out/vs/workbench/workbench.desktop.main.js';
const content = fs.readFileSync(wbPath, 'utf8');

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

console.log('1. files.associations:', gDe('files.associations', 'files'));
console.log('2. editor.tokenColorCustomizations:', gDe('editor.tokenColorCustomizations', 'editor'));
console.log('3. editor.unicodeHighlight.allowedCharacters:', gDe('editor.unicodeHighlight.allowedCharacters', 'editor'));
console.log('4. diffEditor.hideUnchangedRegions.contextLineCount:', gDe('diffEditor.hideUnchangedRegions.contextLineCount', 'diffEditor'));
console.log('5. diffEditor.hideUnchangedRegions.minimumLineCount:', gDe('diffEditor.hideUnchangedRegions.minimumLineCount', 'diffEditor'));
console.log('6. diffEditor.hideUnchangedRegions.enabled:', gDe('diffEditor.hideUnchangedRegions.enabled', 'diffEditor'));
console.log('7. diffEditor.experimental.showMoves:', gDe('diffEditor.experimental.showMoves', 'diffEditor'));
