const fs = require('fs');

const benchPath = 'C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak';
const content = fs.readFileSync(benchPath, 'utf8');

// Find all properties: "prefix.suffix": { ... }
const propRegex = /"([a-zA-Z0-9_-]+\.[a-zA-Z0-9._-]+)":\s*\{/g;
let m;
const allConfigProps = new Set();

while ((m = propRegex.exec(content)) !== null) {
  const p = m[1];
  // Filter for real settings prefixes
  if (/^(editor|workbench|window|files|terminal|explorer|search|git|diffEditor|scm|debug|extensions|security|update|telemetry|comments|chat|inlineChat|accessibility|notebook|testing|screencastMode)\./.test(p)) {
    allConfigProps.add(p);
  }
}

console.log('Real total configuration properties found across all domains:', allConfigProps.size);
const sorted = Array.from(allConfigProps).sort();
fs.writeFileSync('C:\\Users\\Work-D\\source\\antigravity-tr\\scripts\\all_real_config_properties.json', JSON.stringify(sorted, null, 2), 'utf8');
console.log('Saved all_real_config_properties.json');
