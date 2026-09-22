const fs = require('fs');
const path = require('path');
const { getPaths } = require('../src/config');

const p = getPaths();

// 1. NLa simülasyonu (VS Code'un camelCase'i kelimelere bölen fonksiyonu)
function NLa(t) {
  return t
    .replace(/\.([a-z0-9])/g, (e, i) => ` \u203A ${i.toUpperCase()}`)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]{1,})([A-Z][a-z])/g, '$1 $2')
    .replace(/^[a-z]/g, e => e.toUpperCase());
}

// 2. Tüm ayar anahtarlarını topla
const keys = new Set();

// app extensions
const appExtDir = path.join(p.ide.appPath, 'resources', 'app', 'extensions');
if (fs.existsSync(appExtDir)) {
  for (const d of fs.readdirSync(appExtDir)) {
    const pj = path.join(appExtDir, d, 'package.json');
    if (fs.existsSync(pj)) {
      try {
        const data = JSON.parse(fs.readFileSync(pj, 'utf8'));
        const cfg = data.contributes && data.contributes.configuration;
        if (cfg) {
          const list = Array.isArray(cfg) ? cfg : [cfg];
          for (const c of list) {
            if (c.properties) {
              for (const k of Object.keys(c.properties)) keys.add(k);
            }
          }
        }
      } catch (e) {}
    }
  }
}

// user extensions
if (fs.existsSync(p.ide.extensionsDir)) {
  for (const d of fs.readdirSync(p.ide.extensionsDir)) {
    const pj = path.join(p.ide.extensionsDir, d, 'package.json');
    if (fs.existsSync(pj)) {
      try {
        const data = JSON.parse(fs.readFileSync(pj, 'utf8'));
        const cfg = data.contributes && data.contributes.configuration;
        if (cfg) {
          const list = Array.isArray(cfg) ? cfg : [cfg];
          for (const c of list) {
            if (c.properties) {
              for (const k of Object.keys(c.properties)) keys.add(k);
            }
          }
        }
      } catch (e) {}
    }
  }
}

// workbench içindeki çekirdek ayar anahtarları
const wbContent = fs.readFileSync(p.ide.workbenchFile + '.bak', 'utf8');
const wbMatches = wbContent.match(/["'](editor|workbench|files|window|terminal|explorer|search|git)\.[a-zA-Z0-9.]+["']/g) || [];
for (const m of wbMatches) {
  keys.add(m.slice(1, -1));
}

console.log('Total unique setting keys collected:', keys.size);

// Her ayar anahtarı için gDe'nin ürettiği label'ı bul
const labels = new Map();
for (const key of keys) {
  const lastDot = key.lastIndexOf('.');
  const prop = lastDot >= 0 ? key.substring(lastDot + 1) : key;
  const label = NLa(prop);
  labels.set(label, key);
}

console.log('Total unique setting labels:', labels.size);
console.log('Sample labels:', Array.from(labels.keys()).slice(0, 30));
