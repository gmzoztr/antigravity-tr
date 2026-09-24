const fs = require('fs');
const crypto = require('crypto');

const appPath = 'C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app';

console.log('=== YERELLEŞTİRME DOĞRULAMA TESTİ ===\n');

// 1. Checksum Match Check
const product = JSON.parse(fs.readFileSync(appPath + '\\product.json', 'utf8'));
const benchPath = appPath + '\\out\\vs\\workbench\\workbench.desktop.main.js';
const benchHash = crypto.createHash('sha256').update(fs.readFileSync(benchPath)).digest('base64').replace(/=+$/, '');
const prodHash = product.checksums['vs/workbench/workbench.desktop.main.js'];
const checksumMatch = prodHash === benchHash;
console.log('1. Checksum Eşleşmesi (product.json):', checksumMatch ? 'BAŞARILI [✓]' : 'HATA [X]');
console.log('   Hesaplanan Hash:   ', benchHash);
console.log('   product.json Hash: ', prodHash);

// 2. NLS Messages Check
const nls = JSON.parse(fs.readFileSync(appPath + '\\out\\nls.messages.json', 'utf8'));
const nlsChecks = {
  '3141 (Geri Bildirim Menüsü)': nls[3141],
  '3154 (Geri Bildirimde Bulun)': nls[3154],
  '3155 (Tanılama Bilgilerini İndir)': nls[3155],
  '3308 (Hızlı Aç)': nls[3308],
  '3406 (İkincil Etkinlik Çubuğu)': nls[3406],
  '3408 (Varsayılan)': nls[3408],
  '4027 (Profil)': nls[4027],
  '4199 (Hızlı Aç)': nls[4199],
  '11161 (Kullanıcı Ayarları)': nls[11161]
};
console.log('\n2. NLS Mesaj Kontrolleri:');
for (const [k, v] of Object.entries(nlsChecks)) {
  console.log(`   ${k}: ${v}`);
}

// 3. Workbench Content Check
const benchContent = fs.readFileSync(benchPath, 'utf8');
console.log('\n3. Workbench Dosya Kontrolleri:');
console.log('   _eTr (Dropdown enum görünüm katmanı):', benchContent.includes('_eTr') ? '[✓]' : '[X]');
console.log('   _tr (Ayar sözlüğü haritası):', benchContent.includes('_tr') ? '[✓]' : '[X]');
console.log('   Ajan Başlığı (bra):', benchContent.includes('bra(d,"Ajan")') ? '[✓]' : '[X]');

// 4. DataCloud Extension Check
const dcFile = 'C:\\Users\\Work-D\\.antigravity-ide\\extensions\\googlecloudtools.datacloud-0.11.0-universal\\datacloud_vscode.js';
const dcContent = fs.readFileSync(dcFile, 'utf8');
console.log('\n4. Google Cloud Eklenti Kontrolleri:');
console.log('   (proje seçilmedi):', dcContent.includes('(proje seçilmedi)') ? '[✓]' : '[X]');
console.log('   Proje Seçilmedi:', dcContent.includes('Proje Seçilmedi') ? '[✓]' : '[X]');
console.log('   Bir Google Cloud projesi seçin:', dcContent.includes('Bir Google Cloud projesi seçin') ? '[✓]' : '[X]');

console.log('\n=== TEST TAMAMLANDI ===');
