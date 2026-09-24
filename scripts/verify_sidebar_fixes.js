const fs = require('fs');
const vm = require('vm');
const crypto = require('crypto');
const path = require('path');

const appPath = 'C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app';

console.log('=== DOĞRULAMA TESTİ ===\n');

// 1. ESM Modül Derlemesi
const benchPath = path.join(appPath, 'out', 'vs', 'workbench', 'workbench.desktop.main.js');
const benchCode = fs.readFileSync(benchPath, 'utf8');
try {
  new vm.SourceTextModule(benchCode);
  console.log('1. V8 Modül Derlemesi: TAMAMEN GEÇERLİ [✓][✓][✓]');
} catch (e) {
  console.error('1. HATA:', e);
}

// 2. Checksum Doğrulaması
const prod = JSON.parse(fs.readFileSync(path.join(appPath, 'product.json'), 'utf8'));
const actualHash = crypto.createHash('sha256').update(benchCode).digest('base64').replace(/=+$/, '');
const prodHash = prod.checksums['vs/workbench/workbench.desktop.main.js'];
console.log('2. Checksum Match:', actualHash === prodHash);

// 3. NLS Mesajları
const nls = JSON.parse(fs.readFileSync(path.join(appPath, 'out', 'nls.messages.json'), 'utf8'));
console.log('\n3. NLS Kontrolleri:');
console.log('   [3193] Show Primary Side Bar:', nls[3193]);
console.log('   [3191] Hide Primary Side Bar:', nls[3191]);
console.log('   [3200] Toggle Primary Side Bar:', nls[3200]);
console.log('   [3179] Move Primary Side Bar Right:', nls[3179]);

// 4. Workbench Enter Workflow Name
console.log('\n4. Workbench Kontrolleri:');
console.log('   İş akışı adını girin:', benchCode.includes('İş akışı adını girin') ? '[✓]' : '[X]');
console.log('   örn. bellek-sızıntısı-ayıklama:', benchCode.includes('örn. bellek-sızıntısı-ayıklama') ? '[✓]' : '[X]');

console.log('\n=== TEST TAMAMLANDI ===');
