const fs = require('fs');

const benchPath = 'C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak';
const content = fs.readFileSync(benchPath, 'utf8');

const enumRegex = /enum:\s*\[([^[\]]{2,500})\]/g;
let match;
const allEnums = new Set();

while ((match = enumRegex.exec(content)) !== null) {
  const items = match[1].split(',');
  for (let it of items) {
    it = it.trim().replace(/^['"`]|['"`]$/g, '');
    if (it && !it.includes('{') && !it.includes('(') && !it.includes(':') && it.length < 40 && !it.startsWith('0x') && !it.match(/^\d+$/)) {
      allEnums.add(it);
    }
  }
}

console.log('Bulunan toplam benzersiz enum değeri sayısı:', allEnums.size);
const sorted = Array.from(allEnums).sort();
fs.writeFileSync('C:\\Users\\Work-D\\source\\antigravity-tr\\scripts\\all_enums.json', JSON.stringify(sorted, null, 2), 'utf8');
console.log('all_enums.json kaydedildi.');
