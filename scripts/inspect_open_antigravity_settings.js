const fs = require('fs');
const { getPaths } = require('../src/config.js');
const wb = fs.readFileSync(getPaths().ide.workbenchFile, 'utf8');

const key = 'workbench.action.openAntigravitySettings';
let pos = 0;
while (true) {
  const idx = wb.indexOf(key, pos);
  if (idx === -1) break;
  console.log(`\n--- Match at index ${idx} ---`);
  console.log(wb.slice(idx - 100, idx + 400));
  pos = idx + key.length;
}
