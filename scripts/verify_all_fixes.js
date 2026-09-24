const fs = require('fs');
const vm = require('vm');
const crypto = require('crypto');
const path = require('path');

const appPath = 'C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app';

console.log('=== CANLI DOĞRULAMA TESTİ ===\n');

// 1. Workbench ESM Sözdizimi
const benchPath = path.join(appPath, 'out', 'vs', 'workbench', 'workbench.desktop.main.js');
const benchCode = fs.readFileSync(benchPath, 'utf8');
try {
  new vm.SourceTextModule(benchCode);
  console.log('1. Workbench V8 Modül Derlemesi: TAMAMEN GEÇERLİ [✓][✓][✓]');
} catch (e) {
  console.error('1. Workbench Derleme Hatası:', e);
}

// 2. Checksum Doğrulaması
const prod = JSON.parse(fs.readFileSync(path.join(appPath, 'product.json'), 'utf8'));
const actualHash = crypto.createHash('sha256').update(benchCode).digest('base64').replace(/=+$/, '');
const prodHash = prod.checksums['vs/workbench/workbench.desktop.main.js'];
console.log('2. Checksum Match:', actualHash === prodHash);

// 3. NLS Mesajları Doğrulaması
const nls = JSON.parse(fs.readFileSync(path.join(appPath, 'out', 'nls.messages.json'), 'utf8'));
console.log('\n3. NLS Mesajları:');
console.log('   [4206] Uzak Gezgin:', nls[4206]);
console.log('   [7898] Run & Debug:', nls[7898]);
console.log('   [12967] Terminal @:', nls[12967]);

// 4. Workbench İçerik Kontrolleri
console.log('\n4. Workbench Özel Bileşen Kontrolleri:');
console.log('   Ajan Özelleştirmeleri Açıklaması:', benchCode.includes('Daha iyi ve kişiselleştirilmiş bir deneyim için Ajanı özelleştirin.') ? '[✓]' : '[X]');
console.log('   İş Akışları Sekmesi (label):', benchCode.includes('label:"İş Akışları"') ? '[✓]' : '[X]');
console.log('   Kurallar Açıklaması:', benchCode.includes('Kurallar, Ajanın davranışını yönlendirmeye yardımcı olur.') ? '[✓]' : '[X]');
console.log('   İş Akışları Açıklaması:', benchCode.includes('İş akışları, Ajanın izleyebileceği kayıtlı yönlendirmelerdir.') ? '[✓]' : '[X]');
console.log('   Genel Butonu:', benchCode.includes('children:"Genel"}') ? '[✓]' : '[X]');
console.log('   Terminal Gönder Aksiyonu:', benchCode.includes('title:"Terminali Sohbete Gönder"') ? '[✓]' : '[X]');

// 5. WSL Eklentisi Kontrolü
const wslPath = path.join(appPath, 'extensions', 'antigravity-remote-wsl', 'dist', 'extension.js');
const wslCode = fs.readFileSync(wslPath, 'utf8');
console.log('\n5. WSL Eklentisi:');
console.log('   Varsayılan Dağıtım:', wslCode.includes('"Varsayılan Dağıtım"') ? '[✓]' : '[X]');

console.log('\n=== TEST TAMAMLANDI ===');
