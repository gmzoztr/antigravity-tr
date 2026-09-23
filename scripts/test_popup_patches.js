const fs = require('fs');
const path = require('path');
const { getPaths } = require('../src/config');

const p = getPaths();
const wbPath = p.ide.workbenchFile + '.bak';
const wbContent = fs.readFileSync(wbPath, 'utf8');

const checks = [
  't.CASCADE="Agent"',
  'label:"Auto Execution"',
  'label:"Review Policy"',
  '{label:"Agent Decides",value:c3.AUTO',
  'label:"Suggestions in Editor"',
  'label:"Tab Gitignore Access"',
  'label:"Tab Speed"',
  '{label:"Slow",value:nIe.SLOW},{label:"Fast"',
  'label:"Tab to Import"',
  'label:"Tab to Jump"',
  'label:"Open Command"',
  'label:"Open Agent"',
  'label:"AI Shortcuts"',
  'n.textContent="Customizations"',
  'r.textContent="Manage"',
  'n.textContent="Snooze"',
  'r.textContent=o?"Cancel":"Start"',
  'n.textContent="Advanced Settings"',
  'r.textContent=`View all ${this.productService.nameShort} shortcuts`',
  'name:p(4027,null)',
  'title:p(3308,null),icon:fe.search',
  'title:p(4199,null),icon:fe.search',
  'uses as a marketplace' // Open VSX
];

console.log('--- Checking workbench.desktop.main.js matches ---');
for (const str of checks) {
  if (str === 'uses as a marketplace') {
    const hasOpenVsx = wbContent.includes('uses `))') && wbContent.includes(' as a marketplace. This can be changed in ');
    console.log(`Open VSX Marketplace text: ${hasOpenVsx ? 'FOUND' : 'NOT FOUND'}`);
  } else {
    const count = wbContent.split(str).length - 1;
    console.log(`"${str}": count = ${count}`);
  }
}
