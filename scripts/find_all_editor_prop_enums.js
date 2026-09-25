const fs = require('fs');

const bench = fs.readFileSync('C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');
const trJson = JSON.parse(fs.readFileSync('C:\\Users\\Work-D\\source\\antigravity-tr\\locales\\tr.json', 'utf8'));

const r86 = trJson.rules.workbench.find(r => r.replace && r.replace.includes('const _eTr='));
const start = r86.replace.indexOf('const _eTr=') + 'const _eTr='.length;
const end = r86.replace.indexOf('},d=wBa', start) + 1;
const _eTr = JSON.parse(r86.replace.slice(start, end));

// Find all properties starting with "editor." that have enum: [...]
const propRegex = /"(editor\.[a-zA-Z0-9._]+)":\s*\{([^}]{0,800})\}/g;
let m;
const missing = new Map();

while ((m = propRegex.exec(bench)) !== null) {
  const key = m[1];
  const body = m[2];
  const enumM = body.match(/enum:\s*\[([^\]]+)\]/);
  if (enumM) {
    const rawList = enumM[1];
    const items = rawList.match(/["']([^"']+)["']/g) || [];
    for (const item of items) {
      const val = item.replace(/["']/g, '');
      if (!_eTr[val]) {
        if (!missing.has(val)) missing.set(val, []);
        missing.get(val).push(key);
      }
    }
  }
}

console.log('Missing enums from editor configuration properties count:', missing.size);
for (const [v, keys] of missing.entries()) {
  console.log(`  "${v}" (used in: ${keys.join(', ')})`);
}
