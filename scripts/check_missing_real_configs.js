const fs = require('fs');
const dict = require('C:\\Users\\Work-D\\source\\antigravity-tr\\src\\settings_dictionary.js');

function NLa(t) {
  return t
    .replace(/\.([a-z0-9])/g, (e, i) => ` \u203A ${i.toUpperCase()}`)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]{1,})([A-Z][a-z])/g, '$1 $2')
    .replace(/^[a-z]/g, e => e.toUpperCase());
}

function simulateGde(key) {
  const n = key.lastIndexOf('.');
  let r = '';
  let leaf = key;
  if (n >= 0) {
    r = key.substring(0, n);
    leaf = key.substring(n + 1);
  }
  const rLabel = NLa(r);
  const sLabel = NLa(leaf);
  return { key, rLabel, sLabel, leaf };
}

const allConfigs = JSON.parse(fs.readFileSync('C:\\Users\\Work-D\\source\\antigravity-tr\\scripts\\all_real_config_properties.json', 'utf8'));

const missing = [];
const covered = [];

for (const key of allConfigs) {
  const { rLabel, sLabel } = simulateGde(key);
  // Check if sLabel or key is in dict.settings
  if (dict.settings[sLabel] || dict.settings[key]) {
    covered.push({ key, sLabel, tr: dict.settings[sLabel] || dict.settings[key] });
  } else {
    missing.push({ key, rLabel, sLabel });
  }
}

console.log('Total real configs:', allConfigs.length);
console.log('Covered by settings_dictionary:', covered.length);
console.log('Missing from settings_dictionary:', missing.length);

fs.writeFileSync('C:\\Users\\Work-D\\source\\antigravity-tr\\scripts\\missing_real_configs.json', JSON.stringify(missing, null, 2), 'utf8');
console.log('Saved missing_real_configs.json');
