const fs = require('fs');

const glob = fs.readdirSync('C:/Users/Work-D/Documents/Obsidian-Beyin').filter(f => f.includes('Antigravity'));
if (glob.length === 0) process.exit(1);
const fullPath = 'C:/Users/Work-D/Documents/Obsidian-Beyin/' + glob[0];

const text = [
  '',
  '---',
  '',
  '## 24.09.2026 - Özel Paneller, Ajan Özelleştirmeleri ve Terminal Entegrasyonu Yerelleştirmesi',
  '- **Kullanıcı Geri Bildirimi:** Çalıştırma & Hata Ayıklama, Uzak Gezgin WSL, Ajan Özelleştirmeleri, İş Akışları/Workflows ve Terminal @ butonu eksiklikleri ve bunların neden eksik kaldığının açıklanması talebi.',
  '- **Teknik Nedenler:**',
  '  1. Ajan paneli, Özelleştirmeler, Workflows ve Terminal @ eylemi Microsoft açık kaynak kodunda olmayıp doğrudan Google tarafından React ile Antigravity IDE içerisine geliştirildiği için resmi dil paketinde yer almaz.',
  '  2. Run & Debug ve Uzak Gezgin metinleri dinamik parametreli ({0}) NLS dizileridir; Google paketleyicisi dil paketiyle eşleme bağını kopardığı için varsayılan İngilizceye düşer.',
  '  3. WSL default distro etiketi gömülü antigravity-remote-wsl eklentisinde hardcoded olarak kodlanmıştır.',
  '- **Uygulanan Çözümler:**',
  '  1. Run & Debug (NLS 7897, 7898): Çalıştırma ve Hata Ayıklamayı özelleştirmek için [bir klasör açın]({0}) ve bir launch.json dosyası oluşturun.',
  '  2. Uzak Gezgin (NLS 4206 + WSL Eklentisi): Görünüm verisi sağlayabilecek kayıtlı bir veri sağlayıcı yok. ve Varsayılan Dağıtım.',
  '  3. Ajan Özelleştirmeleri: Daha iyi ve kişiselleştirilmiş bir deneyim için Ajanı özelleştirin., Kurallar, Ajanın davranışını yönlendirmeye yardımcı olur., Kuralları Yenile, + Genel.',
  '  4. İş Akışları Sekmesi: Workflows -> İş Akışları, İş Akışlarını Yenile, İş akışları, Ajanın izleyebileceği kayıtlı yönlendirmelerdir. Bir iş akışını tetiklemek için Ajanda "/" yazın.',
  '  5. Terminal @ Butonu: Terminali Sohbete Gönder (Ctrl+L).',
  '  6. Bütünlük: V8 modül derlemesi tam geçerli, product.json SHA-256 hash doğrulandı, önbellekler temizlendi.'
].join('\n');

fs.appendFileSync(fullPath, text, 'utf8');
console.log('Obsidian günlüğü başarıyla güncellendi.');
