const fs = require('fs');

const bench = fs.readFileSync('C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');

// Search for SettingsTreeModel or settings tree creation
const idx = bench.indexOf('createSettingsTreeModel');
console.log('createSettingsTreeModel:', idx);

// Search for TOC nodes
const tocIdx = bench.indexOf('tocNodes');
console.log('tocNodes:', tocIdx);

const settingsIdx = bench.indexOf('SettingsTree');
console.log('SettingsTree:', settingsIdx);
