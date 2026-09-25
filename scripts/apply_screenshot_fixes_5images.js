const fs = require('fs');

const dictPath = 'C:\\Users\\Work-D\\source\\antigravity-tr\\locales\\tr.json';
const trJson = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

// ── 1. _tr sözlüğünü güncelle ──────────────────────────────────────────────
const gdeRule = trJson.rules.workbench.find(r => r.replace && r.replace.includes('_cat'));
const trStart = gdeRule.replace.indexOf(';const _tr=') + ';const _tr='.length;
const catCalcStart = gdeRule.replace.indexOf(';const cat=');
const currentTr = JSON.parse(gdeRule.replace.slice(trStart, catCalcStart));

const newTrEntries = {
  // Görsel 3: Semantic Token Color Customizations
  "Semantic Token Color Customizations": "Anlamsal Belirteç Renk Özelleştirmeleri",
  "editor.semanticTokenColorCustomizations": "Anlamsal Belirteç Renk Özelleştirmeleri",

  // Görsel 4: Unicode Vurgulama başlıkları
  "Allowed Characters": "İzin Verilen Karakterler",
  "editor.unicodeHighlight.allowedCharacters": "İzin Verilen Karakterler",
  "Allowed Locales": "İzin Verilen Yerel Ayarlar",
  "editor.unicodeHighlight.allowedLocales": "İzin Verilen Yerel Ayarlar",

  // Görsel 5: Unicode Vurgulama başlıkları
  "Include Comments": "Yorumları Dahil Et",
  "editor.unicodeHighlight.includeComments": "Yorumları Dahil Et",
  "Include Strings": "Dizgileri Dahil Et",
  "editor.unicodeHighlight.includeStrings": "Dizgileri Dahil Et",
  "Non Basic ASCII": "Temel Olmayan ASCII",
  "editor.unicodeHighlight.nonBasicASCII": "Temel Olmayan ASCII",
  "Ambiguous Characters": "Belirsiz Karakterler",
  "editor.unicodeHighlight.ambiguousCharacters": "Belirsiz Karakterler",
  "Invisible Characters": "Görünmez Karakterler",
  "editor.unicodeHighlight.invisibleCharacters": "Görünmez Karakterler"
};

Object.assign(currentTr, newTrEntries);

gdeRule.replace =
  gdeRule.replace.slice(0, trStart) +
  JSON.stringify(currentTr) +
  gdeRule.replace.slice(catCalcStart);

console.log('✓ _tr güncellendi:');
for (const [k, v] of Object.entries(newTrEntries)) {
  console.log(`   "${k}" -> "${v}"`);
}

// ── 2. _eTr enum sözlüğünü güncelle ────────────────────────────────────────
const enumRule = trJson.rules.workbench.find(r => r.replace && r.replace.includes('const _eTr='));
const eStart = enumRule.replace.indexOf('const _eTr=') + 'const _eTr='.length;
const eEnd   = enumRule.replace.indexOf('},d=wBa', eStart) + 1;
const currentETr = JSON.parse(enumRule.replace.slice(eStart, eEnd));

const newEnumEntries = {
  // Görsel 1: Ampul Önerisi: Etkin dropdown
  "onCode": "Kod Üzerinde",

  // Görsel 2: Çoklu İmleç Yapıştırma dropdown
  "spread": "Dağıt",
  "asIs": "Olduğu Gibi",

  // Görsel 2: Eşleşmeleri Vurgula dropdown
  "singleFile": "Tek Dosya",
  "multiFile": "Çoklu Dosya",

  // Görsel 5: Unicode Vurgulama dropdown
  "inUntrustedWorkspace": "Güvenilmeyen Çalışma Alanında",

  // Diğer editör enumları
  "configuredByTheme": "Temaya Göre Yapılandırılmış",
  "font": "Yazı Tipi",
  "copy": "Kopyala",
  "openLink": "Bağlantıyı Aç",
  "ctrlLeftClick": "Ctrl + Sol Tıklama",
  "dimmed": "Soluk",
  "editable": "Düzenlenebilir",
  "keepAll": "Tümünü Koru"
};

Object.assign(currentETr, newEnumEntries);

enumRule.replace =
  enumRule.replace.slice(0, eStart) +
  JSON.stringify(currentETr) +
  enumRule.replace.slice(eEnd);

console.log('✓ _eTr güncellendi:');
for (const [k, v] of Object.entries(newEnumEntries)) {
  console.log(`   "${k}" -> "${v}"`);
}

// ── 3. settings_dictionary.js senkronize et ────────────────────────────────
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
