const fs = require('fs');
const path = require('path');
const { getPaths } = require('../src/config');

const p = getPaths();

function NLa(t) {
  return t
    .replace(/\.([a-z0-9])/g, (e, i) => ` \u203A ${i.toUpperCase()}`)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]{1,})([A-Z][a-z])/g, '$1 $2')
    .replace(/^[a-z]/g, e => e.toUpperCase());
}

const c = fs.readFileSync(p.ide.workbenchFile + '.bak', 'utf8');
const editorProps = new Set();
const filesProps = new Set();
const workbenchProps = new Set();

const re = /['"](editor|files|workbench)\.([a-zA-Z0-9.]+)['"]/g;
let match;
while ((match = re.exec(c)) !== null) {
  const prefix = match[1];
  const prop = match[2];
  if (prefix === 'editor') editorProps.add(NLa(prop));
  else if (prefix === 'files') filesProps.add(NLa(prop));
  else if (prefix === 'workbench') workbenchProps.add(NLa(prop));
}

console.log('Unique Editor Labels:', editorProps.size);
console.log('Unique Files Labels:', filesProps.size);
console.log('Unique Workbench Labels:', workbenchProps.size);

fs.writeFileSync(
  path.join(__dirname, 'editor_labels.json'),
  JSON.stringify(Array.from(editorProps).sort(), null, 2),
  'utf8'
);
console.log('Saved to scripts/editor_labels.json');
