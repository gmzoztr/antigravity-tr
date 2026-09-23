const fs = require('fs');
const path = require('path');
const { categories, settings } = require('../src/settings_dictionary');

const trPath = path.join(__dirname, '..', 'locales', 'tr.json');
const trData = JSON.parse(fs.readFileSync(trPath, 'utf8'));

// 1. NLS Mesajlarını güncelle
const nlsUpdates = {
  4199: "Hızlı Aç",
  11161: "Kullanıcı",
  11162: "Kullanıcı (Uzak)",
  11163: "Çalışma Alanı",
  11164: "Klasör",
  11165: "Ayarlar Değiştirici",
  11167: "Kullanıcı Ayarları",
  11168: "Uzak Ayarlar",
  11169: "Çalışma Alanı",
  11170: "Kullanıcı",
  11171: "Çalışma Alanı",
  11172: "Ayarları ara",
  11173: "Yapay zeka tarafından önerilen sonuçları göster",
  11174: "Şu anda kullanılabilir yapay zeka sonucu yok...",
  11175: "Arama Girdisini Temizle",
  11176: "Ayarları Filtrele",
  11177: "Şu anda kullanılabilir yapay zeka sonucu yok.",
  11178: "Ayar Bulunamadı",
  11179: "Filtreleri Temizle",
  11180: "Ayarlar",
  11181: "Çalışma Alanı Güveni",
  11182: "Ayar Bulunamadı. Yapay Zeka Sonuçları Mevcut",
  11183: "1 Ayar Bulundu. Yapay Zeka Sonuçları Mevcut",
  11184: "{0} Ayar Bulundu. Yapay Zeka Sonuçları Mevcut",
  11185: "Ayar Bulunamadı",
  11186: "1 Ayar Bulundu",
  11187: "{0} Ayar Bulundu",
  11188: "Ayarları Yedekle ve Eşitle",
  11189: "Son eşitleme: {0}",
  11190: "Çalışma alanı güveni gerektirir",
  11191: "Ayar değeri yalnızca güvenilen bir çalışma alanında uygulanabilir.",
  11192: "Çalışma Alanı Güvenini Yönet",
  11193: "Eşitlenmedi",
  11194: "Bu ayar eşitleme sırasında yoksayılır",
  11195: "Varsayılan değer değiştirildi",
  11196: "Önizleme",
  11197: "Deneysel",
  11198: "Gelişmiş",
  11199: "Kullanıcı",
  11200: "Çalışma Alanı",
  11201: "Uzak",
  11202: "Kuruluş tarafından yönetiliyor",
  11203: "Bu ayar kuruluşunuz tarafından yönetilmektedir ve gerçek değeri değiştirilemez.",
  11204: "İlke ayarlarını görüntüle",
  11205: "Tüm profillere uygulanır",
  11206: "Bu ayar geçerli profile özgü değildir ve profiller arasında geçiş yapılırken değerini korur.",
  11207: "Ayrıca şurada değiştirildi:",
  11208: "Şurada değiştirildi:",
  11209: "Ayrıca başka bir yerde değiştirildi",
  11210: "Başka bir yerde değiştirildi",
  11211: "Ayar ayrıca aşağıdaki kapsamlarda değiştirildi:",
  11212: "Ayar aşağıdaki kapsamlarda değiştirildi:",
  11213: "Aşağıdaki diller varsayılan geçersiz kılmalara sahip:",
  11214: "Varsayılan ayar değeri `{0}` tarafından geçersiz kılındı",
  11215: "{0} tarafından varsayılan bir değer belirlendi",
  11216: "Kullanıcı",
  11217: "Çalışma Alanı",
  11218: "Uzak",
  11220: "Kullanıcı",
  11221: "Çalışma Alanı",
  11222: "Uzak",
  11224: "Önizleme",
  11225: "Deneysel",
  11226: "Gelişmiş",
  11227: "Çalışma alanı güvenilmiyor; ayar değeri uygulanmadı",
  11228: "Kuruluş ilkesi tarafından yönetiliyor; ayar değeri uygulanmadı",
  11229: "Profiller arasında geçiş yapılırken ayar değeri korunur",
  11230: "Ayrıca şurada değiştirildi:",
  11231: "Şurada değiştirildi:",
  11232: "Ayar eşitleme sırasında yoksayılır",
  11233: "{0} varsayılan değeri geçersiz kılıyor",
  11234: "{0} varsayılan değeri geçersiz kılıyor",
  11235: "{0} için dile özgü varsayılan değerler var",
  11236: "Sık Kullanılan",
  11237: "Metin Düzenleyici",
  11238: "İmleç",
  11239: "Bul",
  11240: "Yazı Tipi",
  11241: "Biçimlendirme",
  11242: "Fark Düzenleyici",
  11243: "Çoklu Dosya Fark Düzenleyicisi",
  11244: "Mini Harita",
  11245: "Öneriler",
  11246: "Dosyalar",
  11247: "Çalışma Yeri",
  11248: "Görünüm",
  11249: "İçerik Haritaları",
  11250: "Düzenleyici Yönetimi",
  11251: "Ayar Düzenleyicisi",
  11252: "Zen Modu",
  11253: "Ekran Kaydı Modu",
  11254: "Pencere",
  11255: "Yeni Pencere",
  11256: "Özellikler",
  11257: "Erişilebilirlik Sinyalleri",
  11258: "Erişilebilirlik",
  11259: "Gezgin",
  11260: "Arama",
  11261: "Hata Ayıklama",
  11262: "Test",
  11263: "Kaynak Denetimi",
  11264: "Uzantılar",
  11265: "Terminal",
  11266: "Görev",
  11267: "Sorunlar",
  11268: "Çıktı",
  11269: "Yorumlar",
  11270: "Uzak",
  11271: "Zaman Çizelgesi",
  11272: "Not Defteri",
  11273: "Birleştirme Düzenleyicisi",
  11274: "Sorun Bildirici",
  11275: "Uygulama",
  11276: "Proxy",
  11277: "Klavye",
  11278: "Güncelleme",
  11279: "Telemetri",
  11280: "Ayar Eşitleme",
  11281: "Deneysel",
  11282: "Diğer",
  11283: "Güvenlik",
  11284: "Çalışma Alanı",
  11285: "Değiştirildi",
  11286: "Değiştirilen ayarlar filtresini ekle veya kaldır",
  11287: "Uzantı Kimliği...",
  11288: "Uzantı kimliği filtresi ekle",
  11289: "Özellik...",
  11290: "Özellik filtresi ekle",
  11291: "Etiket...",
  11292: "Etiket filtresi ekle",
  11293: "Dil...",
  11294: "Dil kimliği filtresi ekle",
  11295: "Ayar Kimliği...",
  11296: "Ayar kimliği filtresi ekle",
  11297: "Çevrimiçi hizmetler",
  11298: "Çevrimiçi hizmetler için ayarları göster",
  11299: "Kuruluş ilkeleri",
  11300: "Kuruluş ilkesi ayarlarını göster",
  11301: "Kararlı",
  11302: "Kararlı ayarları göster",
  11303: "Önizleme",
  11304: "Önizleme ayarlarını göster",
  11305: "Deneysel",
  11306: "Deneysel ayarları göster",
  11307: "Gelişmiş",
  11308: "Gelişmiş ayarları göster",
  11309: "Uzantılar",
  11310: "Ayar geçerli kapsamda yapılandırıldı.",
  11311: "Diğer Eylemler... ",
  11312: "Eşleşen uzantıları göster",
  11313: "settings.json dosyasında düzenle",
  11314: "{0} ayarlarını düzenle",
  11315: "varsayılan",
  11316: "Ayar geçerli kapsamda yapılandırıldı.",
  11317: "Uzantıyı Göster",
  11318: "Kapat",
  11319: "Ayarı Sıfırla",
  11320: "Doğrulama Hatası.",
  11321: "Doğrulama Hatası.",
  11322: "Değiştirildi.",
  11323: "Ayarlar",
  11324: "Ayar Kimliğini Kopyala",
  11325: "Ayarı JSON Olarak Kopyala",
  11326: "Ayarı URL Olarak Kopyala",
  11327: "Bu Ayarı Eşitle",
  11328: "Ayarı Tüm Profillere Uygula",
  11329: "Tamam",
  11330: "İptal",
  11333: "Öğeyi Kaldır",
  11334: "Öğeyi Düzenle",
  11335: "Öğe Ekle",
  11336: "Öğe...",
  11337: "Kardeş Öğe...",
  11341: "Dışlama Öğesini Kaldır",
  11342: "Dışlama Öğesini Düzenle",
  11343: "Desen Ekle",
  11344: "Dışlama Deseni...",
  11345: "Desen Mevcut Olduğunda...",
  11349: "Dahil Etme Öğesini Kaldır",
  11350: "Dahil Etme Öğesini Düzenle",
  11351: "Desen Ekle",
  11352: "Dahil Etme Deseni...",
  11353: "Desen Mevcut Olduğunda...",
  11354: "Tamam",
  11355: "İptal",
  11356: "Anahtar",
  11357: "Değer",
  11360: "Öğeyi Kaldır",
  11361: "Öğeyi Sıfırla",
  11362: "Öğeyi Düzenle",
  11363: "Öğe Ekle",
  11364: "Öğe",
  11365: "Değer",
  11367: "Öğeyi Kaldır",
  11368: "Öğeyi Sıfırla",
  11369: "Öğeyi Düzenle",
  11370: "Öğe Ekle",
  11371: "Öğe",
  11372: "Değer",
  11373: "Ayarlar İçindekiler Tablosu",
  11374: "{0}, grup",
  11375: "Önizleme ayarı: Bu ayar, henüz geliştirme aşamasında olan ancak kullanıma hazır yeni bir özelliği denetler. Geri bildirimlerinizi bekleriz."
};

const nlsList = [];
for (const [idxStr, text] of Object.entries(nlsUpdates)) {
  nlsList.push({ index: parseInt(idxStr, 10), replace: text });
}
trData.rules.nlsMessages = nlsList;

// 2. gDe kuralını temiz sözlük ile güncelle
const catStr = JSON.stringify(categories);
const setStr = JSON.stringify(settings);

const gDeReplace = `const s=NLa(t);const _cat=${catStr};const _tr=${setStr};const cat=r.split(' \\u203A ').map(seg=>_cat[seg]||seg).join(' \\u203A ');const lab=_tr[s]||_tr[s.replace(/ \\u203A /g,': ')]||_tr[t]||s;return{category:cat,label:lab}`;

let wbRules = trData.rules.workbench || [];

// gDe kuralı
const gDeRuleIdx = wbRules.findIndex(r => r.search.includes('const s=NLa(t);return{category:r,label:s}') || r.search.includes('const s=NLa(t);const _cat='));
if (gDeRuleIdx >= 0) {
  wbRules[gDeRuleIdx] = {
    search: 'const s=NLa(t);return{category:r,label:s}',
    replace: gDeReplace
  };
} else {
  wbRules.push({
    search: 'const s=NLa(t);return{category:r,label:s}',
    replace: gDeReplace
  });
}

// 3. k2h.renderValue açılır liste (dropdown enum) kuralı
const enumSearch = 'u=s.map(String).map(wBa).map((f,g)=>{const m=r[g]&&(o?cQn(r[g],!1):r[g]);return{text:n[g]?n[g]:f,detail:n[g]?f:"",description:m';
const enumReplace = 'const _eTr={"off":"kapalı","on":"açık","afterDelay":"gecikmeden sonra","onFocusChange":"odak değiştiğinde","onWindowChange":"pencere değiştiğinde","none":"yok","boundary":"sınır","selection":"seçim","trailing":"sondaki","all":"tümü","line":"çizgi","block":"blok","underline":"alt çizgi","line-thin":"ince çizgi","block-outline":"blok anahat","underline-thin":"ince alt çizgi","blink":"yanıp sönme","smooth":"yumuşak","phase":"evre","expand":"genişleme","solid":"sabit","never":"asla","near":"yakın","always":"her zaman","first":"ilk","recentlyUsed":"son kullanılan","recentlyUsedByPrefix":"önek ile son kullanılan","onlySnippets":"yalnızca kod parçacıkları","wordWrapColumn":"sözcük kaydırma sütunu","bounded":"sınırlı","clickAndHover":"tıklama ve üzerine gelme","click":"tıklama","hover":"üzerine gelme","active":"etkin","default":"varsayılan","top":"üst","bottom":"alt","left":"sol","right":"sağ","auto":"otomatik","hidden":"gizli","visible":"görünür","manual":"manuel","ask":"sor","prompt":"sor"};u=s.map(String).map(wBa).map((f,g)=>{const m=r[g]&&(o?cQn(r[g],!1):r[g]);const _disp=n[g]?n[g]:(_eTr[f]||f);return{text:_disp,detail:n[g]?f:(_eTr[f]?f:""),description:m';

const enumRuleIdx = wbRules.findIndex(r => r.search.includes('u=s.map(String).map(wBa).map((f,g)=>{const m=r[g]&&(o?cQn(r[g],!1):r[g]);return{text:n[g]?n[g]:f,detail:n[g]?f:"",description:m'));
if (enumRuleIdx >= 0) {
  wbRules[enumRuleIdx] = { search: enumSearch, replace: enumReplace };
} else {
  wbRules.push({ search: enumSearch, replace: enumReplace });
}

trData.rules.workbench = wbRules;

fs.writeFileSync(trPath, JSON.stringify(trData, null, 2), 'utf8');
console.log(`Successfully updated locales/tr.json:
- ${nlsList.length} NLS messages (Settings GUI & Buttons)
- gDe settings dictionary (${Object.keys(settings).length} settings, ${Object.keys(categories).length} categories)
- k2h.renderValue dropdown enum localization
`);
