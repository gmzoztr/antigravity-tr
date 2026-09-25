const fs = require('fs');
const path = require('path');

const newTranslations = require('./remaining_194_translations');
const labelsByKeys = require('./remaining_194_labels.json');

// 1. Mevcut birleşik sözlükleri yükle
const allTrPath = path.join(__dirname, 'all_current_tr.json');
const allCatPath = path.join(__dirname, 'all_current_cat.json');

let allTr = JSON.parse(fs.readFileSync(allTrPath, 'utf8'));
let allCat = JSON.parse(fs.readFileSync(allCatPath, 'utf8'));

// 2. Kategori eklemeleri
const categoryAdditions = {
  "Css": "CSS",
  "SCSS": "SCSS",
  "LESS": "LESS",
  "Ipynb": ".ipynb",
  "Microsoft-sovereign-cloud": "Microsoft Bağımsız Bulut",
  "Microsoft-authentication": "Microsoft Kimlik Doğrulaması",
  "References": "Referanslar",
  "Simple Browser": "Basit Tarayıcı",
  "Cloud Code": "Cloud Code",
  "cloudcode": "Cloud Code",
  "Cloudcode": "Cloud Code",
  "Gemini Code Assist": "Gemini Code Assist",
  "geminicodeassist": "Gemini Code Assist",
  "Geminicodeassist": "Gemini Code Assist",
  "Inline Suggestions": "Satır İçi Öneriler",
  "inlineSuggestions": "Satır İçi Öneriler",
  "Inline suggestions": "Satır İçi Öneriler",
  "Beta": "Beta",
  "Azure": "Azure",
  "Prettier": "Prettier",
  "prettier": "Prettier",
  "Mermaid-chat": "Mermaid Sohbeti",
  "Merge-conflict": "Birleştirme Çakışması",
  "Media Preview": "Medya Önizlemesi",
  "Kubernetes": "Kubernetes",
  "Skaffold": "Skaffold",
  "Docker": "Docker",
  "Minikube": "Minikube",
  "Apigee": "Apigee"
};

Object.assign(allCat, categoryAdditions);

// 3. 190 Ayar Çevirilerini Ekle (Title Case, camelCase, lowerCase, tam anahtarlar)
Object.assign(allTr, newTranslations);

for (const [titleCase, trVal] of Object.entries(newTranslations)) {
  const words = titleCase.split(' ');
  const camelCase = words[0].toLowerCase() + words.slice(1).join('');
  const lowerCase = titleCase.toLowerCase();

  allTr[camelCase] = trVal;
  allTr[lowerCase] = trVal;
  allTr[titleCase] = trVal;
}

// Tam ayar anahtarlarını (key) ekle
for (const [titleCase, keys] of Object.entries(labelsByKeys)) {
  const trVal = newTranslations[titleCase];
  if (trVal) {
    for (const k of keys) {
      allTr[k] = trVal;
      const parts = k.split('.');
      const leaf = parts[parts.length - 1];
      allTr[leaf] = trVal;
    }
  }
}

// 4. Çekirdek ayarları KESİNLİKLE garantiye al (Auto Save, Tab Size vb.)
const mandatoryCoreFixes = {
  "Auto Save": "Otomatik Kaydet",
  "autoSave": "Otomatik Kaydet",
  "files.autoSave": "Otomatik Kaydet",
  "Tab Size": "Sekme Boyutu",
  "tabSize": "Sekme Boyutu",
  "editor.tabSize": "Sekme Boyutu",
  "Render Whitespace": "Boşluk Karakterlerini Göster",
  "renderWhitespace": "Boşluk Karakterlerini Göster",
  "editor.renderWhitespace": "Boşluk Karakterlerini Göster",
  "Font Size": "Yazı Tipi Boyutu",
  "fontSize": "Yazı Tipi Boyutu",
  "editor.fontSize": "Yazı Tipi Boyutu",
  "Font Family": "Yazı Tipi Ailesi",
  "fontFamily": "Yazı Tipi Ailesi",
  "editor.fontFamily": "Yazı Tipi Ailesi",
  "Cursor Style": "İmleç Stili",
  "cursorStyle": "İmleç Stili",
  "editor.cursorStyle": "İmleç Stili",
  "Word Wrap": "Sözcük Kaydırma",
  "wordWrap": "Sözcük Kaydırma",
  "editor.wordWrap": "Sözcük Kaydırma",
  "Detect Indentation": "Girintiyi Algıla",
  "detectIndentation": "Girintiyi Algıla",
  "editor.detectIndentation": "Girintiyi Algıla",
  "Enabled": "Etkin",
  "enabled": "Etkin",
  "Enable": "Etkin",
  "enable": "Etkin",
  "Disabled": "Devre Dışı",
  "disabled": "Devre Dışı",
  "Feedback": "Geri Bildirim",
  "feedback": "Geri Bildirim",
  "telemetry.feedback": "Geri Bildirim",
  "telemetry.feedback.enabled": "Geri Bildirim",
  "Paste Images As Attachments": "Resimleri Ek Olarak Yapıştır",
  "pasteImagesAsAttachments": "Resimleri Ek Olarak Yapıştır",
  "ipynb.pasteImagesAsAttachments.enabled": "Resimleri Ek Olarak Yapıştır",
  "Preferences": "Tercihler",
  "preferences": "Tercihler"
};

Object.assign(allTr, mandatoryCoreFixes);

console.log(`Toplam Güncel Kategori: ${Object.keys(allCat).length}`);
console.log(`Toplam Güncel Ayar: ${Object.keys(allTr).length}`);

// 5. all_current_cat.json ve all_current_tr.json kaydet
fs.writeFileSync(allTrPath, JSON.stringify(allTr, null, 2), 'utf8');
fs.writeFileSync(allCatPath, JSON.stringify(allCat, null, 2), 'utf8');

// 6. src/settings_dictionary.js kaydet
const dictJsPath = path.join(__dirname, '..', 'src', 'settings_dictionary.js');
const dictOut = '// Tam kategori segmentleri ve ayar etiketleri Türkçe sözlüğü\n' +
  'const categories = ' + JSON.stringify(allCat, null, 2) + ';\n\n' +
  'const settings = ' + JSON.stringify(allTr, null, 2) + ';\n\n' +
  'module.exports = { categories, settings };\n';

fs.writeFileSync(dictJsPath, dictOut, 'utf8');
console.log('✓ src/settings_dictionary.js güncellendi.');

// 7. locales/tr.json gdeRule güncelle
const trJsonPath = path.join(__dirname, '..', 'locales', 'tr.json');
const trJson = JSON.parse(fs.readFileSync(trJsonPath, 'utf8'));

const gdeRule = trJson.rules.workbench.find(r => r.replace && r.replace.includes('_cat'));
if (!gdeRule) throw new Error('gdeRule bulunamadı!');

const catStart = gdeRule.replace.indexOf('const _cat=') + 'const _cat='.length;
const catCalcStart = gdeRule.replace.indexOf(';const cat=');

gdeRule.replace =
  gdeRule.replace.slice(0, catStart) +
  JSON.stringify(allCat) +
  ';const _tr=' +
  JSON.stringify(allTr) +
  gdeRule.replace.slice(catCalcStart);

fs.writeFileSync(trJsonPath, JSON.stringify(trJson, null, 2), 'utf8');
console.log('✓ locales/tr.json güncellendi.');
