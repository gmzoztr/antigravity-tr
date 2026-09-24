const fs = require('fs');

const content = fs.readFileSync('C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');

const enumRegex = /enum:\s*\[([^\]]+)\]/g;
let m;
const stringEnums = new Set();
const quoteRegex = /['"]([a-zA-Z0-9_-]+)['"]/g;

while ((m = enumRegex.exec(content)) !== null) {
  let q;
  while ((q = quoteRegex.exec(m[1])) !== null) {
    const val = q[1];
    if (val.length > 1 && !/^\d+$/.test(val)) {
      stringEnums.add(val);
    }
  }
}

console.log('Total string enums in settings:', stringEnums.size);
const sorted = Array.from(stringEnums).sort();
fs.writeFileSync('C:\\Users\\Work-D\\source\\antigravity-tr\\scripts\\pure_string_enums.json', JSON.stringify(sorted, null, 2), 'utf8');
console.log('Saved pure_string_enums.json');
