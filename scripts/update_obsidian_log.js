const fs = require('fs');

const glob = fs.readdirSync('C:/Users/Work-D/Documents/Obsidian-Beyin').filter(f => f.includes('Antigravity'));
if (glob.length === 0) process.exit(1);
const fullPath = 'C:/Users/Work-D/Documents/Obsidian-Beyin/' + glob[0];

const text = [
  '',
  '---',
  '',
  '## 25.09.2026 - Ayarlar Paneli ve Açılır Seçeneklerin Kapsamlı Türkçeleştirilmesi',
  '- **Kullanıcı Geri Bildirimi:**',
  '  1. Metin Düzenleyici altındaki açılır seçeneklerde İngilizce değerler: `On Code`, `Spread`, `Single File`, `In Untrusted Workspace` vb.',
  '  2. Kalan İngilizce ayar başlıkları: `Semantic Token Color Customizations`, `Allowed Characters`, `Allowed Locales`, `Include Comments`, `Include Strings`, `Non Basic ASCII` vb.',
  '  3. Ekran görüntüsü beklemeden dosyalar üzerinde doğrudan planlama ve uçtan uca kontrol talebi.',
  '- **Uygulanan Çözümler:**',
  '  1. Workbench içerisindeki 899 kayıtlı ayar ve 265 enum seçeneği taranarak uçtan uca analiz edildi.',
  '  2. Görsellerdeki tüm eksikler ve ek 106 ayar başlığı (İçerik Haritası / Breadcrumbs, Zen Modu, Terminal, Erişilebilirlik, Görevler, Uzak Bağlantı) temiz Title Case Türkçe karşılıklarıyla güncellendi.',
  '  3. Açılır liste (dropdown) `renderValue` mantığı `_eTr` öncelikli hale getirildi; `onCode` -> "Kod Üzerinde", `spread` -> "Dağıt", `singleFile` -> "Tek Dosya", `inUntrustedWorkspace` -> "Güvenilmeyen Çalışma Alanında", `discovery time` -> "Keşif Zamanı" eklendi.',
  '  4. V8 modül derlemesi doğrulandı (1050 ayar ve 258 kategori), `product.json` SHA-256 sağlama toplamı güncellendi ve Electron önbelleği temizlendi.'
].join('\n');

fs.appendFileSync(fullPath, text, 'utf8');
console.log('Obsidian günlüğü başarıyla güncellendi.');
