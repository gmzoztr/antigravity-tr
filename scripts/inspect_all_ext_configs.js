const fs = require('fs');
const path = require('path');

const dirs = [
  'C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions',
  'C:\\Users\\Work-D\\.antigravity-ide\\extensions',
  'C:\\Users\\Work-D\\.antigravity\\extensions'
];

const extConfigs = [];

for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) {
    const pkg = path.join(dir, f, 'package.json');
    if (fs.existsSync(pkg)) {
      try {
        const data = JSON.parse(fs.readFileSync(pkg, 'utf8'));
        const config = data.contributes?.configuration;
        if (config) {
          const title = config.title || data.displayName || data.name;
          const props = config.properties ? Object.keys(config.properties) : [];
          extConfigs.push({ id: f, title, propsCount: props.length, props: props.slice(0, 5) });
        }
      } catch (e) {}
    }
  }
}

console.log('Total extensions with settings:', extConfigs.length);
extConfigs.forEach(e => {
  console.log(`[${e.title}] (${e.id}) - ${e.propsCount} settings`);
  if (e.props.length) console.log('   Sample:', e.props.join(', '));
});
