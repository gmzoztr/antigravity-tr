const fs = require('fs');
const path = require('path');

const dirs = [
  'C:/Users/Work-D/.antigravity-ide/extensions',
  'C:/Users/Work-D/.vscode/extensions',
  'C:/Users/Work-D/AppData/Local/Programs/Antigravity IDE/resources/app/extensions'
];

function searchDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      const pkg = path.join(full, 'package.json');
      if (fs.existsSync(pkg)) {
        const c = fs.readFileSync(pkg, 'utf8');
        if (c.toLowerCase().includes('codex')) {
          console.log('Found in package.json:', pkg);
          const lines = c.split('\n');
          lines.forEach((l, i) => {
            if (l.toLowerCase().includes('codex') || l.toLowerCase().includes('sidebar') || l.toLowerCase().includes('title')) {
              console.log(`  L${i + 1}: ${l.trim()}`);
            }
          });
        }
      }
    }
  }
}

for (const d of dirs) searchDir(d);
