const fs = require('fs');

const glob = fs.readdirSync('C:/Users/Work-D/Documents/Obsidian-Beyin').filter(f => f.includes('Antigravity'));
if (glob.length === 0) process.exit(1);
const fullPath = 'C:/Users/Work-D/Documents/Obsidian-Beyin/' + glob[0];

const text = [
  '',
  '---',
  '',
  '## 25.09.2026 (Kapsamlı Eklenti ve Telemetri Düzeltmesi) - Uzantılar Bölümünün ve Telemetri Açıklamalarının Eksiksiz Türkçeleştirilmesi',
  '- **Kullanıcı Geri Bildirimi:**',
  '  1. Ayarlar > Uzantılar bölümünün genelinde başlık ve açıklamaların İngilizce kalması ("uzantılar kısmı komple sorunlu ya").',
  '  2. Uygulama > Telemetri altında `Feedback: Etkin` başlığı ve açıklama metninin ("To manage how Antigravity IDE stores code snippet telemetry...") İngilizce olması.',
  '  3. Uzantılar > `.ipynb Desteği` altında `Paste Images As Attachments: Etkin` kategori başlığının İngilizce olması.',
  '  4. Uzantılar > `Antigravity Remote - Dev Containers` ve `SSH` altında `Enable SSH Agent Forwarding`, `Disable Server Checksum`, `Config File`, `Path` başlıkları ve açıklamalarının İngilizce olması.',
  '  5. Uzantılar > `clangd` altında `Arguments`, `Check Updates`, `Detect Extension Conflicts`, `Enable Code Completion`, `Enable Hover`, `Fallback Flags` vb. tüm başlık ve açıklamaların İngilizce olması.',
  '- **Uygulanan Çözümler:**',
  '  1. **Uzantı Ayarları Taraması ve Kapsamlı Sözlük:** Tüm yerleşik ve kullanıcı uzantıları taranarak eksik kalan 536 benzersiz ayar etiketi ve 100 kategori tespit edildi; sözlük 359 kategori ve 2.261 ayar çevirisine çıkarıldı.',
  '  2. **Kategori ve Ayar Başlığı Yamaları (`_cat` ve `_tr`):**',
  '     - `Paste Images As Attachments` -> `Resimleri Ek Olarak Yapıştır`',
  '     - `Feedback` -> `Geri Bildirim` (`Geri Bildirim: Etkin`)',
  '     - `Antigravity Dev Containers`, `Antigravity SSH`, `WSL`, `Clangd` kategorileri ve tüm leaf başlıkları eksiksiz Türkçeleştirildi.',
  '  3. **Yerleşik Eklenti Açıklama Yamaları (`patchAntigravityRemoteExtensions` ve `patchClangdExtension`):** Language pack desteği bulunmayan Google yerleşik uzantılarının (`antigravity-dev-containers`, `antigravity-remote-openssh`, `antigravity-remote-wsl`, `antigravity`, `clangd`) `package.json` açıklamaları ve başlıkları doğrudan Türkçeleştirildi.',
  '  4. **Telemetri Açıklama Yaması (`nls.messages.json`):** 2338. indeks ("To manage how {0} stores code snippet telemetry...") ve 2358/2359. indeksler ("Enable feedback mechanisms...") `locales/tr.json` `nlsMessages` kural listesine eklendi.',
  '  5. **Kurulum ve Doğrulama:** `node bin/antigravity-tr.js install` başarıyla çalıştırıldı, V8 bytecode ve Electron önbellekleri temizlendi, sözdizimi doğrulandı.'
].join('\n');

fs.appendFileSync(fullPath, text, 'utf8');
console.log('Obsidian günlüğü başarıyla güncellendi.');
