const fs = require('fs');
const bench = fs.readFileSync('C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');

let idx = 0;
while ((idx = bench.indexOf('multiCursorPaste', idx)) !== -1) {
  console.log('Match at', idx, ':', bench.slice(idx - 60, idx + 160));
  idx += 16;
}
