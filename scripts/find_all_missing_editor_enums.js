const fs = require('fs');

const bench = fs.readFileSync('C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');
const trJson = JSON.parse(fs.readFileSync('C:\\Users\\Work-D\\source\\antigravity-tr\\locales\\tr.json', 'utf8'));

const r86 = trJson.rules.workbench.find(r => r.replace && r.replace.includes('const _eTr='));
const start = r86.replace.indexOf('const _eTr=') + 'const _eTr='.length;
const end = r86.replace.indexOf('},d=wBa', start) + 1;
const _eTr = JSON.parse(r86.replace.slice(start, end));

// Find all enum definitions in editor
const enumRegex = /new\s+Zv\(\d+,\s*["']([^"']+)["'],\s*[^,]+,\s*\[([^\]]+)\]/g;
let m;
const missingEnums = new Map();

while ((m = enumRegex.exec(bench)) !== null) {
  const optName = m[1];
  const rawList = m[2];
  const items = rawList.match(/["']([^"']+)["']/g) || [];
  for (const item of items) {
    const val = item.replace(/["']/g, '');
    if (!_eTr[val]) {
      if (!missingEnums.has(val)) missingEnums.set(val, []);
      missingEnums.get(val).push(optName);
    }
  }
}

console.log('Missing editor enums count:', missingEnums.size);
for (const [v, opts] of missingEnums.entries()) {
  console.log(`  "${v}" (used in: ${opts.join(', ')})`);
}
