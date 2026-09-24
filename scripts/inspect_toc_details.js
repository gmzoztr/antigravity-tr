const fs = require('fs');

const bench = fs.readFileSync('C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');

const idx = bench.indexOf('id:"security",scope:1');
console.log('Around security TOC:');
console.log(bench.slice(idx - 100, idx + 600));

const idxExt = bench.indexOf('id:"extensions",order:30');
console.log('\nAround extensions TOC:');
console.log(bench.slice(idxExt - 100, idxExt + 600));
