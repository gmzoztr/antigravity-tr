const fs = require('fs');

const dictPath = 'C:\\Users\\Work-D\\source\\antigravity-tr\\locales\\tr.json';
const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

console.log('--- 1. Kapsamlı Title Case Enum Haritası Oluşturuluyor ---');

const comprehensiveEnumMap = {
  // Boolean & Temel Durumlar
  "off": "Kapalı",
  "on": "Açık",
  "true": "Açık",
  "false": "Kapalı",
  "none": "Yok",
  "auto": "Otomatik",
  "default": "Varsayılan",
  "inherit": "Devral",
  "disabled": "Devre Dışı",
  "enabled": "Etkin",
  "active": "Etkin",
  "custom": "Özel",
  
  // Zamanlama & Tetikleyiciler
  "afterDelay": "Gecikmeden Sonra",
  "onFocusChange": "Odak Değiştiğinde",
  "onWindowChange": "Pencere Değiştiğinde",
  "smart": "Akıllı",
  "subwordSmart": "Alt Sözcük Akıllı",
  "languageDefined": "Dile Göre Tanımlı",
  "beforeWhitespace": "Boşluk Öncesinde",
  "mouseover": "Fare Üzerinde",
  "click": "Tıklama",
  "hover": "Üzerine Gelme",
  "clickAndHover": "Tıklama ve Üzerine Gelme",
  "singleClick": "Tek Tıklama",
  "doubleClick": "Çift Tıklama",
  
  // Aralıklar & Sınırlar
  "boundary": "Sınır",
  "selection": "Seçim",
  "trailing": "Sondaki",
  "all": "Tümü",
  "never": "Asla",
  "near": "Yakın",
  "always": "Her Zaman",
  "first": "İlk",
  "recentlyUsed": "Son Kullanılan",
  "recentlyUsedByPrefix": "Önek ile Son Kullanılan",
  "onlySnippets": "Yalnızca Kod Parçacıkları",
  "wordWrapColumn": "Sözcük Kaydırma Sütunu",
  "bounded": "Sınırlı",
  
  // İmleç & Çizim Stilleri
  "line": "Çizgi",
  "block": "Blok",
  "underline": "Alt Çizgi",
  "line-thin": "İnce Çizgi",
  "block-outline": "Blok Anahat",
  "underline-thin": "İnce Alt Çizgi",
  "blink": "Yanıp Sönme",
  "smooth": "Yumuşak",
  "phase": "Evre",
  "expand": "Genişleme",
  "solid": "Sabit",
  
  // Pozisyonlar & Yönler
  "top": "Üst",
  "bottom": "Alt",
  "left": "Sol",
  "right": "Sağ",
  "center": "Orta",
  "horizontal": "Yatay",
  "vertical": "Dikey",
  "both": "Her İkisi",
  "inline": "Satır İçi",
  "float": "Kayan",
  "sticky": "Sabit",
  "semiSticky": "Yarı Sabit",
  
  // Görünürlük & Durumlar
  "hidden": "Gizli",
  "visible": "Görünür",
  "manual": "Manuel",
  "ask": "Sor",
  "prompt": "Sor",
  "promptUser": "Kullanıcıya Sor",
  "askUser": "Kullanıcıya Sor",
  "dontAsk": "Sorma",
  
  // Klavye & Düzenleme
  "ctrlCmd": "Ctrl / Cmd",
  "alt": "Alt",
  "terminal": "Terminal",
  "external": "Harici",
  "internal": "Dahili",
  "singleQuote": "Tek Tırnak",
  "doubleQuote": "Çift Tırnak",
  "quotes": "Tırnaklar",
  "brackets": "Ayraçlar",
  "bracketPairs": "Ayraç Çiftleri",
  "bracketPairsHorizontal": "Yatay Ayraç Çiftleri",
  "indentation": "Girinti",
  "autoIndent": "Otomatik Girintile",
  "words": "Sözcükler",
  "word": "Sözcük",
  "character": "Karakter",
  "multiline": "Çok Satırlı",
  "gutter": "Kenar Boşluğu",
  "same": "Aynı",
  "relative": "Göreceli",
  "absolute": "Mutlak",
  "autoDetect": "Otomatik Algıla",
  "offDOM": "Kapalı",
  "simple": "Basit",
  "advanced": "Gelişmiş",
  "file": "Dosya",
  "modifications": "Değişiklikler",
  "modificationsIfAvailable": "Kullanılabilir Olduğunda Değişiklikler",
  
  // Ağaç & Liste Görünümleri
  "compact": "Kompakt",
  "expanded": "Genişletilmiş",
  "collapsed": "Daraltılmış",
  "tree": "Ağaç Görünümü",
  "list": "Liste Görünümü",
  "sideBySide": "Yan Yana",
  "offScreen": "Ekran Dışı",
  "truncate": "Kısalt",
  "wrap": "Kaydır",
  "nowrap": "Kaydırma",
  "keep": "Koru",
  "remove": "Kaldır",
  "preserve": "Koru",
  "keepQuotes": "Tırnakları Koru",
  
  // Bildirim & Önem Düzeyleri
  "warn": "Uyar",
  "error": "Hata",
  "info": "Bilgi",
  "warning": "Uyarı",
  "critical": "Kritik",
  "high": "Yüksek",
  "medium": "Orta",
  "low": "Düşük",
  "ignore": "Yoksay",
  "replace": "Değiştir",
  "full": "Tam",
  "partial": "Kısmi",
  "minimal": "Minimal",
  "standard": "Standart",
  "lineByLine": "Satır Satır",
  "allMatches": "Tüm Eşleşmeler",
  "preview": "Önizleme",
  "open": "Aç",
  "close": "Kapat",
  "show": "Göster",
  "hide": "Gizle",
  "reopen": "Yeniden Aç",
  "reload": "Yeniden Yükle",
  "restart": "Yeniden Başlat",
  "exact": "Birebir",
  "fuzzy": "Bulanık",
  "prefix": "Önek",
  "contains": "İçerir"
};

console.log(`Tanımlanan toplam Title Case enum sayısı: ${Object.keys(comprehensiveEnumMap).length}`);

// Workbench kuralını güncelle:
const wRule = dict.rules.workbench.find(r => r.replace && r.replace.includes('_eTr'));

// Güvenli fallback mantığı:
// const _disp = n[g] ? n[g] : (_eTr[f] || (typeof f === 'string' ? f.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[-_]/g, ' ').replace(/^./, c => c.toUpperCase()) : f));
const enumJson = JSON.stringify(comprehensiveEnumMap);

const newReplace = `const _eTr=${enumJson},d=wBa(String(t.defaultValue)),u=s.map(String).map(wBa).map((f,g)=>{const m=r[g]&&(o?cQn(r[g],!1):r[g]);const _disp=n[g]?n[g]:(_eTr[f]||(typeof f===\"string\"?f.replace(/([a-z])([A-Z])/g,\"$1 $2\").replace(/[-_]/g,\" \").replace(/^./,c=>c.toUpperCase()):f));return{text:_disp,detail:n[g]?f:(_eTr[f]?f:\"\"),description:m,descriptionIsMarkdown:o,descriptionMarkdownActionHandler:b=>{this._openerService.open(b).catch(Hr)},decoratorRight:f===d||l&&g===0?p(11315,null):\"\"}}`;

wRule.replace = newReplace;

// 2. NLS Mesajlarını Baştan Aşağı Title Case / Profesyonel Yapma
console.log('--- 2. NLS Mesajları Profesyonelleştiriliyor ---');

const nlsUpdates = {
  11172: "Ayarlarda Ara",
  11175: "Arama Kutusunu Temizle",
  11176: "Ayarları Filtrele",
  11188: "Ayarları Yedekle ve Eşitle",
  11313: "settings.json Dosyasında Düzenle",
  11315: "Varsayılan",
  11316: "Varsayılan Değer: {0}",
  11317: "Değiştirildi",
  11318: "Başka Bir Hedefte Değiştirildi",
  11319: "Ayar Denetimi Yapılandırıldı",
  11320: "Daha Fazla Eylem...",
  11321: "Ayarı Sıfırla",
  11322: "Genişlet",
  11323: "Daralt",
  11324: "Kaldır",
  11325: "Öğe Ekle",
  11326: "Öğe Düzenle",
  11327: "Öğeyi Kaldır",
  11328: "Tamam",
  11329: "İptal",
  11330: "Sıfırla",
  11331: "Varsayılan Değere Sıfırla",
  11332: "Kopyala",
  11333: "Ayar Kimliğini Kopyala",
  11334: "Ayar JSON Olarak Kopyala",
  11335: "Ayar URL'sini Kopyala"
};

for (const [idxStr, val] of Object.entries(nlsUpdates)) {
  const idx = parseInt(idxStr);
  const found = dict.rules.nlsMessages.find(m => m.index === idx);
  if (found) {
    found.replace = val;
  } else {
    dict.rules.nlsMessages.push({ index: idx, replace: val });
  }
}

// NLS listesini sırala
dict.rules.nlsMessages.sort((a, b) => a.index - b.index);

fs.writeFileSync(dictPath, JSON.stringify(dict, null, 2), 'utf8');
console.log('locales/tr.json başarıyla güncellendi.');
