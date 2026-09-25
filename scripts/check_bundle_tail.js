const fs = require('fs');

const wbPath = 'C:/Users/Work-D/AppData/Local/Programs/Antigravity IDE/resources/app/out/vs/workbench/workbench.desktop.main.js';
const content = fs.readFileSync(wbPath, 'utf8');

const endTag = "return{category:cat,label:lab}";
const idx = content.indexOf(endTag);
console.log('Index of return:', idx);
if (idx !== -1) {
  console.log('Tail code:', content.slice(idx - 150, idx + 50));
}
