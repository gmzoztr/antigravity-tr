const fs = require('fs');
const path = require('path');

// 1. Önceki çalışan taban sözlüğü yükle (851e082)
const prev = require('./prev_851e082_dict.js');
const { categories: newCats, labels: newLabels } = require('./generate_extension_translations');
const labelsByExt = require('./labels_by_ext.json');

const finalCats = Object.assign({}, prev.categories, newCats);
const finalSettings = Object.assign({}, prev.settings, newLabels);

// 2. Özel Kategori Eklemeleri
finalCats["Feedback"] = "Geri Bildirim";
finalCats["feedback"] = "Geri Bildirim";
finalCats["Paste Images As Attachments"] = "Resimleri Ek Olarak Yapıştır";
finalCats["pasteImagesAsAttachments"] = "Resimleri Ek Olarak Yapıştır";
finalCats["Antigravity Dev Containers"] = "Antigravity Dev Containers";
finalCats["Antigravity SSH"] = "Antigravity SSH";
finalCats["Remote.WSL"] = "Uzak (Remote) › WSL";
finalCats["Remote"] = "Uzak (Remote)";
finalCats["remote"] = "Uzak (Remote)";
finalCats["Experimental"] = "Deneysel";
finalCats["experimental"] = "Deneysel";
finalCats["Clangd"] = "Clangd";
finalCats["clangd"] = "Clangd";
finalCats["Media Preview"] = "Medya Önizlemesi";
finalCats["Merge-conflict"] = "Birleştirme Çakışması";
finalCats["Mermaid-chat"] = "Mermaid Sohbeti";
finalCats["Npm"] = "npm";
finalCats["npm"] = "npm";

// 3. Her yeni label için leaf ve camelCase türet
for (const [titleCase, trVal] of Object.entries(newLabels)) {
  const words = titleCase.split(' ');
  const camelCase = words[0].toLowerCase() + words.slice(1).join('');
  const lowerCase = titleCase.toLowerCase();

  finalSettings[camelCase] = trVal;
  finalSettings[lowerCase] = trVal;
  finalSettings[titleCase] = trVal;
}

// 4. Tam ayar anahtarlarını (key) ekle
for (const [ext, items] of Object.entries(labelsByExt)) {
  for (const item of items) {
    const trVal = newLabels[item.label];
    if (trVal) {
      finalSettings[item.key] = trVal;
      const parts = item.key.split('.');
      const leaf = parts[parts.length - 1];
      finalSettings[leaf] = trVal;
    }
  }
}

// 5. Çekirdek ve Görsel Ayarlarını Kesinlikle Garantiye Al
const mandatoryCoreFixes = {
  // Görseldeki Sık Kullanılanlar
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

  // Boolean Etkin / Devre Dışı
  "Enabled": "Etkin",
  "enabled": "Etkin",
  "Enable": "Etkin",
  "enable": "Etkin",
  "Disabled": "Devre Dışı",
  "disabled": "Devre Dışı",

  // Telemetri ve Feedback
  "Feedback": "Geri Bildirim",
  "feedback": "Geri Bildirim",
  "telemetry.feedback": "Geri Bildirim",
  "telemetry.feedback.enabled": "Geri Bildirim",
  "telemetry.telemetryLevel": "Telemetri Düzeyi",
  "telemetryLevel": "Telemetri Düzeyi",
  "Telemetry Level": "Telemetri Düzeyi",

  // .ipynb & Remote
  "Paste Images As Attachments": "Resimleri Ek Olarak Yapıştır",
  "pasteImagesAsAttachments": "Resimleri Ek Olarak Yapıştır",
  "ipynb.pasteImagesAsAttachments.enabled": "Resimleri Ek Olarak Yapıştır",
  "Config File": "Yapılandırma Dosyası",
  "configFile": "Yapılandırma Dosyası",
  "Path": "Yol",
  "path": "Yol",
  "Server Download Url Template": "Sunucu İndirme URL Şablonu",
  "serverDownloadUrlTemplate": "Sunucu İndirme URL Şablonu",
  "Server Binary Name": "Sunucu İkili Dosya Adı",
  "serverBinaryName": "Sunucu İkili Dosya Adı",
  "Disable Server Checksum": "Sunucu Sağlama Toplamını Devre Dışı Bırak",
  "disableServerChecksum": "Sunucu Sağlama Toplamını Devre Dışı Bırak",
  "Enable SSH Agent Forwarding": "SSH Aracısı İletimini Etkinleştir",
  "enableSSHAgentForwarding": "SSH Aracısı İletimini Etkinleştir",

  // Clangd
  "Arguments": "Bağımsız Değişkenler",
  "arguments": "Bağımsız Değişkenler",
  "Check Updates": "Güncellemeleri Denetle",
  "checkUpdates": "Güncellemeleri Denetle",
  "Detect Extension Conflicts": "Eklenti Çakışmalarını Algıla",
  "detectExtensionConflicts": "Eklenti Çakışmalarını Algıla",
  "Enable Code Completion": "Kod Tamamlamayı Etkinleştir",
  "enableCodeCompletion": "Kod Tamamlamayı Etkinleştir",
  "Enable Hover": "Üzerine Gelme İpuçlarını Etkinleştir",
  "enableHover": "Üzerine Gelme İpuçlarını Etkinleştir",
  "Fallback Flags": "Yedekleme Bayrakları",
  "fallbackFlags": "Yedekleme Bayrakları",
  "Inlay Hints": "Satır İçi İpuçları",
  "inlayHints": "Satır İçi İpuçları",
  "On Config Changed": "Yapılandırma Değiştiğinde",
  "onConfigChanged": "Yapılandırma Değiştiğinde",
  "Restart After Crash": "Çökme Sonrası Yeniden Başlat",
  "restartAfterCrash": "Çökme Sonrası Yeniden Başlat",
  "Server Completion Ranking": "Sunucu Tamamlama Sıralaması",
  "serverCompletionRanking": "Sunucu Tamamlama Sıralaması",
  "Semantic Highlighting": "Anlamsal Vurgulama",
  "semanticHighlighting": "Anlamsal Vurgulama",

  // Diğer önemli ayarlar
  "Preferences": "Tercihler",
  "preferences": "Tercihler",
  "Associations": "İlişkilendirmeler",
  "associations": "İlişkilendirmeler",
  "files.associations": "İlişkilendirmeler",
  "Token Color Customizations": "Belirteç Renk Özelleştirmeleri",
  "tokenColorCustomizations": "Belirteç Renk Özelleştirmeleri",
  "editor.tokenColorCustomizations": "Belirteç Renk Özelleştirmeleri",
  "Color Customizations": "Renk Özelleştirmeleri",
  "colorCustomizations": "Renk Özelleştirmeleri",
  "workbench.colorCustomizations": "Renk Özelleştirmeleri"
};

Object.assign(finalSettings, mandatoryCoreFixes);

console.log(`Toplam Birleşik Kategoriler: ${Object.keys(finalCats).length}`);
console.log(`Toplam Birleşik Ayarlar: ${Object.keys(finalSettings).length}`);

// 6. all_current_cat.json ve all_current_tr.json kaydet
fs.writeFileSync(path.join(__dirname, 'all_current_cat.json'), JSON.stringify(finalCats, null, 2), 'utf8');
fs.writeFileSync(path.join(__dirname, 'all_current_tr.json'), JSON.stringify(finalSettings, null, 2), 'utf8');

// 7. src/settings_dictionary.js kaydet
const dictJsPath = path.join(__dirname, '..', 'src', 'settings_dictionary.js');
const dictOut = '// Tam kategori segmentleri ve ayar etiketleri Türkçe sözlüğü\n' +
  'const categories = ' + JSON.stringify(finalCats, null, 2) + ';\n\n' +
  'const settings = ' + JSON.stringify(finalSettings, null, 2) + ';\n\n' +
  'module.exports = { categories, settings };\n';

fs.writeFileSync(dictJsPath, dictOut, 'utf8');
console.log('✓ src/settings_dictionary.js güncellendi.');

// 8. locales/tr.json gdeRule güncelle
const trJsonPath = path.join(__dirname, '..', 'locales', 'tr.json');
const trJson = JSON.parse(fs.readFileSync(trJsonPath, 'utf8'));

const gdeRule = trJson.rules.workbench.find(r => r.replace && r.replace.includes('_cat'));
if (!gdeRule) throw new Error('gdeRule bulunamadı!');

const catStart = gdeRule.replace.indexOf('const _cat=') + 'const _cat='.length;
const catCalcStart = gdeRule.replace.indexOf(';const cat=');

gdeRule.replace =
  gdeRule.replace.slice(0, catStart) +
  JSON.stringify(finalCats) +
  ';const _tr=' +
  JSON.stringify(finalSettings) +
  gdeRule.replace.slice(catCalcStart);

fs.writeFileSync(trJsonPath, JSON.stringify(trJson, null, 2), 'utf8');
console.log('✓ locales/tr.json güncellendi.');
