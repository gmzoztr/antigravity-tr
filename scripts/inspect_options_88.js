const fs = require('fs');
const bench = fs.readFileSync('C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');

const idx = bench.indexOf('super(88,');
console.log('super(88):', idx);
if (idx !== -1) console.log(bench.slice(idx - 50, idx + 400));

const occIdx = bench.indexOf('occurrencesHighlight');
console.log('occurrencesHighlight:', occIdx);
if (occIdx !== -1) console.log(bench.slice(occIdx - 50, occIdx + 400));
