const fs = require('fs');

const glob = fs.readdirSync('C:/Users/Work-D/Documents/Obsidian-Beyin').filter(f => f.includes('Antigravity'));
if (glob.length === 0) process.exit(1);
const fullPath = 'C:/Users/Work-D/Documents/Obsidian-Beyin/' + glob[0];

const text = [
  '',
  '---',
  '',
  '## 25.09.2026 (Ek Düzeltme) - Codex Eklentisi, Sözlük Temizliği ve Kalan Ayarların Doğallaştırılması',
  '- **Kullanıcı Geri Bildirimi:**',
  '  1. Üst araç çubuğundaki Codex simgesi tooltip: `Open Codex Sidebar`.',
  '  2. Sık Kullanılanlar altında: `Dosyalar: Associations`.',
  '  3. Metin Düzenleyici altında: `Token Color Customizations`.',
  '  4. Fark Düzenleyici altında: `Context Satır Sayısı`, `Göster Taşır` ve generic `Enabled` hatasından kaynaklanan `Akıllı Kaydırmayı Etkinleştir` etiketi.',
  '- **Uygulanan Çözümler:**',
  '  1. `openai.chatgpt` eklentisi için `patchCodexExtension` yazıldı: `Open Codex Sidebar` -> `Codex Kenar Çubuğunu Aç` olarak yamalandı.',
  '  2. `files.associations` -> `İlişkilendirmeler`, `editor.tokenColorCustomizations` -> `Belirteç Renk Özelleştirmeleri`, `workbench.colorCustomizations` -> `Renk Özelleştirmeleri` eklendi.',
  '  3. Generic leaf `Enabled` hatası düzeltildi; tüm boolean ayarlarının etiketi doğru şekilde `Etkin` yapıldı.',
  '  4. Eski makine çevirisi 125 devrik/kelime-kelime başlık (`Göster Taşır` -> `Kod Taşımalarını Göster`, `Context Satır Sayısı` -> `Bağlam Satır Sayısı`, `Kapat Üzerinde Anahtar Basma` -> `Tuşa Basıldığında Kapat` vb.) doğal Türkçe kurallarına göre yeniden yazıldı.',
  '  5. `product.json` checksum ve Electron önbellekleri temizlendi.'
].join('\n');

fs.appendFileSync(fullPath, text, 'utf8');
console.log('Obsidian günlüğü başarıyla güncellendi.');
