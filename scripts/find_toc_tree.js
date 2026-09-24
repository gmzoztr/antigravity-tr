const fs = require('fs');

const bench = fs.readFileSync('C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');

// TOC oluşturma veya Settings Tree arama
// Örneğin "security" ve "extensions" kategorilerinin TOC kayıtları
const tocRegex = /id:\s*['"](security|extensions)['"][^}]+title:\s*([a-zA-Z0-9_$.()]+)/g;
let m;
while ((m = tocRegex.exec(bench)) !== null) {
  console.log('TOC item:', m[0].slice(0, 150));
}

// ConfigurationRegistry içinde order veya tocTitle
const catRegex = /category:\s*['"](Security|Extensions|security|extensions)['"]/gi;
let match;
while ((match = catRegex.exec(bench)) !== null) {
  console.log('Category match:', bench.slice(match.index - 50, match.index + 100));
}
