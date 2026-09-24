const fs = require('fs');

const benchPath = 'C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak';
const content = fs.readFileSync(benchPath, 'utf8');

// Find all properties registered in configuration: "editor.xxx": { ... }
const propRegex = /"(editor\.[a-zA-Z0-9._]+)":\s*\{/g;
let m;
const configProperties = new Set();

while ((m = propRegex.exec(content)) !== null) {
  configProperties.add(m[1]);
}

console.log('Real editor configuration properties found:', configProperties.size);
const sorted = Array.from(configProperties).sort();
fs.writeFileSync('C:\\Users\\Work-D\\source\\antigravity-tr\\scripts\\real_editor_config_properties.json', JSON.stringify(sorted, null, 2), 'utf8');
console.log('Saved real_editor_config_properties.json');
