const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const asarPath = 'C:/Users/Work-D/AppData/Local/Programs/Antigravity/resources/app.asar';
const destDir = path.join(__dirname, '..', 'scratch', 'desktop_asar');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

console.log('Extracting app.asar to', destDir);
execSync(`npx asar extract "${asarPath}" "${destDir}"`, { stdio: 'inherit' });
console.log('Extracted successfully!');

const mainJsPath = path.join(destDir, 'dist', 'main.js');
if (fs.existsSync(mainJsPath)) {
  const code = fs.readFileSync(mainJsPath, 'utf8');
  console.log(`main.js size: ${code.length}`);
  const lines = code.split('\n');
  lines.forEach((l, idx) => {
    if (l.includes('loadURL') || l.includes('loadFile') || l.includes('http://') || l.includes('https://') || l.includes('customScheme') || l.includes('app://') || l.includes('index.html')) {
      console.log(`${idx + 1}: ${l.trim().slice(0, 160)}`);
    }
  });
} else {
  console.log('dist/main.js not found!');
}
