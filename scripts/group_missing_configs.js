const fs = require('fs');

const missing = JSON.parse(fs.readFileSync('C:\\Users\\Work-D\\source\\antigravity-tr\\scripts\\missing_real_configs.json', 'utf8'));

const byDomain = {};
for (const item of missing) {
  const domain = item.key.split('.')[0];
  if (!byDomain[domain]) byDomain[domain] = [];
  byDomain[domain].push(item);
}

for (const [dom, items] of Object.entries(byDomain)) {
  console.log(`Domain: ${dom} (${items.length} items)`);
}
