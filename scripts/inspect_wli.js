const fs = require('fs');
const { getPaths } = require('../src/config.js');
const wb = fs.readFileSync(getPaths().ide.workbenchFile, 'utf8');

// wli tanımını bulalım
const reg = /const\s+wli\s*=\s*["']([^"']+)["']|var\s+wli\s*=\s*["']([^"']+)["']|let\s+wli\s*=\s*["']([^"']+)["']|wli\s*=\s*["']([^"']+)["']/;
const m = wb.match(reg);
console.log('wli regex eslesmesi:', m ? m[0] : 'bulunamadi');

const idx = wb.indexOf('antigravitySettingsLink');
console.log('antigravitySettingsLink etrafindaki context:');
console.log(wb.slice(idx - 200, idx + 400));
