const fs = require('fs');
const path = require('path');

const appPath = 'C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app';

// 1. Enter workflow name ara
const bench = fs.readFileSync(path.join(appPath, 'out', 'vs', 'workbench', 'workbench.desktop.main.js.bak'), 'utf8');

let idx1 = bench.indexOf('Enter workflow name');
console.log('Enter workflow name in bench:', idx1);
if (idx1 !== -1) {
  console.log('Snippet around Enter workflow name:');
  console.log(bench.slice(idx1 - 100, idx1 + 150));
}

// 2. Show Primary Side Bar ara (NLS ve Workbench)
const nls = JSON.parse(fs.readFileSync(path.join(appPath, 'out', 'nls.messages.json'), 'utf8'));
nls.forEach((msg, idx) => {
  if (msg.includes('Primary Side Bar') || msg.includes('Side Bar')) {
    console.log(`NLS [${idx}]: "${msg}"`);
  }
});

let idx2 = 0;
while ((idx2 = bench.indexOf('Show Primary Side Bar', idx2)) !== -1) {
  console.log('Show Primary Side Bar in bench @', idx2);
  console.log(bench.slice(idx2 - 80, idx2 + 100));
  idx2 += 'Show Primary Side Bar'.length;
}

// Dil paketinde 'Show Primary Side Bar' var mı?
const lpFile = 'C:\\Users\\Work-D\\.antigravity-ide\\extensions\\ms-ceintl.vscode-language-pack-tr-1.106.0-universal\\translations\\main.i18n.json';
if (fs.existsSync(lpFile)) {
  const lp = fs.readFileSync(lpFile, 'utf8');
  console.log('lp has Primary Side Bar?:', lp.includes('Primary Side Bar'));
  console.log('lp has Birincil Kenar Çubuğu?:', lp.includes('Birincil Kenar Çubuğu'));
}
