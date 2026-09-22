const fs = require('fs');
const path = require('path');
const { categories, settings } = require('../src/settings_dictionary');

const trPath = path.join(__dirname, '..', 'locales', 'tr.json');
const trData = JSON.parse(fs.readFileSync(trPath, 'utf8'));

// 1. nlsMessages'e index 4199 ("Hızlı Aç") ekle
const nlsList = trData.rules.nlsMessages || [];
if (!nlsList.some(r => r.index === 4199)) {
  nlsList.push({ index: 4199, replace: 'Hızlı Aç' });
}
trData.rules.nlsMessages = nlsList;

// 2. gDe kuralını temiz sözlük ile güncelle
const catStr = JSON.stringify(categories);
const setStr = JSON.stringify(settings);

const gDeReplace = `const s=NLa(t);const _cat=${catStr};const _tr=${setStr};const cat=r.split(' \\u203A ').map(seg=>_cat[seg]||seg).join(' \\u203A ');const lab=_tr[s]||_tr[s.replace(/ \\u203A /g,': ')]||_tr[t]||s;return{category:cat,label:lab}`;

const wbRules = trData.rules.workbench || [];
const gDeRule = wbRules.find(r => r.search === 'const s=NLa(t);return{category:r,label:s}');
if (gDeRule) {
  gDeRule.replace = gDeReplace;
} else {
  wbRules.push({
    search: 'const s=NLa(t);return{category:r,label:s}',
    replace: gDeReplace
  });
}
trData.rules.workbench = wbRules;

fs.writeFileSync(trPath, JSON.stringify(trData, null, 2), 'utf8');
console.log('Successfully updated locales/tr.json with clean settings dictionary and NLS 4199!');
