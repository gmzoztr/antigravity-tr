const fs = require('fs');

const trJson = JSON.parse(fs.readFileSync('C:\\Users\\Work-D\\source\\antigravity-tr\\locales\\tr.json', 'utf8'));
const gde = trJson.rules.workbench.find(r => r.replace && r.replace.includes('_cat'));
const trStart = gde.replace.indexOf(';const _tr=') + ';const _tr='.length;
const catCalcStart = gde.replace.indexOf(';const cat=');
const _tr = JSON.parse(gde.replace.slice(trStart, catCalcStart));

const unicodeKeys = [
  'editor.unicodeHighlight.allowedCharacters',
  'editor.unicodeHighlight.allowedLocales',
  'editor.unicodeHighlight.ambiguousCharacters',
  'editor.unicodeHighlight.invisibleCharacters',
  'editor.unicodeHighlight.includeComments',
  'editor.unicodeHighlight.includeStrings',
  'editor.unicodeHighlight.nonBasicASCII'
];

for (const k of unicodeKeys) {
  const n = k.lastIndexOf('.');
  const leaf = k.substring(n + 1);
  console.log(`Key: ${k}`);
  console.log(`  leaf: ${leaf}`);
  console.log(`  _tr[k]:`, _tr[k]);
  console.log(`  _tr[leaf]:`, _tr[leaf]);
}
