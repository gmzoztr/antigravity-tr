const fs = require('fs');
const path = require('path');
const { getPaths } = require('./config');

/**
 * Antigravity bundle dosyalarındaki kullanıcıya dönük arayüz metinlerini otomatik tarar.
 */
function scanUiStrings() {
  const paths = getPaths();
  const jetskiPath = paths.ide.jetskiFile;

  if (!fs.existsSync(jetskiPath)) {
    console.log(`[HATA] jetskiAgent dosyası bulunamadı: ${jetskiPath}`);
    return [];
  }

  const content = fs.readFileSync(jetskiPath, 'utf8');
  const patterns = [
    /placeholder:\s*"([A-Z][a-zA-Z0-9\s.,?!'()-]{2,80})"/g,
    /title:\s*"([A-Z][a-zA-Z0-9\s.,?!'()-]{2,80})"/g,
    /ariaLabel:\s*"([A-Z][a-zA-Z0-9\s.,?!'()-]{2,80})"/g,
    /tooltip:\s*"([A-Z][a-zA-Z0-9\s.,?!'()-]{2,80})"/g,
    /children:\s*"([A-Z][a-zA-Z0-9\s.,?!'()-]{2,80})"/g
  ];

  const found = new Set();
  for (const p of patterns) {
    let m;
    while ((m = p.exec(content)) !== null) {
      const s = m[1].trim();
      if (!s.includes('http') && !s.includes('/') && !s.includes('{') && s.length > 2) {
        found.add(s);
      }
    }
  }

  return Array.from(found).sort();
}

module.exports = {
  scanUiStrings
};
