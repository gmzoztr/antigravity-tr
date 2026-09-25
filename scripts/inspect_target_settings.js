const fs = require('fs');

const bench = fs.readFileSync('C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');

// Find all properties related to lightbulb, multiCursor, occurrencesHighlight, semanticToken, unicodeHighlight
const prefixes = [
  'editor.lightbulb',
  'editor.multiCursor',
  'editor.occurrencesHighlight',
  'editor.semantic',
  'editor.unicodeHighlight'
];

const found = [];
for (const p of prefixes) {
  const reg = new RegExp(`"${p}[^"]*":\\s*\\{([^}]{0,800})\\}`, 'g');
  let m;
  while ((m = reg.exec(bench)) !== null) {
    found.push({ key: m[0].split('":')[0].replace('"', ''), body: m[1] });
  }
}

console.log('Found properties count:', found.length);
for (const item of found) {
  console.log('\nKey:', item.key);
  const enumM = item.body.match(/enum:\s*\[([^\]]+)\]/);
  if (enumM) console.log('  Enums:', enumM[1]);
}
