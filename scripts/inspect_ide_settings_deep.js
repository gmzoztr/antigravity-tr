const fs = require('fs');
const path = require('path');
const { getPaths } = require('../src/config.js');

const paths = getPaths();
const wb = fs.readFileSync(paths.ide.workbenchFile, 'utf8');

console.log('--- 1. ANTIGRAVITY SETTINGS TREE NODES (TOC) ---');
const idx = wb.indexOf('antigravitySettings');
if (idx !== -1) {
  console.log(wb.slice(idx - 100, idx + 600));
}

console.log('\n--- 2. CATEGORY ENUM (_oe) STRINGS ---');
const oeIdx = wb.indexOf('_oe=(t=>');
if (oeIdx !== -1) {
  console.log(wb.slice(oeIdx, oeIdx + 600));
}

console.log('\n--- 3. CONFIGURATION REGISTRY: ANTIGRAVITY PROPERTIES ---');
// "antigravity.xxx": { ... }
const propRegex = /"(antigravity\.[a-zA-Z0-9_\.]+)"\s*:\s*\{([^}]+)\}/g;
const configs = [];
let m;
while ((m = propRegex.exec(wb)) !== null) {
  const key = m[1];
  const body = m[2];
  
  // title, description, category veya enum cekelim
  const titleM = body.match(/description\s*:\s*(?:ln\s*\(\s*\d+\s*,\s*)?["']([^"']+)["']/);
  const catM = body.match(/category\s*:\s*["']([^"']+)["']/);
  configs.push({
    key,
    title: titleM ? titleM[1] : null,
    category: catM ? catM[1] : null
  });
}
console.log(`Bulunan antigravity.* ayar ozelligi sayisi: ${configs.length}`);
configs.slice(0, 25).forEach(c => {
  console.log(`  ${c.key} => [${c.category || '-'}] ${c.title || '-'}`);
});

console.log('\n--- 4. SETTINGS EDITOR UI LABELS ---');
// Ayarlar duzenleyicisindeki genel metinler
const searchTerms = [
  'Commonly Used', 'Text Editor', 'Cursor', 'Find', 'Font', 'Formatting',
  'Diff Editor', 'Minimap', 'Breadcrumbs', 'Terminal', 'Search',
  'Settings (UI)', 'Open Settings (JSON)', 'Search Settings',
  'No Settings Found', 'Also modified in', 'Modified in'
];

for (const term of searchTerms) {
  const found = wb.includes(`"${term}"`) || wb.includes(`'${term}'`);
  console.log(`  "${term}": ${found ? 'VAR' : 'YOK'}`);
}
