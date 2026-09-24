const fs = require('fs');

const nls = JSON.parse(fs.readFileSync('C:\\Users\\Work-D\\.antigravity\\extensions\\ms-ceintl.vscode-language-pack-tr-1.106.0-universal\\translations\\main.i18n.json', 'utf8'));

// NLS içinde 11283 ve 11284 anahtarlarını bul
const bench = fs.readFileSync('C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');

// p(11283) ve p(11284) fonksiyonunun eşleştiği anahtarları bulalım
// Format: p(11283, null) -> NLS mesajları tablosu
console.log('11283 ve 11284 nls araması:');
const nlsTableMatch = bench.match(/function p\((\w+),(\w+)\)\{/);
console.log('p function match:', nlsTableMatch ? nlsTableMatch[0] : 'not found');
