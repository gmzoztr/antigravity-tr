const fs = require('fs');

const bench = fs.readFileSync('C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');

// Find all configuration titles and categories for extensions
const regex = /title:\s*['"]([a-zA-Z0-9_ -]+)['"]/g;
let m;
const titles = new Set();
while ((m = regex.exec(bench)) !== null) {
  titles.add(m[1]);
}

// Find all extension configurations
const extRegex = /registerConfiguration\(\{\s*id:\s*['"]([^'"]+)['"]/g;
while ((m = extRegex.exec(bench)) !== null) {
  console.log('Registered Config ID:', m[1]);
}
