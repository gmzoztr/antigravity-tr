const fs = require('fs');

const bench = fs.readFileSync('C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');

// Find all properties starting with security. or extensions.
const regex = /"((?:security|extensions)\.[a-zA-Z0-9._]+)"/g;
let m;
const secProps = new Set();
const extProps = new Set();

while ((m = regex.exec(bench)) !== null) {
  if (m[1].startsWith('security.')) secProps.add(m[1]);
  if (m[1].startsWith('extensions.')) extProps.add(m[1]);
}

console.log('Security settings count:', secProps.size);
console.log('Security settings:');
console.log(Array.from(secProps));

console.log('\nExtensions settings count:', extProps.size);
console.log('Extensions settings:');
console.log(Array.from(extProps));
