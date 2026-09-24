const fs = require('fs');

const glob = fs.readdirSync('C:/Users/Work-D/Documents/Obsidian-Beyin').filter(f => f.includes('Antigravity'));
if (glob.length === 0) process.exit(1);
const fullPath = 'C:/Users/Work-D/Documents/Obsidian-Beyin/' + glob[0];

const text = [
  '',
  '---',
  '',
  '## 24.09.2026 - İş Akışı Giriş İstemi ve Aktivite Çubuğu Kenar Çubuğu Menüsü Düzeltmesi',
  '- **Kullanıcı Geri Bildirimi:**',
  '  1. İş Akışları sayfasında yeni iş akışı eklerken Enter workflow name promptunun İngilizce olması.',
  '  2. Sol kenar çubuğuna sağ tıklandığında menüde Show Primary Side Bar öğesinin İngilizce kalması.',
  '- **Uygulanan Çözümler:**',
  '  1. createWorkflow metodu: prompt: "İş akışı adını girin", placeHolder: "örn. bellek-sızıntısı-ayıklama", validateInput: "Geçersiz iş akışı adı. Yalnızca küçük harfler, sayılar ve kısa çizgiler kullanılabilir."',
  '  2. Kenar Çubuğu NLS kuralları (3176-3258, 3428-3454): Show Primary Side Bar -> Birincil Kenar Çubuğunu Göster, Hide Primary Side Bar -> Birincil Kenar Çubuğunu Gizle, Toggle Primary Side Bar -> Birincil Kenar Çubuğunu Aç/Kapat, Sağa/Sola Taşı vb.',
  '  3. enrichLanguagePackFile fonksiyonuna sidebarPart modülü entegre edildi.',
  '  4. V8 modül derlemesi doğrulandı (HATASIZ), product.json SHA-256 hash eşitlendi, önbellekler temizlendi.'
].join('\n');

fs.appendFileSync(fullPath, text, 'utf8');
console.log('Obsidian günlüğü başarıyla güncellendi.');
