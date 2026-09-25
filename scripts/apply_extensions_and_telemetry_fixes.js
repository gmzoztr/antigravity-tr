const fs = require('fs');
const path = require('path');

const { categories: newCats, labels: newLabels } = require('./generate_extension_translations');
const labelsByExt = require('./labels_by_ext.json');

// 1. Mevcut sözlükleri yükle
const allTrPath = path.join(__dirname, 'all_current_tr.json');
const allCatPath = path.join(__dirname, 'all_current_cat.json');

let allTr = fs.existsSync(allTrPath) ? JSON.parse(fs.readFileSync(allTrPath, 'utf8')) : {};
let allCat = fs.existsSync(allCatPath) ? JSON.parse(fs.readFileSync(allCatPath, 'utf8')) : {};

// 2. Kategorileri birleştir
Object.assign(allCat, newCats);

// Özel kategori eklemeleri
allCat["Feedback"] = "Geri Bildirim";
allCat["feedback"] = "Geri Bildirim";
allCat["Paste Images As Attachments"] = "Resimleri Ek Olarak Yapıştır";
allCat["pasteImagesAsAttachments"] = "Resimleri Ek Olarak Yapıştır";
allCat["Antigravity Dev Containers"] = "Antigravity Dev Containers";
allCat["Antigravity SSH"] = "Antigravity SSH";
allCat["Remote.WSL"] = "Uzak (Remote) › WSL";
allCat["Clangd"] = "Clangd";
allCat["clangd"] = "Clangd";

// 3. Etiketleri birleştir (Title Case, camelCase ve tam key)
Object.assign(allTr, newLabels);

// Her label için leaf ve camelCase türet
for (const [titleCase, trVal] of Object.entries(newLabels)) {
  // Title Case: "Enable Code Completion" -> camelCase: "enableCodeCompletion"
  const words = titleCase.split(' ');
  const camelCase = words[0].toLowerCase() + words.slice(1).join('');
  const lowerCase = titleCase.toLowerCase();

  allTr[camelCase] = trVal;
  allTr[lowerCase] = trVal;
  allTr[titleCase] = trVal;
}

// Tam ayar anahtarlarını (key) ekle
for (const [ext, items] of Object.entries(labelsByExt)) {
  for (const item of items) {
    const trVal = newLabels[item.label];
    if (trVal) {
      allTr[item.key] = trVal;
      // Leaf kısmını da ekle (ör. "clangd.arguments" -> "arguments")
      const parts = item.key.split('.');
      const leaf = parts[parts.length - 1];
      allTr[leaf] = trVal;
    }
  }
}

// Özel ayarlar garantiye alınsın
allTr["Feedback"] = "Geri Bildirim";
allTr["feedback"] = "Geri Bildirim";
allTr["telemetry.feedback"] = "Geri Bildirim";
allTr["telemetry.feedback.enabled"] = "Geri Bildirim";
allTr["Paste Images As Attachments"] = "Resimleri Ek Olarak Yapıştır";
allTr["pasteImagesAsAttachments"] = "Resimleri Ek Olarak Yapıştır";
allTr["ipynb.pasteImagesAsAttachments.enabled"] = "Resimleri Ek Olarak Yapıştır";

// Boolean "Etkin" / "Devre Dışı" korunması
allTr["Enabled"] = "Etkin";
allTr["enabled"] = "Etkin";
allTr["Enable"] = "Etkin";
allTr["enable"] = "Etkin";
allTr["Disabled"] = "Devre Dışı";
allTr["disabled"] = "Devre Dışı";

// Kalan özel leaf ve ayarlar
allTr["Preferences"] = "Tercihler";
allTr["preferences"] = "Tercihler";
allTr["Loop"] = "Döngü";
allTr["loop"] = "Döngü";
allTr["Exclude"] = "Dışla";
allTr["exclude"] = "Dışla";
allTr["Opacity"] = "Opaklık";
allTr["opacity"] = "Opaklık";
allTr["Default"] = "Varsayılan";
allTr["default"] = "Varsayılan";
allTr["Cwd"] = "Çalışma Dizini (CWD)";
allTr["cwd"] = "Çalışma Dizini (CWD)";
allTr["Count Badge"] = "Sayı Rozeti";
allTr["countBadge"] = "Sayı Rozeti";
allTr["Show Action Button"] = "Eylem Düğmesini Göster";
allTr["showActionButton"] = "Eylem Düğmesini Göster";
allTr["Auto Detect"] = "Görevleri Otomatik Algıla";
allTr["autoDetect"] = "Görevleri Otomatik Algıla";
allTr["Font Family"] = "Yazı Tipi Ailesi";
allTr["fontFamily"] = "Yazı Tipi Ailesi";
allTr["Font Size"] = "Yazı Tipi Boyutu";
allTr["fontSize"] = "Yazı Tipi Boyutu";
allTr["Line Height"] = "Satır Yüksekliği";
allTr["lineHeight"] = "Satır Yüksekliği";
allTr["Semantic Highlighting"] = "Anlamsal Vurgulama";
allTr["semanticHighlighting"] = "Anlamsal Vurgulama";
allTr["Inlay Hints"] = "Satır İçi İpuçları";
allTr["inlayHints"] = "Satır İçi İpuçları";
allTr["Auto Update"] = "Otomatik Güncelle";
allTr["autoUpdate"] = "Otomatik Güncelle";
allTr["Enable Telemetry"] = "Telemetriyi Etkinleştir";
allTr["enableTelemetry"] = "Telemetriyi Etkinleştir";

console.log(`Toplam kategoriler: ${Object.keys(allCat).length}`);
console.log(`Toplam ayar çevirileri: ${Object.keys(allTr).length}`);

// 4. all_current_tr.json ve all_current_cat.json dosyalarını kaydet
fs.writeFileSync(allTrPath, JSON.stringify(allTr, null, 2), 'utf8');
fs.writeFileSync(allCatPath, JSON.stringify(allCat, null, 2), 'utf8');
console.log('✓ all_current_tr.json ve all_current_cat.json güncellendi.');

// 5. locales/tr.json dosyasını güncelle
const trJsonPath = path.join(__dirname, '..', 'locales', 'tr.json');
const trJson = JSON.parse(fs.readFileSync(trJsonPath, 'utf8'));

// 5a. gdeRule güncellemesi
const gdeRule = trJson.rules.workbench.find(r => r.replace && r.replace.includes('_cat'));
if (!gdeRule) {
  throw new Error('gdeRule bulunamadı!');
}

const catStart = gdeRule.replace.indexOf('const _cat=') + 'const _cat='.length;
const catCalcStart = gdeRule.replace.indexOf(';const cat=');

gdeRule.replace =
  gdeRule.replace.slice(0, catStart) +
  JSON.stringify(allCat) +
  ';const _tr=' +
  JSON.stringify(allTr) +
  gdeRule.replace.slice(catCalcStart);

// 5b. Telemetri nlsMessages kurallarını ekle
const telemetryNlsRules = [
  {
    index: 2338,
    replace: "{0} uygulamasının kod parçacığı telemetrisini nasıl depoladığını yönetmek için [IDE Hesap Ayarları]({1}) sayfanızı ziyaret edin.\n"
  },
  {
    index: 2339,
    replace: "{0} IDE telemetrisini, birinci taraf uzantı telemetrisini ve katılan üçüncü taraf uzantı telemetrisini denetler. Bazı üçüncü taraf uzantılar bu ayara uymayabilir. Emin olmak için ilgili uzantının belgelerine bakın. Telemetri, {0} uygulamasının nasıl performans gösterdiğini, nerelerde iyileştirmeler yapılması gerektiğini ve özelliklerin nasıl kullanıldığını daha iyi anlamamıza yardımcı olur."
  },
  {
    index: 2340,
    replace: "[Topladığımız veriler]({0}) hakkında daha fazla bilgi edinin."
  },
  {
    index: 2341,
    replace: "[Topladığımız veriler]({0}) ve [gizlilik bildirimimiz]({1}) hakkında daha fazla bilgi edinin."
  },
  {
    index: 2342,
    replace: "Çökme raporlama değişikliklerinin geçerli olması için uygulamanın tamamen yeniden başlatılması gerekir."
  },
  {
    index: 2346,
    replace: "Aşağıdaki tabloda her ayarla gönderilen veriler özetlenmektedir:"
  },
  {
    index: 2347,
    replace: "****Not:*** Bu ayar 'off' ise, diğer telemetri ayarlarına bakılmaksızın hiçbir telemetri gönderilmez. Bu ayar 'off' dışında bir değere ayarlanmışsa ve telemetri desteği sonlandırılmış ayarlarla devre dışı bırakılmışsa hiçbir telemetri gönderilmez.*"
  },
  {
    index: 2358,
    replace: "Sorun bildirici, anketler ve diğer geri bildirim seçenekleri gibi geri bildirim mekanizmalarını etkinleştirin."
  },
  {
    index: 2359,
    replace: "Sorun bildirici, anketler ve diğer geri bildirim seçenekleri gibi geri bildirim mekanizmalarını etkinleştirin."
  },
  {
    index: 2360,
    replace: "Tanılama verilerinin toplanmasını etkinleştirin. Bu, {0} uygulamasının nasıl performans gösterdiğini ve nerelerde iyileştirme yapılması gerektiğini daha iyi anlamamıza yardımcı olur."
  },
  {
    index: 2361,
    replace: "Tanılama verilerinin toplanmasını etkinleştirin. Bu, {0} uygulamasının nasıl performans gösterdiğini ve nerelerde iyileştirme yapılması gerektiğini daha iyi anlamamıza yardımcı olur. Neler topladığımız ve gizlilik bildirimimiz hakkında [daha fazla bilgi edinin]({1})."
  },
  {
    index: 2362,
    replace: "Bu ayar false ise, yeni ayarın değerine bakılmaksızın hiçbir telemetri gönderilmez. {0} ayarı lehine kullanımdan kaldırılmıştır."
  }
];

// Mevcut kurallarda indeksleri güncelle veya ekle
const existingMap = new Map();
trJson.rules.nlsMessages.forEach(r => existingMap.set(r.index, r));

telemetryNlsRules.forEach(rule => {
  if (existingMap.has(rule.index)) {
    existingMap.get(rule.index).replace = rule.replace;
  } else {
    trJson.rules.nlsMessages.push(rule);
  }
});

// nlsMessages indeks sırasına göre sıralansın
trJson.rules.nlsMessages.sort((a, b) => a.index - b.index);

fs.writeFileSync(trJsonPath, JSON.stringify(trJson, null, 2), 'utf8');
console.log('✓ locales/tr.json güncellendi (gdeRule ve nlsMessages).');

// 6. src/settings_dictionary.js dosyasını güncelle
const dictJsPath = path.join(__dirname, '..', 'src', 'settings_dictionary.js');
const dictOut = '// Tam kategori segmentleri ve ayar etiketleri Türkçe sözlüğü\n' +
  'const categories = ' + JSON.stringify(allCat, null, 2) + ';\n\n' +
  'const settings = ' + JSON.stringify(allTr, null, 2) + ';\n\n' +
  'module.exports = { categories, settings };\n';

fs.writeFileSync(dictJsPath, dictOut, 'utf8');
console.log('✓ src/settings_dictionary.js güncellendi.');
