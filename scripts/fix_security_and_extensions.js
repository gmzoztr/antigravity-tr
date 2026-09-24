const fs = require('fs');

const dictPath = 'C:\\Users\\Work-D\\source\\antigravity-tr\\locales\\tr.json';
const trJson = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

// 1. gdeRule'u bul
const gdeRule = trJson.rules.workbench.find(r => r.replace && r.replace.includes('_cat'));
const catS = gdeRule.replace.indexOf('const _cat=') + 'const _cat='.length;
const trS  = gdeRule.replace.indexOf(';const _tr=') + ';const _tr='.length;
const catCalc = gdeRule.replace.indexOf(';const cat=');

const _cat = JSON.parse(gdeRule.replace.slice(catS, gdeRule.replace.indexOf(';const _tr=')));
const _tr  = JSON.parse(gdeRule.replace.slice(trS, catCalc));

// 2. Eksik veya hatalı kategorileri güncelle
const newCat = {
  "Workspace": "Çalışma Alanı",
  "Trust": "Güven",
  "Workspace Trust": "Çalışma Alanı Güveni",
  "Security": "Güvenlik",
  "Extensions": "Uzantılar",
  "Antigravity Editor": "Antigravity Düzenleyici",
  "Antigravity Remote - Dev Containers": "Antigravity Uzak - Geliştirme Kapsayıcıları",
  "Antigravity Remote - SSH": "Antigravity Uzak - SSH",
  "Media Previewer": "Medya Önizleyici",
  "JavaScript Debugger": "JavaScript Hata Ayıklayıcısı",
  "Codex Settings": "Codex Ayarları",
  "Claude Code": "Claude Code"
};
Object.assign(_cat, newCat);

// 3. Eksik veya bozuk etiketleri güncelle
const newTr = {
  // Güvenlik etiketleri
  "Startup Prompt": "Başlangıç İstemi",
  "Banner": "Başlık Bandı",
  "Untrusted Files": "Güvenilmeyen Dosyalar",
  "Empty Window": "Boş Pencere",
  "Restrict UNC Access": "UNC Erişimini Kısıtla",
  "Prompt For Local File Protocol Handling": "Yerel Dosya Protokolü İçin Sor",
  "Prompt For Remote File Protocol Handling": "Uzak Dosya Protokolü İçin Sor",
  "Allowed UNC Hosts": "İzin Verilen UNC Ana Bilgisayarları",

  // Uzantılar etiketleri
  "Verify Signature": "İmzayı Doğrula",
  "Request Timeout": "İstek Zaman Aşımı",
  "Support Untrusted Workspaces": "Güvenilmeyen Çalışma Alanlarını Destekle",
  "Auto Restart": "Otomatik Yeniden Başlat",
  "Confirmed URI Handler Extension Ids": "Onaylanan URI İşleyici Uzantı Kimlikleri",
  "Ignore Recommendations": "Önerileri Yoksay",
  "Show Recommendations Only On Demand": "Önerileri Yalnızca İstek Üzerine Göster",
  "Close Extension Details On View Change": "Görünüm Değiştiğinde Uzantı Ayrıntılarını Kapat",
  "Deferred Startup Finished Activation": "Ertelenmiş Başlangıç Tamamlama Etkinleştirmesi",
  "Trusted Publishers": "Güvenilen Yayıncılar",
  "Tools Contribution": "Araçlar Katkısı",
  "Featured": "Öne Çıkanlar",
  "Service URL": "Hizmet URL'si",
  "Issue Quick Access": "Sorun Hızlı Erişimi",
  "Affinity": "Benzerlik",

  // Tam anahtar olarak doğrudan eşleşme garantisi
  "security.workspace.trust.enabled": "Etkin",
  "security.workspace.trust.startupPrompt": "Başlangıç İstemi",
  "security.workspace.trust.banner": "Başlık Bandı",
  "security.workspace.trust.untrustedFiles": "Güvenilmeyen Dosyalar",
  "security.workspace.trust.emptyWindow": "Boş Pencere",
  "security.allowedUNCHosts": "İzin Verilen UNC Ana Bilgisayarları",
  "security.restrictUNCAccess": "UNC Erişimini Kısıtla",
  "security.promptForLocalFileProtocolHandling": "Yerel Dosya Protokolü İçin Sor",
  "security.promptForRemoteFileProtocolHandling": "Uzak Dosya Protokolü İçin Sor",
  "extensions.verifySignature": "İmzayı Doğrula",
  "extensions.requestTimeout": "İstek Zaman Aşımı",
  "extensions.webWorker": "Web Çalışanı",
  "extensions.supportUntrustedWorkspaces": "Güvenilmeyen Çalışma Alanlarını Destekle",
  "extensions.supportVirtualWorkspaces": "Sanal Çalışma Alanlarını Destekle",
  "extensions.autoUpdate": "Otomatik Güncelle",
  "extensions.autoCheckUpdates": "Güncellemeleri Otomatik Denetle",
  "extensions.closeExtensionDetailsOnViewChange": "Görünüm Değiştiğinde Uzantı Ayrıntılarını Kapat",
  "extensions.autoRestart": "Otomatik Yeniden Başlat",
  "extensions.confirmedUriHandlerExtensionIds": "Onaylanan URI İşleyici Uzantı Kimlikleri",
  "extensions.ignoreRecommendations": "Önerileri Yoksay",
  "extensions.showRecommendationsOnlyOnDemand": "Önerileri Yalnızca İstek Üzerine Göster",
  "extensions.experimental.affinity": "Benzerlik",
  "extensions.experimental.deferredStartupFinishedActivation": "Ertelenmiş Başlangıç Tamamlama Etkinleştirmesi",
  "extensions.experimental.issueQuickAccess": "Sorun Hızlı Erişimi",
  "extensions.supportNodeGlobalNavigator": "Node Global Gezginini Destekle",
  "extensions.trustedPublishers": "Güvenilen Yayıncılar"
};
Object.assign(_tr, newTr);

// 4. gdeRule'u yeniden oluştur
gdeRule.replace =
  'const s=NLa(t);const _cat=' + JSON.stringify(_cat) +
  ';const _tr=' + JSON.stringify(_tr) +
  gdeRule.replace.slice(catCalc);

// 5. _eTr enum sözlüğünü de güncelle
const enumRule = trJson.rules.workbench.find(r => r.replace && r.replace.includes('const _eTr='));
const eStart = enumRule.replace.indexOf('const _eTr=') + 'const _eTr='.length;
const eEnd   = enumRule.replace.indexOf('},d=wBa', eStart) + 1;
const _eTr   = JSON.parse(enumRule.replace.slice(eStart, eEnd));

const newEnums = {
  "prompt": "Sor",
  "untilDismissed": "Kapatılana Kadar",
  "onlyEnabledExtensions": "Yalnızca Etkin Uzantılar"
};
Object.assign(_eTr, newEnums);

enumRule.replace =
  enumRule.replace.slice(0, eStart) +
  JSON.stringify(_eTr) +
  enumRule.replace.slice(eEnd);

// 6. settings_dictionary.js dosyasını senkronize et
const dictJs = require('C:\\Users\\Work-D\\source\\antigravity-tr\\src\\settings_dictionary.js');
Object.assign(dictJs.categories, _cat);
Object.assign(dictJs.settings, _tr);

const dictOut = '// Tam kategori segmentleri ve ayar etiketleri Türkçe sözlüğü\n' +
  'const categories = ' + JSON.stringify(dictJs.categories, null, 2) + ';\n\n' +
  'const settings = ' + JSON.stringify(dictJs.settings, null, 2) + ';\n\n' +
  'module.exports = { categories, settings };\n';
fs.writeFileSync('C:\\Users\\Work-D\\source\\antigravity-tr\\src\\settings_dictionary.js', dictOut, 'utf8');

// 7. Kaydet
fs.writeFileSync(dictPath, JSON.stringify(trJson, null, 2), 'utf8');
console.log('✓ Güvenlik ve Uzantılar sözlükleri başarıyla güncellendi.');
