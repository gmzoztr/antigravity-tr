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
console.log('   Actual: ', actualHash);
console.log('   Product:', prodHash);

// 3. Dropdown detail kontrolü
console.log('\n3. Dropdown detail kontrolü:');
const hasOldDetail = benchCode.includes('detail:n[g]?f:(_eTr[f]?f:"")');
const hasCleanDetail = benchCode.includes('detail:n[g]?f:""');
console.log('   Eski detail (auto, always basan) kaldırıldı mı?:', !hasOldDetail ? '[✓]' : '[X]');
console.log('   Temiz detail uygulandı mı?:', hasCleanDetail ? '[✓]' : '[X]');

// 4. Metin Düzenleyici Ayar Başlıkları Kontrolü
console.log('\n4. Metin Düzenleyici Ayar Başlıkları Kontrolü:');
console.log('   Zaman Uyumsuz Belirteç Ayırma Günlüğü:', benchCode.includes('Zaman Uyumsuz Belirteç Ayırma Günlüğü') ? '[✓]' : '[X]');
console.log('   Zaman Uyumsuz Belirteç Ayırma Doğrulaması:', benchCode.includes('Zaman Uyumsuz Belirteç Ayırma Doğrulaması') ? '[✓]' : '[X]');
console.log('   Renklendirilmiş Ayraç Çiftleri:', benchCode.includes('Renklendirilmiş Ayraç Çiftleri') ? '[✓]' : '[X]');
console.log('   Maksimum Satır Sayısı:', benchCode.includes('Maksimum Satır Sayısı') ? '[✓]' : '[X]');

console.log('\n=== TEST TAMAMLANDI ===');
