const fs = require('fs');
const { getPaths } = require('../src/config.js');

const paths = getPaths();
const jetski = fs.readFileSync(paths.ide.jetskiFile, 'utf8');

// 9450000 ile 9650000 arasındaki bölgeyi tarayalım
const start = 9450000;
const end = 9650000;
const region = jetski.slice(start, end);

console.log('Bölge boyutu:', region.length, 'karakter');

// Başlıkları ve buton metinlerini arayalım
// örn. title:"...", label:"...", children:"..."
const titleMatches = region.match(/title:\s*["']([^"']+)["']/g) || [];
const uniqueTitles = Array.from(new Set(titleMatches.map(t => t.match(/title:\s*["']([^"']+)["']/)[1])));

console.log('\n--- BÖLGEDEKİ TÜM TITLE DEĞERLERİ ---');
uniqueTitles.forEach(t => console.log(' ', t));

// children: "..." metinleri
const childrenMatches = region.match(/children:\s*["']([A-Za-z0-9\s.,?!/:;_\-()]{3,60})["']/g) || [];
const uniqueChildren = Array.from(new Set(childrenMatches.map(c => {
  const m = c.match(/children:\s*["']([^"']+)["']/);
  return m ? m[1].trim() : null;
}))).filter(Boolean);

console.log('\n--- BÖLGEDEKİ UI METİNLERİ (children) ---');
console.log(`Toplam benzersiz metin sayısı: ${uniqueChildren.length}`);
uniqueChildren.slice(0, 60).forEach(c => console.log('  -', c));
