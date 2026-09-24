const fs = require('fs');
const path = require('path');

const appPath = 'C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app';

const searchStrings = [
  'To customize Run and Debug',
  'There is no data provider registered',
  'default distro',
  'Customize Agent to get a better',
  'Rules help guide the behavior',
  'Workflows are saved prompts',
  'Send Terminal to Chat',
  'Workflows'
];

function searchFile(filePath, label) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  for (const s of searchStrings) {
    if (content.includes(s)) {
      console.log(`BULUNDU [${label}]: "${s}"`);
    }
  }
}

// 1. workbench.desktop.main.js.bak
searchFile(path.join(appPath, 'out', 'vs', 'workbench', 'workbench.desktop.main.js.bak'), 'workbench.desktop.main.js');

// 2. jetskiAgent/main.js
searchFile(path.join(appPath, 'out', 'jetskiAgent', 'main.js'), 'jetskiAgent/main.js');

// 3. nls.messages.json
searchFile(path.join(appPath, 'out', 'nls.messages.json'), 'nls.messages.json');

// 4. extensions dizinini tara
const extDir = 'C:\\Users\\Work-D\\.antigravity-ide\\extensions';
if (fs.existsSync(extDir)) {
  const exts = fs.readdirSync(extDir);
  for (const ext of exts) {
    const extFull = path.join(extDir, ext);
    if (fs.statSync(extFull).isDirectory()) {
      const files = fs.readdirSync(extFull);
      for (const f of files) {
        if (f.endsWith('.js') || f.endsWith('.json')) {
          searchFile(path.join(extFull, f), `ext:${ext}/${f}`);
        }
      }
    }
  }
}

// 5. resources/app/extensions dizinini tara
const builtinExtDir = path.join(appPath, 'extensions');
if (fs.existsSync(builtinExtDir)) {
  function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walkDir(full);
      else if (e.isFile() && (e.name.endsWith('.js') || e.name.endsWith('.json'))) {
        searchFile(full, `builtin:${path.relative(builtinExtDir, full)}`);
      }
    }
  }
  walkDir(builtinExtDir);
}
