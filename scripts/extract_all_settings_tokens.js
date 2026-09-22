const fs = require('fs');
const path = require('path');
const { getPaths } = require('../src/config');

const p = getPaths();

function NLa(t) {
  return t
    .replace(/\.([a-z0-9])/g, (e, i) => ` \u203A ${i.toUpperCase()}`)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]{1,})([A-Z][a-z])/g, '$1 $2')
    .replace(/^[a-z]/g, e => e.toUpperCase());
}

// 3457 ayar anahtarını topla
const c = fs.readFileSync(p.ide.workbenchFile + '.bak', 'utf8');
const allKeys = new Set();
const re = /['"](editor|files|workbench|window|terminal|explorer|search|git)\.([a-zA-Z0-9.]+)['"]/g;
let match;
while ((match = re.exec(c)) !== null) {
  allKeys.add(`${match[1]}.${match[2]}`);
}

console.log('Total setting keys:', allKeys.size);

// Her ayar için gDe simülasyonu
const rSegments = new Set();
const sLabels = new Set();

for (const key of allKeys) {
  const lastDot = key.lastIndexOf('.');
  let r = '';
  let prop = key;
  if (lastDot >= 0) {
    r = key.substring(0, lastDot);
    prop = key.substring(lastDot + 1);
  }
  
  const rLabel = NLa(r);
  const sLabel = NLa(prop);
  
  // rLabel içindeki segmentler
  for (const seg of rLabel.split(' \u203A ')) {
    if (seg.trim()) rSegments.add(seg.trim());
  }
  sLabels.add(sLabel);
}

console.log('Unique R Category Segments:', rSegments.size);
console.log('Unique S Labels:', sLabels.size);

fs.writeFileSync(
  path.join(__dirname, 'r_segments.json'),
  JSON.stringify(Array.from(rSegments).sort(), null, 2),
  'utf8'
);

fs.writeFileSync(
  path.join(__dirname, 's_labels.json'),
  JSON.stringify(Array.from(sLabels).sort(), null, 2),
  'utf8'
);

console.log('Saved r_segments.json and s_labels.json');
