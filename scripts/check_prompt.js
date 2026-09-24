const fs = require('fs');
const bak = fs.readFileSync('C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');

const s = 'Enter workflow name';
const idx = bak.indexOf(s);
console.log('Index in bak:', idx);
if (idx !== -1) {
  console.log('Context in bak:');
  console.log(bak.slice(idx - 30, idx + 180));
}

const dict = JSON.parse(fs.readFileSync('C:\\Users\\Work-D\\source\\antigravity-tr\\locales\\tr.json', 'utf8'));
const r = dict.rules.workbench.find(x => x.search && x.search.includes('Enter workflow name'));
console.log('Found in dict?:', !!r);
if (r) {
  console.log('r.search:', r.search);
  console.log('bak includes r.search?:', bak.includes(r.search));
}
