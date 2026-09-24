const fs = require('fs');
const b = fs.readFileSync('C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js', 'utf8');

const checks = {
  'Varsayılan Katlama Aralığı Sağlayıcısı': b.includes('Varsayılan Katlama Aralığı Sağlayıcısı'),
  'Tercihler': b.includes('Tercihler'),
  'Bırakma Seçicisini Göster': b.includes('Bırakma Seçicisini Göster'),
  'Yatay Ayraç Çiftleri': b.includes('Yatay Ayraç Çiftleri'),
  'Etkin Ayraç Çiftini Vurgula': b.includes('Etkin Ayraç Çiftini Vurgula'),
  'Etkin Girintiyi Vurgula': b.includes('Etkin Girintiyi Vurgula'),
  'Girinti': b.includes('"Girinti"'),
  'Bıraktıktan Sonra (afterDrop)': b.includes('Bıraktıktan Sonra'),
  'Gözat (peek)': b.includes('"Gözat"'),
  'Git ve Gözat (gotoAndPeek)': b.includes('Git ve Gözat'),
  'Git (goto)': b.includes('"Git"'),
};
for (const [k, v] of Object.entries(checks)) {
  console.log((v ? '[✓]' : '[X]'), k);
}
