const fs = require('fs');
const bench = fs.readFileSync('C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');

// "editor. ile başlayan ayarları bul
const regex = /"editor\.([a-zA-Z0-9._]+)"/g;
let m;
const editorKeys = new Set();
while ((m = regex.exec(bench)) !== null) {
  editorKeys.add(m[1]);
}
console.log('Bulunan editor.* ayar anahtarı sayısı:', editorKeys.size);

const list = Array.from(editorKeys).sort();
const matches = list.filter(l => l.toLowerCase().includes('async') || l.toLowerCase().includes('tree') || l.toLowerCase().includes('token'));
console.log('Eşleşmeler:\n', matches.join('\n'));

// gDe fonksiyonunun nasıl çalıştığını inceleyelim
const gDeIdx = bench.indexOf('function gDe(');
console.log('\ngDe tanımı:');
if (gDeIdx !== -1) {
  console.log(bench.slice(gDeIdx, gDeIdx + 400));
}
