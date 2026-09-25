const fs = require('fs');
const path = require('path');

// 106 flagged settings clean Turkish translations
const comprehensiveTranslations = {
  // Editor
  "editor.minimap.markSectionHeaderRegex": "Bölüm Başlığı İşareti Normal İfadesi (Regex)",
  "editor.scrollbar.ignoreHorizontalScrollbarInContentHeight": "İçerik Yüksekliğinde Yatay Kaydırma Çubuğunu Yoksay",
  "editor.experimental.preferTreeSitter.regex": "Tree-sitter Normal İfadesi",
  "diffEditor.ignoreTrimWhitespace": "Kırpılan Boşlukları Yoksay",
  
  // HTTP
  "http.proxyStrictSSL": "Katı SSL Proxy",
  "http.experimental.networkInterfaceCheckInterval": "Ağ Arayüzü Denetim Aralığı",
  
  // Terminal
  "terminal.integrated.inheritEnv": "Ortam Değişkenlerini Devral",
  "terminal.integrated.ignoreProcessNames": "Yoksayılacak İşlem Adları",
  "terminal.integrated.tabs.showActiveTerminal": "Etkin Terminali Göster",
  "terminal.integrated.detectLocale": "Yerel Ayarı Algıla",
  "terminal.integrated.ignoreBracketedPasteMode": "Köşeli Parantezli Yapıştırma Modunu Yoksay",

  // Chat / AI Tools
  "chat.tools.terminal.enableAutoApprove": "Otomatik Onaylamayı Etkinleştir",
  "chat.tools.terminal.ignoreDefaultAutoApproveRules": "Varsayılan Otomatik Onay Kurallarını Yoksay",
  "chat.tools.terminal.blockDetectedFileWrites": "Algılanan Dosya Yazma İşlemlerini Engelle",
  "chat.tools.terminal.shellIntegrationTimeout": "Kabuk Tümleştirmesi Zaman Aşımı",
  "chat.tools.terminal.terminalProfile.linux": "Linux Terminal Profili",
  "chat.tools.terminal.terminalProfile.osx": "OS X Terminal Profili",
  "chat.tools.terminal.terminalProfile.windows": "Windows Terminal Profili",
  "chat.tools.terminal.autoReplyToPrompts": "Komut İstemlerini Otomatik Yanıtla",
  "chat.tools.terminal.outputLocation": "Çıktı Konumu",
  "chat.agent.thinking.collapsedTools": "Daraltılmış Araçlar",

  // Accessibility
  "accessibility.verbosity.terminal": "Terminal",
  "accessibility.verbosity.panelChat": "Panel Sohbeti",
  "accessibility.verbosity.inlineChat": "Satır İçi Sohbet",
  "accessibility.verbosity.terminalChatOutput": "Terminal Sohbet Çıktısı",
  "accessibility.verbosity.notebook": "Not Defteri",
  "accessibility.signals.terminalCommandFailed": "Terminal Komutu Başarısız Oldu",
  "accessibility.signals.terminalCommandSucceeded": "Terminal Komutu Başarılı Oldu",
  "accessibility.signals.terminalQuickFix": "Terminal Hızlı Düzeltmesi",
  "accessibility.signals.terminalBell": "Terminal Zili",
  "accessibility.signals.chatEditModifiedFile": "Sohbet Düzenlemesiyle Değiştirilen Dosya",
  "accessibility.signals.notebookCellCompleted": "Not Defteri Hücresi Tamamlandı",
  "accessibility.signals.notebookCellFailed": "Not Defteri Hücresi Başarısız Oldu",
  "accessibility.signals.chatRequestSent": "Sohbet İsteği Gönderildi",
  "accessibility.signals.chatResponseReceived": "Sohbet Yanıtı Alındı",
  "accessibility.signals.chatUserActionRequired": "Sohbette Kullanıcı Eylemi Gerekli",
  "accessibility.openChatEditedFiles": "Sohbetle Düzenlenen Dosyaları Aç",
  "accessibility.voice.ignoreCodeBlocks": "Kod Bloklarını Yoksay",

  // Workbench
  "workbench.editor.mouseBackForwardToNavigate": "Gezinmek İçin Fare Geri/İleri Düğmelerini Kullan",
  "workbench.commandPalette.showAskInChat": "Komut Paletinde Sohbetten Sor Seçeneğini Göster",
  "workbench.panel.showLabels": "Panel Etiketlerini Göster",
  "workbench.panel.defaultLocation": "Varsayılan Panel Konumu",
  "workbench.panel.opensMaximized": "Ekranı Kaplamış Olarak Aç",

  // Zen Mode
  "zenMode.centerLayout": "Ortalanmış Düzen",
  "zenMode.hideStatusBar": "Durum Çubuğunu Gizle",
  "zenMode.hideActivityBar": "Aktivite Çubuğunu Gizle",
  "zenMode.hideLineNumbers": "Satır Numaralarını Gizle",

  // Screencast Mode
  "screencastMode.keyboardOptions": "Klavye Seçenekleri",
  "screencastMode.keyboardOverlayTimeout": "Klavye Katmanı Zaman Aşımı",
  "screencastMode.mouseIndicatorColor": "Fare Gösterge Rengi",
  "screencastMode.mouseIndicatorSize": "Fare Gösterge Boyutu",

  // Breadcrumbs
  "breadcrumbs.filePath": "Dosya Yolu",
  "breadcrumbs.symbolPath": "Sembol Yolu",
  "breadcrumbs.symbolSortOrder": "Sembol Sıralama Düzeni",
  "breadcrumbs.showNamespaces": "Ad Alanlarını Göster",
  "breadcrumbs.showPackages": "Paketleri Göster",
  "breadcrumbs.showStrings": "Dizgileri Göster",
  "breadcrumbs.showNumbers": "Sayıları Göster",
  "breadcrumbs.showBooleans": "Boole Değerlerini Göster",
  "breadcrumbs.showArrays": "Dizileri Göster",
  "breadcrumbs.showObjects": "Nesneleri Göster",
  "breadcrumbs.showKeys": "Anahtarları Göster",
  "breadcrumbs.showNull": "Null Değerlerini Göster",

  // Settings Sync
  "settingsSync.ignoredExtensions": "Yoksayılan Eklentiler",
  "settingsSync.ignoredSettings": "Yoksayılan Ayarlar",

  // Inline Chat
  "inlineChat.holdToSpeech": "Konuşmak İçin Basılı Tut",
  "inlineChat.notebookAgent": "Not Defteri Ajanı",

  // Notebook
  "notebook.diff.ignoreMetadata": "Meta Verileri Yoksay",
  "notebook.diff.ignoreOutputs": "Çıktıları Yoksay",

  // Testing
  "testing.followRunningTest": "Çalışan Testi Takip Et",
  "testing.saveBeforeTest": "Testten Önce Kaydet",
  "testing.automaticallyOpenTestResults": "Test Sonuçlarını Otomatik Olarak Aç",

  // Files & Explorer & Search & SCM
  "files.trimTrailingWhitespaceInRegexAndStrings": "Regex ve Dizgilerdeki Sondaki Boşlukları Kırp",
  "explorer.excludeGitIgnore": ".gitignore Dosyasına Göre Dışla",
  "search.experimental.closedNotebookRichContentResults": "Kapatılan Not Defteri Zengin İçerik Sonuçları",
  "scm.diffDecorationsIgnoreTrimWhitespace": "Fark Süslemelerinde Kırpılan Boşlukları Yoksay",

  // Debug & Problems & Merge Editor & Comments & Output
  "debug.terminal.clearBeforeReusing": "Yeniden Kullanmadan Önce Terminali Temizle",
  "problems.showCurrentInStatus": "Durum Çubuğunda Geçerli Sorunu Göster",
  "mergeEditor.showDeletionMarkers": "Silme İşaretçilerini Göster",
  "comments.openPanel": "Yorumlar Panelini Aç",
  "output.smartScroll.enabled": "Akıllı Kaydırmayı Etkinleştir",

  // Task
  "task.problemMatchers.neverPrompt": "Sorun Eşleştiricileri İçin Asla Sorma",
  "task.autoDetect": "Görevleri Otomatik Algıla",
  "task.slowProviderWarning": "Yavaş Sağlayıcı Uyarısı",
  "task.quickOpen.showAll": "Hızlı Aç'ta Tümünü Göster",
  "task.allowAutomaticTasks": "Otomatik Görevlere İzin Ver",
  "task.saveBeforeRun": "Çalıştırmadan Önce Kaydet",
  "task.notifyWindowOnTaskCompletion": "Görev Tamamlandığında Pencereyi Bildir",
  "task.verboseLogging": "Ayrıntılı Günlük Kaydı",

  // Remote
  "remote.extensionKind": "Eklenti Türü",
  "remote.autoForwardPorts": "Bağlantı Noktalarını Otomatik İlet",
  "remote.autoForwardPortsSource": "Otomatik İletim Kaynağı",
  "remote.autoForwardPortsFallback": "Otomatik İletim Yedekleme",
  "remote.forwardOnOpen": "Açıldığında Bağlantı Noktasını İlet",
  "remote.downloadExtensionsLocally": "Eklentileri Yerel Olarak İndir",

  // Outline
  "outline.showNamespaces": "Ad Alanlarını Göster",
  "outline.showPackages": "Paketleri Göster",
  "outline.showStrings": "Dizgileri Göster",
  "outline.showNumbers": "Sayıları Göster",
  "outline.showBooleans": "Boole Değerlerini Göster",
  "outline.showArrays": "Dizileri Göster",
  "outline.showObjects": "Nesneleri Göster",
  "outline.showKeys": "Anahtarları Göster",
  "outline.showNull": "Null Değerlerini Göster",

  // Antigravity & Application
  "antigravity.enableAgentMode": "Ajan Modunu Etkinleştir",
  "application.shellEnvironmentResolutionTimeout": "Kabuk Ortamı Çözümleme Zaman Aşımı"
};

// Also generate label mappings (Title Case leaf)
const labelMappings = {};
for (const [key, trVal] of Object.entries(comprehensiveTranslations)) {
  const parts = key.split('.');
  const leaf = parts[parts.length - 1];
  // Convert camelCase leaf to Title Case
  const titleCaseLeaf = leaf
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/^[a-z]/, c => c.toUpperCase());
  
  labelMappings[titleCaseLeaf] = trVal;
}

const extraCategories = {
  "Problem Matchers": "Sorun Eşleştiricileri",
  "Smart Scroll": "Akıllı Kaydırma",
  "Breadcrumbs": "İçerik Haritası (Breadcrumbs)",
  "Zen Mode": "Zen Modu",
  "Screencast Mode": "Ekran Yayını Modu",
  "Settings Sync": "Ayar Senkronizasyonu"
};

const extraEnums = {
  "discovery time": "Keşif Zamanı"
};

module.exports = {
  comprehensiveTranslations,
  labelMappings,
  extraCategories,
  extraEnums
};

console.log(`Configured ${Object.keys(comprehensiveTranslations).length} setting translations and ${Object.keys(labelMappings).length} label mappings.`);
