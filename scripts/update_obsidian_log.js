const fs = require('fs');

const glob = fs.readdirSync('C:/Users/Work-D/Documents/Obsidian-Beyin').filter(f => f.includes('Antigravity'));
if (glob.length === 0) process.exit(1);
const fullPath = 'C:/Users/Work-D/Documents/Obsidian-Beyin/' + glob[0];

const text = [
  '',
  '---',
  '',
  '## 24.09.2026 - Açılır Kutu Sadeleştirmesi ve Metin Düzenleyici Ayar Başlıkları Yerelleştirmesi',
  '- **Kullanıcı Geri Bildirimi:**',
  '  1. Açılır menüde Türkçe seçeneklerin yanında gereksiz gri İngilizce teknik anahtarların (Otomatik auto, Her Zaman always, Asla never) çıkması.',
  '  2. Metin Düzenleyici ayarlarında fareyi aşağı kaydırdıkça Async Tokenization Logging, Async Tokenization Verification vb. başlıkların İngilizce kalması.',
  '- **Uygulanan Çözümler:**',
  '  1. k2h.renderValue fonksiyonunda detail: n[g] ? f : (_eTr[f] ? f : "") mantığı detail: n[g] ? f : "" olarak düzeltildi. Artık yanında asla auto, always, never çıkmaz; sadece saf Otomatik, Her Zaman, Asla görünür.',
  '  2. Metin Düzenleyici altındaki eksik ayarlar eklendi: Zaman Uyumsuz Belirteç Ayırma Günlüğü, Zaman Uyumsuz Belirteç Ayırma Doğrulaması, Renklendirilmiş Ayraç Çiftleri, Maksimum Satır Sayısı, Çoklu Tanımlar, Uygulamaya Gözat, Tanıma Gözat vb.',
  '  3. V8 modül derlemesi doğrulandı (TAMAMEN GEÇERLİ), product.json SHA-256 hash eşitlendi, önbellekler temizlendi.'
].join('\n');

fs.appendFileSync(fullPath, text, 'utf8');
console.log('Obsidian günlüğü başarıyla güncellendi.');
