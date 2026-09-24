const fs = require('fs');
const tr = JSON.parse(fs.readFileSync('C:\\Users\\Work-D\\source\\antigravity-tr\\locales\\tr.json', 'utf8'));

const r = tr.rules.workbench.find(x => x.replace && x.replace.includes('_cat'));
if (r) {
  console.log('Search:');
  console.log(r.search);
  console.log('\nReplace son kısmı (return):');
  const retIdx = r.replace.lastIndexOf('return');
  console.log(r.replace.slice(retIdx));
}
