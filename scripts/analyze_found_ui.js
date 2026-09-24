const fs = require('fs');
const path = require('path');

const appPath = 'C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app';

console.log('=== BULUNAN METİNLERİN DETAYLI ANALİZİ ===\n');

// 1. nls.messages.json içindeki indeksleri bulalım
const nls = JSON.parse(fs.readFileSync(path.join(appPath, 'out', 'nls.messages.json'), 'utf8'));

nls.forEach((msg, idx) => {
  if (msg.includes('To customize Run and Debug')) {
    console.log(`[NLS ${idx}] "${msg}"`);
  }
  if (msg.includes('There is no data provider registered')) {
    console.log(`[NLS ${idx}] "${msg}"`);
  }
  if (msg.includes('Send Terminal to Chat')) {
    console.log(`[NLS ${idx}] "${msg}"`);
  }
});

// 2. workbench.desktop.main.js.bak içindeki bağlamları bulalım
const bench = fs.readFileSync(path.join(appPath, 'out', 'vs', 'workbench', 'workbench.desktop.main.js.bak'), 'utf8');

function showContext(str, name) {
  let idx = 0;
  while ((idx = bench.indexOf(str, idx)) !== -1) {
    console.log(`\n[Workbench: ${name} @ ${idx}]:`);
    console.log(bench.slice(Math.max(0, idx - 80), idx + str.length + 80));
    idx += str.length;
  }
}

showContext('Customize Agent to get a better', 'Customizations Açıklaması');
showContext('Rules help guide the behavior', 'Kurallar Açıklaması');
showContext('Workflows are saved prompts', 'İş Akışları Açıklaması');
showContext('Send Terminal to Chat', 'Terminal Gönder Tooltip');

// 3. antigravity-remote-wsl içindeki 'default distro'
const wslPath = path.join(appPath, 'extensions', 'antigravity-remote-wsl', 'dist', 'extension.js');
if (fs.existsSync(wslPath)) {
  const wsl = fs.readFileSync(wslPath, 'utf8');
  let idx = 0;
  while ((idx = wsl.indexOf('default distro', idx)) !== -1) {
    console.log(`\n[WSL Extension @ ${idx}]:`);
    console.log(wsl.slice(Math.max(0, idx - 40), idx + 'default distro'.length + 40));
    idx += 'default distro'.length;
  }
}
