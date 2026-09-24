const fs = require('fs');
const path = require('path');

function search(d, depth = 0) {
  if (depth > 5) return;
  try {
    for (const f of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, f.name);
      if (f.isDirectory()) {
        if (!['node_modules', '.git', 'Cache', 'Code Cache', 'GPUCache', 'logs'].includes(f.name)) {
          search(full, depth + 1);
        }
      } else if (f.name.endsWith('.json') || f.name.endsWith('.js')) {
        try {
          const c = fs.readFileSync(full, 'utf8');
          if (c.includes('Claude Code') || c.includes('claude-code')) {
            console.log('Found Claude in:', full);
          }
        } catch (e) {}
      }
    }
  } catch (e) {}
}

console.log('Searching in .vscode...');
search('C:\\Users\\Work-D\\.vscode');

console.log('Searching in .antigravity...');
search('C:\\Users\\Work-D\\.antigravity');

console.log('Searching in extensions dirs...');
search('C:\\Users\\Work-D\\.antigravity-ide');
search('C:\\Users\\Work-D\\.cursor');
search('C:\\Users\\Work-D\\.claude');
search('C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app');
