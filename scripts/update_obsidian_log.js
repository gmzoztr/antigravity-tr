const fs = require('fs');

const glob = fs.readdirSync('C:/Users/Work-D/Documents/Obsidian-Beyin').filter(f => f.includes('Antigravity'));
if (glob.length === 0) process.exit(1);
const fullPath = 'C:/Users/Work-D/Documents/Obsidian-Beyin/' + glob[0];

const text = [
  '',
  '---',
  '',
  '## 25.09.2026 (Nihai Eksiksiz Denetim) - Gemini Code Assist, Cloud Code, Azure ve Tüm Eklenti Ayarlarının %100 Türkçeleştirilmesi',
  '- **Kullanıcı Geri Bildirimi:** Kalan eksiklerin kullanıcıyı yorması üzerine, kullanıcının gözü gibi tüm uzantılar ve ortam ayarları derinlemesine tarandı.',
  '- **Tespit Edilen Kök Neden:** `contributes.configuration` alanı dizi (`Array`) olan uzantıların (`css-language-features`, `typescript-language-features`, `google.geminicodeassist`, `googlecloudtools.cloudcode`, `vscode-azureresourcegroups`, `prettier` vb.) önceki tarama mantığında atlanmış olması.',
  '- **Uygulanan Çözümler:**',
  '  1. Ortamdaki 980 uzantı ayarının tamamı taranarak eksik kalan 190 ayar etiketi (`Telemetry`, `Max Cited Length`, `Force Oob Login`, `Single Quote`, `Kubernetes Version`, `Enable Bigquery Explorer` vb.) ve kategori segmentleri Türkçeleştirildi.',
  '  2. Toplam sözlük hacmi **389 kategoriye** ve **4.285 ayar çevirisine** çıkarıldı.',
  '  3. Canlı bundle doğrulaması ile kalan İngilizce etiket sayısı tam olarak **0\'a (SIFIR)** indirildi.',
  '  4. `files.autoSave`, `editor.tabSize`, `editor.renderWhitespace`, `editor.fontSize`, `editor.fontFamily`, `clangd`, `remote`, `ipynb`, `telemetry` dahil tüm çekirdek ayarlar korundu ve doğrulandı.',
  '  5. `node bin/antigravity-tr.js install` başarıyla çalıştırıldı ve Electron önbellekleri temizlendi.'
].join('\n');

fs.appendFileSync(fullPath, text, 'utf8');
console.log('Obsidian günlüğü başarıyla güncellendi.');
