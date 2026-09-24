const fs = require('fs');

const dictPath = 'C:\\Users\\Work-D\\source\\antigravity-tr\\locales\\tr.json';
const trJson = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

// ── 1. _tr sözlüğüne eksik ayar başlıklarını ekle ──────────────────────────
const gdeRule = trJson.rules.workbench.find(r => r.replace && r.replace.includes('_cat'));
const trStart = gdeRule.replace.indexOf(';const _tr=') + ';const _tr='.length;
const catCalcStart = gdeRule.replace.indexOf(';const cat=');
const currentTr = JSON.parse(gdeRule.replace.slice(trStart, catCalcStart));

const newTrEntries = {
  "Default Folding Range Provider": "Varsayılan Katlama Aralığı Sağlayıcısı",
  "Preferences": "Tercihler",
  "Show Drop Selector": "Bırakma Seçicisini Göster",
  "Bracket Pairs Horizontal": "Yatay Ayraç Çiftleri",
  "Highlight Active Bracket Pair": "Etkin Ayraç Çiftini Vurgula",
  "Highlight Active Indentation": "Etkin Girintiyi Vurgula",
  "Indentation": "Girinti"
};

Object.assign(currentTr, newTrEntries);

gdeRule.replace =
  gdeRule.replace.slice(0, trStart) +
  JSON.stringify(currentTr) +
  gdeRule.replace.slice(catCalcStart);

console.log('✓ _tr güncellendi:', Object.keys(newTrEntries).join(', '));

// ── 2. _eTr sözlüğüne eksik enum değerlerini ekle ──────────────────────────
const enumRule = trJson.rules.workbench.find(r => r.replace && r.replace.includes('const _eTr='));
const eStart = enumRule.replace.indexOf('const _eTr=') + 'const _eTr='.length;
const eEnd   = enumRule.replace.indexOf('},d=wBa', eStart) + 1;
const currentETr = JSON.parse(enumRule.replace.slice(eStart, eEnd));

const newEnumEntries = {
  "afterDrop": "Bıraktıktan Sonra",
  "peek": "Gözat",
  "gotoAndPeek": "Git ve Gözat",
  "goto": "Git",
  "afterPaste": "Yapıştırdıktan Sonra",
  "always": "Her Zaman",
  "never": "Asla",
  "explicit": "Açık",
  "manual": "Manuel",
  "wordWrapColumn": "Sözcük Kaydırma Sütununda",
  "bounded": "Sınırlı",
  "same": "Aynı",
  "side": "Yana",
  "indent": "Girinti",
  "deepIndent": "Derin Girinti",
  "block": "Blok",
  "line": "Satır",
  "underline": "Altı Çizili",
  "lineThin": "İnce Satır",
  "blockOutline": "Blok Anahat",
  "underlineThin": "İnce Altı Çizili",
  "smooth": "Düzgün",
  "immediate": "Anında",
  "first": "İlk",
  "smart": "Akıllı",
  "recentlyUsed": "Son Kullanılan",
  "recentlyUsedByPrefix": "Önek Göre Son Kullanılan",
  "selected": "Seçili",
  "allDocuments": "Tüm Belgeler",
  "openDocuments": "Açık Belgeler",
  "fixedSize": "Sabit Boyut",
  "fill": "Doldur",
  "fit": "Sığdır",
  "proportional": "Orantılı",
  "left": "Sol",
  "right": "Sağ",
  "top": "Üst",
  "bottom": "Alt",
  "hidden": "Gizli",
  "visible": "Görünür",
  "wordWrap": "Sözcük Kaydırma"
};

Object.assign(currentETr, newEnumEntries);

enumRule.replace =
  enumRule.replace.slice(0, eStart) +
  JSON.stringify(currentETr) +
  enumRule.replace.slice(eEnd);

console.log('✓ _eTr güncellendi:', Object.keys(newEnumEntries).length, 'yeni değer eklendi');

// ── 3. settings_dictionary.js'e de ekle ────────────────────────────────────
const dictJs = require('C:\\Users\\Work-D\\source\\antigravity-tr\\src\\settings_dictionary.js');
Object.assign(dictJs.settings, newTrEntries);

const dictOut = '// Tam kategori segmentleri ve ayar etiketleri Türkçe sözlüğü\n' +
  'const categories = ' + JSON.stringify(dictJs.categories, null, 2) + ';\n\n' +
  'const settings = ' + JSON.stringify(dictJs.settings, null, 2) + ';\n\n' +
  'module.exports = { categories, settings };\n';
fs.writeFileSync('C:\\Users\\Work-D\\source\\antigravity-tr\\src\\settings_dictionary.js', dictOut, 'utf8');

// ── 4. Kaydet ───────────────────────────────────────────────────────────────
fs.writeFileSync(dictPath, JSON.stringify(trJson, null, 2), 'utf8');
console.log('✓ locales/tr.json kaydedildi');
console.log('✓ src/settings_dictionary.js kaydedildi');

// ── 5. NLS: "Sonuçların Peek görünümünü göster" → "Sonuçların Gözat görünümünü göster" ──
const lpPath = 'C:\\Users\\Work-D\\.antigravity\\extensions\\ms-ceintl.vscode-language-pack-tr-1.106.0-universal\\translations\\main.i18n.json';
const lpData = JSON.parse(fs.readFileSync(lpPath, 'utf8'));
const opts = lpData.contents['vs/editor/common/config/editorOptions'];
if (opts) {
  if (opts['editor.gotoLocation.multiple.peek']) {
    opts['editor.gotoLocation.multiple.peek'] = 'Sonuçların Gözat görünümünü göster (varsayılan)';
  }
  if (opts['editor.gotoLocation.multiple.goto']) {
    opts['editor.gotoLocation.multiple.goto'] = 'Birincil sonuca gidin ve diğerlerine Gözatsız gezinmeyi etkinleştirin';
  }
  if (opts['editor.gotoLocation.multiple.gotoAndPeek']) {
    opts['editor.gotoLocation.multiple.gotoAndPeek'] = 'Birincil sonuca gidin ve bir Gözat görünümü gösterin';
  }
  fs.writeFileSync(lpPath, JSON.stringify(lpData), 'utf8');
  console.log('✓ main.i18n.json NLS güncellendi (peek→Gözat)');
}
