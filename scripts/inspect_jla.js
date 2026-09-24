const fs = require('fs');

const bench = fs.readFileSync('C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');

const idx = bench.indexOf('var jLa={id:"root"');
console.log(bench.slice(idx + 2400, idx + 4500));
