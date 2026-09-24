const fs = require('fs');

const bench = fs.readFileSync('C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');

// TOC tree children for security & extensions
// In VS Code, settings TOC nodes are registered in IPreferencesSearchService or SettingsTreeModel
// or registered via ConfigurationRegistry with category/title

const regCat = /registerConfiguration\(\{([^}]+)\}/g;
let m;
const secConfigs = [];
const extConfigs = [];

while ((m = regCat.exec(bench)) !== null) {
  const chunk = m[1];
  if (chunk.includes('id:"security"') || chunk.includes('id:"workspace.trust"')) {
    secConfigs.push(chunk);
  }
  if (chunk.includes('id:"extensions"')) {
    extConfigs.push(chunk);
  }
}

console.log('Security configs registered count:', secConfigs.length);
secConfigs.forEach((c, i) => console.log(`[Security ${i}]:`, c.slice(0, 150)));

console.log('\nExtensions configs registered count:', extConfigs.length);
extConfigs.forEach((c, i) => console.log(`[Extensions ${i}]:`, c.slice(0, 150)));
