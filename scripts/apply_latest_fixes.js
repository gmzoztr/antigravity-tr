const fs = require('fs');
const vm = require('vm');

const dictPath = 'C:\\Users\\Work-D\\source\\antigravity-tr\\locales\\tr.json';
const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

console.log('--- 1. Dropdown detail temizliği (auto, always, never kaldırılıyor) ---');

const wRule = dict.rules.workbench.find(r => r.replace && r.replace.includes('_eTr'));

// detail:n[g]?f:(_eTr[f]?f:"") -> detail:n[g]?f:""
wRule.replace = wRule.replace.replace('detail:n[g]?f:(_eTr[f]?f:"")', 'detail:n[g]?f:""');

console.log('--- 2. Metin Düzenleyici Eksik Ayar Başlıkları Ekleniyor ---');

const newEditorSettings = {
  // Görsel 1'deki ayarlar
  "Async Tokenization Logging": "Zaman Uyumsuz Belirteç Ayırma Günlüğü",
  "Async Tokenization Verification": "Zaman Uyumsuz Belirteç Ayırma Doğrulaması",
  "Async Tokenization": "Zaman Uyumsuz Belirteç Ayırma",
  "Tree Sitter Telemetry": "Tree-sitter Telemetrisi",
  "Prefer Tree Sitter": "Tree-sitter Tercih Et",
  
  // Aşağı kaydırdıkça çıkan diğer ayarlar
  "Ambiguous Characters": "Belirsiz Karakterler",
  "Invisible Characters": "Görünmez Karakterler",
  "Colorized Bracket Pairs": "Renklendirilmiş Ayraç Çiftleri",
  "Auto Find In Selection": "Seçim İçinde Otomatik Bul",
  "Seed Search String From Selection": "Arama Dizgisini Seçimden Başlat",
  "Global Find Clipboard": "Genel Bulma Panosu",
  "Add Extra Space On Top": "Üst Kısma Ekstra Boşluk Ekle",
  "Find On Type": "Yazarken Bul",
  "Max Line Count": "Maksimum Satır Sayısı",
  "Default Model": "Varsayılan Model",
  "Multiple Definitions": "Çoklu Tanımlar",
  "Multiple Type Definitions": "Çoklu Tür Tanımları",
  "Multiple Declarations": "Çoklu Bildirimler",
  "Multiple Implementations": "Çoklu Uygulamalar",
  "Multiple References": "Çoklu Başvurular",
  "Alternative Definition Command": "Alternatif Tanım Komutu",
  "Alternative Type Definition Command": "Alternatif Tür Tanımı Komutu",
  "Alternative Declaration Command": "Alternatif Bildirim Komutu",
  "Alternative Implementation Command": "Alternatif Uygulama Komutu",
  "Alternative Reference Command": "Alternatif Başvuru Komutu",
  "Peek Implementation": "Uygulamaya Gözat",
  "Go To Implementation": "Uygulamaya Git",
  "Peek Type Definition": "Tür Tanımına Gözat",
  "Go To Type Definition": "Tür Tanımına Git",
  "Peek Declaration": "Bildirime Gözat",
  "Reveal Declaration": "Bildirimi Göster",
  "Peek Definition": "Tanıma Gözat",
  "Reveal Definition": "Tanımı Göster",
  "Reveal Definition Aside": "Tanımı Yanda Göster",
  "Cursor Move On Type": "Yazarken İmleci Taşı",
  "Insert Space": "Boşluk Ekle",
  "Ignore Empty Lines": "Boş Satırları Yoksay",
  "Marker Decorations": "İşaretçi Süslemeleri",
  "Select All": "Tümünü Seç",
  "Contributions": "Katkılar",
  "Modes Registry": "Modlar Kayıt Defteri",
  "Replace History": "Değiştirme Geçmişi",
  "Hiding Delay": "Gizleme Gecikmesi"
};

// gde kuralındaki _tr objesini güncelle
const gdeRule = dict.rules.workbench.find(r => r.replace && r.replace.includes('_cat'));

const trStart = gdeRule.replace.indexOf('const _tr=');
const catCalcStart = gdeRule.replace.indexOf(';const cat=');

const currentTrObj = JSON.parse(gdeRule.replace.slice(trStart + 'const _tr='.length, catCalcStart));
Object.assign(currentTrObj, newEditorSettings);

const newGdeReplace = gdeRule.replace.slice(0, trStart) + 'const _tr=' + JSON.stringify(currentTrObj) + gdeRule.replace.slice(catCalcStart);
gdeRule.replace = newGdeReplace;

// settings_dictionary.js dosyasına da ekleyelim
const settingsDict = require('C:\\Users\\Work-D\\source\\antigravity-tr\\src\\settings_dictionary.js');
Object.assign(settingsDict.settings, newEditorSettings);
const dictOut = '// Tam kategori segmentleri ve ayar etiketleri Türkçe sözlüğü\n' +
  'const categories = ' + JSON.stringify(settingsDict.categories, null, 2) + ';\n\n' +
  'const settings = ' + JSON.stringify(settingsDict.settings, null, 2) + ';\n\n' +
  'module.exports = { categories, settings };\n';
fs.writeFileSync('C:\\Users\\Work-D\\source\\antigravity-tr\\src\\settings_dictionary.js', dictOut, 'utf8');

fs.writeFileSync(dictPath, JSON.stringify(dict, null, 2), 'utf8');
console.log('locales/tr.json ve settings_dictionary.js başarıyla güncellendi.');

// V8 derleme testi
const bak = fs.readFileSync('C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');
let testCode = bak;
for (const rule of dict.rules.workbench) {
  testCode = testCode.replaceAll(rule.search, rule.replace);
}

try {
  new vm.SourceTextModule(testCode);
  console.log('V8 MODÜL DERLEMESİ GEÇERLİ [✓][✓][✓]');
} catch (e) {
  console.error('V8 DERLEME HATASI:', e);
  process.exit(1);
}
