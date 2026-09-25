const fs = require('fs');
const path = require('path');

const extDirs = [
  'C:/Users/Work-D/AppData/Local/Programs/Antigravity IDE/resources/app/extensions',
  'C:/Users/Work-D/.antigravity-ide/extensions',
  'C:/Users/Work-D/.vscode/extensions'
];

let withTitle = [];

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

      const cfgs = Array.isArray(cfg) ? cfg : [cfg];
      for (const c of cfgs) {
        if (!c.properties) continue;
        for (const [k, v] of Object.entries(c.properties)) {
          if (v.title) {
            withTitle.push({ ext: sub.name, key: k, title: v.title });
          }
        }
      }
    } catch (e) {}
  }
}

console.log('Settings with explicit v.title count:', withTitle.length);
console.log('Sample:', withTitle.slice(0, 30));
