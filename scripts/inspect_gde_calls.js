const fs = require('fs');

const wbPath = 'C:/Users/Work-D/AppData/Local/Programs/Antigravity IDE/resources/app/out/vs/workbench/workbench.desktop.main.js.bak';
const wb = fs.readFileSync(wbPath, 'utf8');

let idx = 0;
while ((idx = wb.indexOf('gDe(', idx)) !== -1) {
  console.log('=== Match at', idx, '===');
  console.log(wb.slice(idx - 150, idx + 250));
  idx += 4;
}
