const fs = require('fs');
const path = require('path');
const { getPaths } = require('../src/config');

const query = process.argv[2] || 'Quick Open';
const p = getPaths();

function searchDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', '.git', 'Code Cache', 'CachedData'].includes(entry.name)) {
        searchDir(fullPath);
      }
    } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.json') || entry.name.endsWith('.html'))) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        let idx = 0;
        let count = 0;
        while ((idx = content.indexOf(query, idx)) !== -1) {
          console.log(`[FOUND] ${fullPath} (idx: ${idx})`);
          console.log(`   Snippet: ${content.substring(Math.max(0, idx - 40), Math.min(content.length, idx + query.length + 40)).replace(/\n/g, ' ')}`);
          idx += query.length + 1;
          count++;
          if (count > 5) break;
        }
      } catch (e) {}
    }
  }
}

console.log(`Searching for "${query}" in resources/app...`);
searchDir(path.join(p.ide.appPath, 'resources', 'app'));
