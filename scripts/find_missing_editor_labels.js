const fs = require('fs');
const dict = require('C:\\Users\\Work-D\\source\\antigravity-tr\\src\\settings_dictionary.js');

const bench = fs.readFileSync('C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');

// NLa fonksiyonunun JS karşılığı (camelCase -> Word Word)
function NLa(t) {
  return t
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .replace(/^./, str => str.toUpperCase());
}

// "editor. ile başlayan ayarları bul
const regex = /"editor\.([a-zA-Z0-9._]+)"/g;
let m;
const editorSettings = new Set();
while ((m = regex.exec(bench)) !== null) {
  const full = m[1];
  // Son yaprak etiketi ve kategori ayrımı
  const lastDot = full.lastIndexOf('.');
  const leaf = lastDot !== -1 ? full.slice(lastDot + 1) : full;
  const label = NLa(leaf);
  editorSettings.add({ full, leaf, label });
}

console.log('Bulunan toplam editor ayarı sayısı:', editorSettings.size);

// _tr sözlüğünde var mı?
const missing = [];
for (const item of editorSettings) {
  if (!dict.settings[item.label] && !dict.settings[item.full]) {
    missing.push(item);
  }
}

console.log('Sözlükte eksik olan editor ayar sayısı:', missing.length);
// İlk 40 eksik örneği
console.log('\nÖrnek eksikler:');
const sample = missing.slice(0, 50);
for (const s of sample) {
  console.log(`"${s.label}": "${s.full}"`);
}

// Tüm eksik listesini json'a kaydedelim
fs.writeFileSync('C:\\Users\\Work-D\\source\\antigravity-tr\\scripts\\missing_editor_settings.json', JSON.stringify(missing, null, 2), 'utf8');
