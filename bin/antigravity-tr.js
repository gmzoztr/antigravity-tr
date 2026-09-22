#!/usr/bin/env node

const { install, uninstall } = require('../src/installer');

const args = process.argv.slice(2);
const command = args[0] || 'install';

if (command === 'install' || command === 'apply') {
  install();
} else if (command === 'uninstall' || command === 'restore' || command === 'revert') {
  uninstall();
} else {
  console.log(`
Kullanım:
  npx antigravity-tr [komut]

Komutlar:
  install, apply       Türkçe yerelleştirmeyi ve yamaları uygula (varsayılan)
  uninstall, restore   Orijinal dosyalara ve İngilizce ayarlara geri dön
  help                 Bu yardım mesajını göster
`);
}
