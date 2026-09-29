const fs = require('fs');
const { getPaths } = require('../src/config.js');

const paths = getPaths();
const jetski = fs.readFileSync(paths.ide.jetskiFile, 'utf8');

console.log('=== ANTIGRAVITY IDE SETTINGS EKRANLARI VE METINLERI ===\n');

// 1. Kategori Enum bloğunu bul
const enumIdx = jetski.indexOf('.Account="Account"');
if (enumIdx !== -1) {
  const start = jetski.lastIndexOf('var ', enumIdx) !== -1 ? jetski.lastIndexOf('var ', enumIdx) : enumIdx - 100;
  const end = jetski.indexOf('}))', enumIdx) + 3;
  console.log('--- 1. SETTINGS TABS (SEKMELER) ---');
  console.log(jetski.slice(start, end));
}

// 2. Her bir sekmenin JSX/React render bloklarını arayalım
const screens = [
  { name: 'Account', search: 'title:"Account"' },
  { name: 'Permissions', search: 'title:"Permissions"' },
  { name: 'General', search: 'title:"General"' },
  { name: 'Appearance', search: 'title:"Appearance"' },
  { name: 'Browser', search: 'title:"Browser"' },
  { name: 'Notifications', search: 'title:"Notifications"' },
  { name: 'Provide Feedback', search: 'title:"Provide Feedback"' },
  { name: 'Customization', search: 'title:"Customizations"' },
  { name: 'Models', search: 'title:"Models"' },
  { name: 'App', search: 'title:"App"' },
  { name: 'Shortcuts', search: 'title:"Shortcuts"' },
  { name: 'Jetski Chat', search: 'title:"Jetski Chat"' },
  { name: 'Labs', search: 'title:"Labs"' },
  { name: 'Developer', search: 'title:"Developer"' }
];

console.log('\n--- 2. HER SEKMEDEKİ İNGİLİZCE BAŞLIK VE ETİKETLER ---');
for (const sc of screens) {
  let pos = 0;
  console.log(`\n>>> [SEKME: ${sc.name}] <<<`);
  let found = 0;
  while (true) {
    const idx = jetski.indexOf(sc.search, pos);
    if (idx === -1) break;
    found++;
    const snippet = jetski.slice(idx, idx + 350);
    // snippet içindeki children:"..." metinlerini bul
    const textMatches = snippet.match(/children:\s*["']([^"']+)["']/g) || [];
    console.log(`  Konum ${idx}:`);
    textMatches.forEach(t => console.log('   *', t));
    pos = idx + sc.search.length;
    if (found >= 2) break;
  }
  if (found === 0) {
    // alternatif arama
    console.log('  (Doğrudan title araması bulunamadı, genel metin taranacak)');
  }
}
