const fs = require('fs');

// Kelime bazlı akıllı başlık çevirici
const wordMap = {
  "Async": "Zaman Uyumsuz",
  "Tokenization": "Belirteç Ayırma",
  "Logging": "Günlüğü",
  "Verification": "Doğrulaması",
  "Telemetry": "Telemetrisi",
  "Tree Sitter": "Tree-sitter",
  "Ambiguous": "Belirsiz",
  "Characters": "Karakterler",
  "Invisible": "Görünmez",
  "Colorized": "Renklendirilmiş",
  "Pairs": "Çiftleri",
  "Bracket": "Ayraç",
  "Brackets": "Ayraçlar",
  "Insert": "Ekle",
  "Ignore": "Yoksay",
  "Empty": "Boş",
  "Lines": "Satırlar",
  "Line": "Satır",
  "Seed": "Tohum",
  "Search": "Arama",
  "String": "Dizgi",
  "From": "Kaynaklı",
  "Selection": "Seçim",
  "Clipboard": "Pano",
  "Extra": "Ekstra",
  "Space": "Boşluk",
  "Top": "Üst",
  "Bottom": "Alt",
  "Left": "Sol",
  "Right": "Sağ",
  "Loop": "Döngü",
  "History": "Geçmişi",
  "Replace": "Değiştir",
  "Trigger": "Tetikle",
  "Delay": "Gecikme",
  "Sticky": "Sabit",
  "Hiding": "Gizleme",
  "Above": "Yukarıda",
  "Below": "Aşağıda",
  "Max": "Maksimum",
  "Min": "Minimum",
  "Count": "Sayısı",
  "Size": "Boyutu",
  "Width": "Genişliği",
  "Height": "Yüksekliği",
  "Model": "Model",
  "Multiple": "Çoklu",
  "Definitions": "Tanımlar",
  "Definition": "Tanım",
  "Declarations": "Bildirimler",
  "Declaration": "Bildirim",
  "Implementations": "Uygulamalar",
  "Implementation": "Uygulama",
  "References": "Başvurular",
  "Reference": "Başvuru",
  "Alternative": "Alternatif",
  "Command": "Komut",
  "Commands": "Komutlar",
  "Peek": "Gözat",
  "Reveal": "Göster",
  "Aside": "Yanda",
  "Modes": "Modlar",
  "Registry": "Kayıt Defteri",
  "Marker": "İşaretçi",
  "Decorations": "Süslemeler",
  "Decoration": "Süsleme",
  "Auto": "Otomatik",
  "Find": "Bul",
  "Type": "Tür",
  "Global": "Genel"
};

function translatePhrase(phrase) {
  // Birebir eşleşme varsa
  if (wordMap[phrase]) return wordMap[phrase];
  
  // Parçalara ayırıp çevir
  let result = phrase;
  // Uzun kalıpları önce değiştir
  const sortedKeys = Object.keys(wordMap).sort((a, b) => b.length - a.length);
  for (const k of sortedKeys) {
    const regex = new RegExp('\\b' + k + '\\b', 'g');
    if (regex.test(result)) {
      result = result.replace(regex, wordMap[k]);
    }
  }
  return result;
}

console.log('Test Async Tokenization Logging ->', translatePhrase('Async Tokenization Logging'));
console.log('Test Async Tokenization Verification ->', translatePhrase('Async Tokenization Verification'));
console.log('Test Ambiguous Characters ->', translatePhrase('Ambiguous Characters'));
console.log('Test Max Line Count ->', translatePhrase('Max Line Count'));
console.log('Test Multiple Definitions ->', translatePhrase('Multiple Definitions'));
console.log('Test Auto Find In Selection ->', translatePhrase('Auto Find In Selection'));
