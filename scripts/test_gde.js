const fs = require('fs');

const benchCode = fs.readFileSync('C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js', 'utf8');

// Gerçek gDe fonksiyonunu benchCode içinden alalım
const gdeIdx = benchCode.indexOf('function gDe(');
const gdeEnd = benchCode.indexOf('function jIh(', gdeIdx);
const gdeCode = benchCode.slice(gdeIdx, gdeEnd);

const FLa = new Set(["css", "html", "json", "url", "uri", "api", "id", "git", "gpu", "ui", "ip", "cpu", "sdk", "ai", "sql", "ssh", "ftp", "http", "https", "svg", "pdf", "xml", "ansi", "rgb", "rgba"]);
const Lee = new Map([["jetbrains", "JetBrains"], ["re sharper", "ReSharper"], ["resharper", "ReSharper"]]);

function NLa(t){t=t.replace(/\.([a-z0-9])/g,(e,i)=>` \u203A ${i.toUpperCase()}`).replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/([A-Z]{1,})([A-Z][a-z])/g,"$1 $2").replace(/^[a-z]/g,e=>e.toUpperCase()).replace(/\b\w+\b/g,e=>FLa.has(e.toLowerCase())?e.toUpperCase():e);for(const[e,i]of Lee)t=t.replace(new RegExp(`\\b${e}\\b`,"gi"),i);return t}
function oln(t) { return t; }
function jIh(r, e) { return r; }

eval(gdeCode);

const testKeys = [
  'editor.tabSize',
  'editor.defaultFoldingRangeProvider',
  'editor.guides.bracketPairsHorizontal',
  'editor.dropIntoEditor.showDropSelector',
  'terminal.integrated.fontSize',
  'workbench.colorTheme'
];

for (const k of testKeys) {
  const res = gDe(k);
  console.log(k, '=>', res);
}
