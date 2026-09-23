const fs = require('fs');
const p = 'C:/Users/Work-D/AppData/Local/Programs/Antigravity IDE/resources/app/out/vs/workbench/workbench.desktop.main.js';
const c = fs.readFileSync(p, 'utf8');

const search = 'u=s.map(String).map(wBa).map((f,g)=>{const m=r[g]&&(o?cQn(r[g],!1):r[g]);return{text:n[g]?n[g]:f,detail:n[g]?f:"",description:m';
console.log('Search match count:', c.split(search).length - 1);
