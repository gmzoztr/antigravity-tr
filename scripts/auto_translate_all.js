const fs = require('fs');

/**
 * Tüm eksik başlıkları ve kategorileri otomatik çeviren + uygulayan betik.
 * Çeviri kuralı: kelime bazlı sözlük ile otomatik çeviri, sonra tr.json'a yazdır.
 */

const dictPath = 'C:\\Users\\Work-D\\source\\antigravity-tr\\locales\\tr.json';
const trJson = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
const audit  = JSON.parse(fs.readFileSync('C:\\Users\\Work-D\\source\\antigravity-tr\\scripts\\full_settings_audit.json', 'utf8'));

// ─── 1. Kelime sözlüğü (İngilizce → Türkçe bileşen) ────────────────────────
const W = {
  // Genel eylemler
  "Allow": "İzin Ver", "Enable": "Etkinleştir", "Disable": "Devre Dışı Bırak",
  "Show": "Göster", "Hide": "Gizle", "Toggle": "Aç/Kapat",
  "Auto": "Otomatik", "Always": "Her Zaman", "Never": "Asla",
  "Open": "Aç", "Close": "Kapat", "Save": "Kaydet",
  "Use": "Kullan", "Set": "Ayarla", "Get": "Al",
  "Add": "Ekle", "Remove": "Kaldır", "Delete": "Sil",
  "Create": "Oluştur", "Edit": "Düzenle", "Update": "Güncelle",
  "Move": "Taşı", "Copy": "Kopyala", "Paste": "Yapıştır",
  "Find": "Bul", "Search": "Ara", "Replace": "Değiştir",
  "Select": "Seç", "Focus": "Odaklan", "Navigate": "Gezin",
  "Scroll": "Kaydır", "Zoom": "Yakınlaştır", "Split": "Böl",
  "Merge": "Birleştir", "Sort": "Sırala", "Filter": "Filtrele",
  "Format": "Biçimlendir", "Validate": "Doğrula", "Check": "Denetle",
  "Run": "Çalıştır", "Start": "Başlat", "Stop": "Durdur", "Restart": "Yeniden Başlat",
  "Send": "Gönder", "Receive": "Al", "Fetch": "Getir",
  "Upload": "Yükle", "Download": "İndir", "Install": "Yükle",
  "Sync": "Eşitle", "Reset": "Sıfırla", "Refresh": "Yenile", "Reload": "Yeniden Yükle",
  "Preview": "Önizleme", "Reveal": "Göster",
  "Expand": "Genişlet", "Collapse": "Daralt",
  "Maximize": "Ekranı Kapla", "Minimize": "Simge Durumuna Küçült",
  "Resize": "Yeniden Boyutlandır",

  // Özellikler ve nitelikler
  "Active": "Etkin", "Inactive": "Etkin Değil",
  "Visible": "Görünür", "Hidden": "Gizli",
  "Enabled": "Etkin", "Disabled": "Devre Dışı",
  "Global": "Genel", "Local": "Yerel",
  "Default": "Varsayılan", "Custom": "Özel",
  "Simple": "Basit", "Advanced": "Gelişmiş",
  "Automatic": "Otomatik", "Manual": "El ile",
  "Static": "Statik", "Dynamic": "Dinamik",
  "Fixed": "Sabit", "Flexible": "Esnek",
  "Inline": "Satır İçi", "Block": "Blok",
  "Horizontal": "Yatay", "Vertical": "Dikey",
  "Top": "Üst", "Bottom": "Alt", "Left": "Sol", "Right": "Sağ", "Center": "Orta",
  "Above": "Yukarıda", "Below": "Aşağıda",
  "Large": "Büyük", "Small": "Küçük", "Medium": "Orta",
  "Compact": "Kompakt", "Normal": "Normal",
  "Short": "Kısa", "Long": "Uzun",
  "Fast": "Hızlı", "Slow": "Yavaş",
  "Light": "Açık", "Dark": "Koyu",
  "Bold": "Kalın", "Italic": "İtalik",
  "New": "Yeni", "Old": "Eski",
  "First": "İlk", "Last": "Son",
  "Next": "Sonraki", "Previous": "Önceki",
  "Primary": "Birincil", "Secondary": "İkincil",
  "Main": "Ana", "Side": "Yan",
  "Single": "Tek", "Multiple": "Çoklu", "All": "Tüm",
  "Only": "Yalnızca", "Per": "Başına",
  "Separate": "Ayrı", "Combined": "Birleşik",

  // Yapısal terimler
  "View": "Görünüm", "Panel": "Panel", "Window": "Pencere",
  "Tab": "Sekme", "Group": "Grup", "Container": "Kapsayıcı",
  "Editor": "Düzenleyici", "Terminal": "Terminal", "Console": "Konsol",
  "Sidebar": "Kenar Çubuğu", "Bar": "Çubuğu",
  "Menu": "Menü", "Toolbar": "Araç Çubuğu",
  "Dialog": "İletişim Kutusu", "Modal": "Modal",
  "Notification": "Bildirim", "Badge": "Rozet", "Label": "Etiket",
  "Icon": "Simge", "Button": "Düğme", "Link": "Bağlantı",
  "List": "Liste", "Tree": "Ağaç", "Table": "Tablo",
  "Grid": "Izgara", "Row": "Satır", "Column": "Sütun",
  "Header": "Başlık", "Footer": "Alt Bilgi",
  "Section": "Bölüm", "Region": "Bölge",
  "Item": "Öğe", "Node": "Düğüm",
  "Widget": "Pencere Öğesi", "Component": "Bileşen",

  // Teknik terimler
  "File": "Dosya", "Folder": "Klasör", "Directory": "Dizin",
  "Path": "Yol", "Uri": "URI", "Url": "URL",
  "Line": "Satır", "Column": "Sütun", "Character": "Karakter",
  "Word": "Sözcük", "Token": "Belirteç",
  "Type": "Tür", "Value": "Değer", "Key": "Anahtar",
  "Name": "Ad", "Title": "Başlık", "Description": "Açıklama",
  "Comment": "Yorum", "Code": "Kod",
  "Command": "Komut", "Action": "Eylem",
  "Event": "Olay", "Signal": "Sinyal",
  "Config": "Yapılandırma", "Setting": "Ayar", "Option": "Seçenek",
  "Mode": "Mod", "Style": "Stil", "Theme": "Tema",
  "Color": "Renk", "Font": "Yazı Tipi", "Size": "Boyutu",
  "Width": "Genişliği", "Height": "Yüksekliği", "Depth": "Derinliği",
  "Length": "Uzunluğu", "Count": "Sayısı", "Limit": "Sınırı",
  "Max": "Maksimum", "Min": "Minimum",
  "Delay": "Gecikme", "Timeout": "Zaman Aşımı",
  "Interval": "Aralık", "Duration": "Süre",
  "Level": "Düzeyi", "Position": "Konumu",
  "Index": "İndeksi", "Offset": "Uzaklığı",
  "Range": "Aralığı", "Scope": "Kapsam",
  "Source": "Kaynak", "Target": "Hedef", "Destination": "Hedef",
  "Input": "Girdi", "Output": "Çıktı",
  "Data": "Veri", "Content": "İçerik", "Text": "Metin",
  "Message": "İleti", "Error": "Hata", "Warning": "Uyarı", "Info": "Bilgi",
  "Status": "Durum", "State": "Durum",
  "History": "Geçmişi", "Log": "Günlük", "Trace": "İzleme",
  "Profile": "Profil", "Extension": "Uzantı", "Plugin": "Eklenti",
  "Language": "Dil", "Locale": "Yerel Ayar",
  "Workspace": "Çalışma Alanı", "Project": "Proje",
  "Repository": "Depo", "Branch": "Dal",
  "Cursor": "İmleç", "Selection": "Seçim",
  "Highlight": "Vurgula", "Decoration": "Süsleme",
  "Bracket": "Ayraç", "Indent": "Girinti", "Indentation": "Girinti",
  "Wrap": "Kaydır", "Scroll": "Kaydır",
  "Folding": "Katlama", "Outline": "Anahat",
  "Completion": "Tamamlama", "Suggestion": "Öneri",
  "Snippet": "Kod Parçacığı", "Template": "Şablon",
  "Definition": "Tanım", "Reference": "Başvuru",
  "Declaration": "Bildirim", "Implementation": "Uygulama",
  "Hover": "Üzerine Gelme",
  "Peek": "Gözat", "Goto": "Git",
  "Rename": "Yeniden Adlandır", "Refactor": "Yeniden Düzenle",
  "Lint": "Lint", "Debug": "Hata Ayıkla",
  "Test": "Test", "Coverage": "Kapsam",
  "Build": "Derleme", "Task": "Görev",
  "Profile": "Profil", "Performance": "Performans",
  "Memory": "Bellek", "Cache": "Önbellek",
  "Network": "Ağ", "Proxy": "Proxy",
  "Auth": "Kimlik Doğrulama", "Token": "Belirteç",
  "Certificate": "Sertifika",
  "Experimental": "Deneysel", "Developer": "Geliştirici",
  "Telemetry": "Telemetri",

  // Ayar paneli özel
  "Accessibility": "Erişilebilirlik",
  "Verbosity": "Ayrıntı Düzeyi",
  "Voice": "Sesli",
  "Speech": "Konuşma",
  "Signals": "Sinyaller",
  "Checkpoints": "Kontrol Noktaları",
  "Repositories": "Depolar",
  "Working Sets": "Çalışma Kümeleri",
  "Thinking": "Düşünme",
  "Thread": "İş Parçacığı",
  "Repl": "REPL",
  "Ripgrep": "Ripgrep",
  "Implicit": "Örtük",
  "Context": "Bağlam",
  "Participants": "Katılımcılar",
  "Detect": "Algıla",
  "Participant": "Katılımcı",
  "Agent": "Ajan",
  "Tools": "Araçlar",
  "Undo": "Geri Al",
  "Requests": "İstekler",
  "Todo": "Yapılacaklar",
  "List": "Listesi",
  "Tool": "Aracı",
  "Send": "Gönder",
  "Elements": "Öğeleri",
  "Chat": "Sohbete",
  "Navigation": "Gezinme",
  "Results": "Sonuçlar",
  "Disassembly": "Ayrıştırma",
  "Editing": "Düzenleme",
  "Unification": "Birleştirme",
  "Dim": "Karartma",
  "Unfocused": "Odaksız",
  "Unchanged": "Değişmemiş",
  "Regions": "Bölgeler",
  "Console": "Konsol",
  "Status": "Durum",
  "Internal": "Dahili",
  "Delays": "Gecikmeler",
  "Options": "Seçenekler",
  "ANSI": "ANSI",
  "UNC": "UNC",
  "PCRE": "PCRE",
  "WSL": "WSL",
  "PTY": "PTY",
  "Pty": "PTY",
  "Conpty": "ConPTY",
  "Workers": "Çalışanlar",
  "Worker": "Çalışan",
  "Web": "Web",

  // Erişilebilirlik ayarları
  "Keyboard": "Klavye", "Mouse": "Fare",
  "Screen": "Ekran", "Reader": "Okuyucu",
  "Announce": "Seslendir",
  "Underline": "Altı Çizili",
  "Links": "Bağlantıları",
  "Optimized": "Optimize",
  "Verbose": "Ayrıntılı",
  "Progress": "İlerleme",
  "Updates": "Güncellemeler",

  // Terminal
  "Shell": "Kabuk",
  "Integration": "Tümleştirmesi",
  "Chords": "Akor Kısayolları",
  "Mnemonics": "Kısayol Harfleri",
  "Unicode": "Unicode",
  "Version": "Sürümü",
  "Conpty": "ConPTY",
  "Wsl": "WSL",
  "Profiles": "Profiller",
  "Profile": "Profil",
  "Split": "Böl",
  "Cwd": "Çalışma Dizini",
  "Stop": "Durdur",
  "Tab": "Sekme",
  "Stop": "Durdur",
  "Width": "Genişliği",
  "Separator": "Ayırıcı",
  "Title": "Başlığı",
  "Env": "Ortam",
  "Inherit": "Devral",
  "Focus": "Odak",
  "Command": "Komut",
  "Succeeded": "Başarılı",
  "Failed": "Başarısız",
  "Bell": "Zil",
  "Quick": "Hızlı",
  "Fix": "Düzelt",
  "Up": "Yukarı",
  "Arrow": "Ok",
  "Navigates": "Gezinir",
  "Executable": "Çalıştırılabilir",
  "Extensions": "Uzantıları",
  "Windows": "Windows",
  "Exec": "Çalıştır",
  "External": "Harici",
  "Source": "Kaynak",
  "Control": "Denetim",
  "Kind": "Türü",
  "Affinity": "Benzerlik",
  "Support": "Destek",
  "Virtual": "Sanal",
  "Workspaces": "Çalışma Alanları",
  "Node": "Node",
  "Global": "Genel",
  "Navigator": "Gezgin",

  // Diğer
  "Sku": "SKU",
  "Verbose": "Ayrıntılı",
  "Startup": "Başlangıç",
  "Host": "Ana Bilgisayar",
  "Proxy": "Proxy",
  "Accept": "Kabul Et",
  "Delay": "Gecikme",
  "Auto": "Otomatik",
  "Accept": "Kabul Et",
  "Resume": "Sürdür",
  "Store": "Depola",
  "Synthesize": "Sentezle",
  "Anonymous": "Anonim",
  "Access": "Erişim",
  "Scroll": "Kaydır",
  "Reveal": "Göster",
  "Exclude": "Dışla",
  "Include": "Dahil Et",
  "Watcher": "İzleyici",
  "Write": "Yaz",
  "Read": "Oku",
  "Only": "Yalnızca",
  "Encoding": "Kodlama",
  "Guess": "Tahmin Et",
  "Trim": "Kırp",
  "Trailing": "Sondaki",
  "Whitespace": "Boşluk",
  "Final": "Son",
  "Newlines": "Yeni Satırlar",
  "Regex": "Regex",
  "Strings": "Dizgiler",
  "Reply": "Yanıt",
  "Replies": "Yanıtlar",
  "Prompts": "Komut İstemleri",
  "Auto": "Otomatik",
  "Expand": "Genişlet",
  "Lazy": "Tembel",
  "Variables": "Değişkenler",
  "Repl": "REPL",
  "Execution": "Yürütme",
  "Focus": "Odaklan",
  "Breakpoints": "Kesme Noktaları",
  "Everywhere": "Her Yerde",
  "Bar": "Çubuğu",
  "Location": "Konumu",
  "Toolbar": "Araç Çubuğu",
  "Smart": "Akıllı",
  "Case": "Durum",
  "Behaviour": "Davranışı",
  "Click": "Tıklama",
  "Single": "Tek",
  "Sash": "Bölücü Çizgi",
  "Size": "Boyutu",
  "Widget": "Pencere Öğesi",
  "Chat": "Sohbet",
  "Actions": "Eylemler",
  "Position": "Konumu",
  "Ask": "Sor",
  "Location": "Konumu",
  "Css": "CSS",
  "Images": "Görüntüler",
  "Attach": "Ekle",
  "Editing": "Düzenleme",
  "Approve": "Onayla",
  "Updates": "Güncellemeler",
  "Check": "Denetle",
};

// ─── 2. Otomatik çeviri fonksiyonu ──────────────────────────────────────────
function autoTranslate(label) {
  // Kelimelere böl
  const words = label.split(' ');
  const translated = words.map(w => W[w] || w);
  return translated.join(' ');
}

// ─── 3. Eksik başlıkları çevir ──────────────────────────────────────────────
const gdeRule = trJson.rules.workbench.find(r => r.replace && r.replace.includes('_cat'));
const catS = gdeRule.replace.indexOf('const _cat=') + 'const _cat='.length;
const trS  = gdeRule.replace.indexOf(';const _tr=') + ';const _tr='.length;
const catCalc = gdeRule.replace.indexOf(';const cat=');
const _cat = JSON.parse(gdeRule.replace.slice(catS, gdeRule.replace.indexOf(';const _tr=')));
const _tr  = JSON.parse(gdeRule.replace.slice(trS, catCalc));

let addedLabels = 0;
let skippedLabels = 0;
const newLabels = {};

for (const item of audit.missingLabels) {
  if (_tr[item.rawLabel]) { skippedLabels++; continue; }
  const tr = autoTranslate(item.rawLabel);
  // Eğer çeviri hâlâ tamamen İngilizce ise (hiç kelime çevirilmediyse) ekle ama işaretle
  newLabels[item.rawLabel] = tr;
  addedLabels++;
}

Object.assign(_tr, newLabels);

// ─── 4. Eksik kategorileri çevir ──────────────────────────────────────────
const engCats = audit.untranslatedCategories.filter(s => /[a-z]/.test(s) && /[A-Z]/.test(s) && !s.match(/[ğüşıöç]/i));

const catManual = {
  "Accessibility": "Erişilebilirlik",
  "Accessible View": "Erişilebilir Görünüm",
  "Agent": "Ajan",
  "Checkpoints": "Kontrol Noktaları",
  "Command Center": "Komut Merkezi",
  "Console": "Konsol",
  "Delays": "Gecikmeler",
  "Detect Participant": "Katılımcı Algıla",
  "Diff": "Fark",
  "Dim Unfocused": "Odaksızları Karart",
  "Disassembly View": "Ayrıştırma Görünümü",
  "Editing": "Düzenleme",
  "Extension Unification": "Uzantı Birleştirmesi",
  "Hide Unchanged Regions": "Değişmemiş Bölgeleri Gizle",
  "Implicit Context": "Örtük Bağlam",
  "Internal": "Dahili",
  "Navigation": "Gezinme",
  "Repl Editor": "REPL Düzenleyicisi",
  "Repositories": "Depolar",
  "Results View": "Sonuçlar Görünümü",
  "Ripgrep": "Ripgrep",
  "Send Elements To Chat": "Öğeleri Sohbete Gönder",
  "Signal Options": "Sinyal Seçenekleri",
  "Signals": "Sinyaller",
  "Status Widget": "Durum Pencere Öğesi",
  "Terminal Profile": "Terminal Profili",
  "Thinking": "Düşünme",
  "Thread": "İş Parçacığı",
  "Todo List Tool": "Yapılacaklar Listesi Aracı",
  "Tools": "Araçlar",
  "Undo Requests": "Geri Alma İstekleri",
  "Verbosity": "Ayrıntı Düzeyi",
  "Voice": "Ses",
  "Working Sets": "Çalışma Kümeleri",
};

let addedCats = 0;
for (const [en, tr] of Object.entries(catManual)) {
  if (!_cat[en]) {
    _cat[en] = tr;
    addedCats++;
  }
}

// ─── 5. Gde rule'u yeniden yaz ─────────────────────────────────────────────
gdeRule.replace =
  'const _cat=' + JSON.stringify(_cat) +
  ';const _tr=' + JSON.stringify(_tr) +
  gdeRule.replace.slice(catCalc);

// ─── 6. Kaydet ──────────────────────────────────────────────────────────────
fs.writeFileSync(dictPath, JSON.stringify(trJson, null, 2), 'utf8');
console.log(`✓ _tr: ${addedLabels} yeni başlık eklendi`);
console.log(`✓ _cat: ${addedCats} yeni kategori eklendi`);
console.log('✓ locales/tr.json kaydedildi');
