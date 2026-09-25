const fs = require('fs');
const path = require('path');

const extDirs = [
  'C:/Users/Work-D/AppData/Local/Programs/Antigravity IDE/resources/app/extensions',
  'C:/Users/Work-D/.antigravity-ide/extensions',
  'C:/Users/Work-D/.vscode/extensions'
];

let arrayConfigExts = [];
let allExtProps = {};

for (const d of extDirs) {
  if (!fs.existsSync(d)) continue;
  for (const sub of fs.readdirSync(d, { withFileTypes: true })) {
    if (!sub.isDirectory()) continue;
    const pkgPath = path.join(d, sub.name, 'package.json');
    if (!fs.existsSync(pkgPath)) continue;

    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      const cfg = pkg.contributes?.configuration;
      if (!cfg) continue;

      if (Array.isArray(cfg)) {
        let count = 0;
        for (const c of cfg) {
          if (c.properties) {
            for (const [k, v] of Object.entries(c.properties)) {
              allExtProps[k] = { ext: sub.name, ...v };
              count++;
            }
          }
        }
        arrayConfigExts.push({ ext: sub.name, count });
      } else if (cfg.properties) {
        for (const [k, v] of Object.entries(cfg.properties)) {
          allExtProps[k] = { ext: sub.name, ...v };
        }
      }
    } catch (e) {}
  }
}

console.log('Array configuration extensions:', arrayConfigExts);
console.log('Total extension properties found:', Object.keys(allExtProps).length);
