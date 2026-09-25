const fs = require('fs');
const path = require('path');

const dirs = [
  'C:/Users/Work-D/AppData/Local/Programs/Antigravity IDE/resources/app',
  'C:/Users/Work-D/.antigravity-ide/extensions'
];

function searchFiles(dir) {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) {
      if (f.name !== 'node_modules' && f.name !== '.git') searchFiles(full);
    } else if (f.isFile() && (f.name.endsWith('.js') || f.name.endsWith('.json'))) {
      try {
        const c = fs.readFileSync(full, 'utf8');
        if (c.includes('code snippet telemetry') || c.includes('stores code snippet')) {
          console.log('FOUND in:', full);
          const idx = c.indexOf('code snippet telemetry');
          console.log(c.substring(idx - 100, idx + 200));
        }
      } catch (e) {}
    }
  }
}

for (const d of dirs) searchFiles(d);
