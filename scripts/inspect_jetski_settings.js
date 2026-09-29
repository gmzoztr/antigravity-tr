const fs = require('fs');
const { getPaths } = require('../src/config.js');
const jetski = fs.readFileSync(getPaths().ide.jetskiFile, 'utf8');

console.log('--- Searching for Settings Manager in jetskiAgent/main.js ---');

const terms = ['settingsManagerTargetScreen', 'SettingsManager', 'Customization', 'Provide Feedback', 'Regroup Google3 Chats'];
for (const t of terms) {
  let count = 0;
  let pos = 0;
  while (true) {
    const idx = jetski.indexOf(t, pos);
    if (idx === -1) break;
    count++;
    if (count <= 2) {
      console.log(`\nFound "${t}" at index ${idx}:`);
      console.log(jetski.slice(Math.max(0, idx - 100), idx + 250));
    }
    pos = idx + t.length;
  }
  console.log(`Total count for "${t}": ${count}`);
}
