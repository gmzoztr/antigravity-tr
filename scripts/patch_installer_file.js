const fs = require('fs');
const filePath = 'C:/Users/Work-D/source/antigravity-tr/src/installer.js';
let content = fs.readFileSync(filePath, 'utf8');

const target = '  // 3. Dil ayarları varsayılana çevir';
const addition = `  // Desktop app geri yükle
  if (fs.existsSync(paths.desktop.appPath)) {
    const desktopRes = restoreDesktopApp(paths);
    if (desktopRes.restored) {
      console.log('   [✓] Antigravity Desktop: Orijinal app.asar dosyasına dönüldü.');
    }
  }

`;

if (!content.includes('restoreDesktopApp(paths)')) {
  content = content.replace(target, addition + target);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully patched src/installer.js');
} else {
  console.log('Already patched!');
}
