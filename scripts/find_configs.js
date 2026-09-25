const fs = require('fs');
const bench = fs.readFileSync('C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');

function findConfig(prop) {
  const p = `"${prop}":`;
  let idx = 0;
  while ((idx = bench.indexOf(p, idx)) !== -1) {
    console.log(`Found ${prop} at ${idx}:`);
    console.log(bench.slice(idx, idx + 400));
    idx += p.length;
  }
}

findConfig('editor.multiCursorPaste');
findConfig('editor.occurrencesHighlight');
findConfig('editor.semanticTokenColorCustomizations');
