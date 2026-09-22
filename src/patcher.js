const fs = require('fs');
const path = require('path');

/**
 * Dosya için .bak yedeği alır (eğer daha önce alınmamışsa).
 */
function ensureBackup(filePath) {
  const bakPath = filePath + '.bak';
  if (!fs.existsSync(bakPath)) {
    fs.copyFileSync(filePath, bakPath);
    return { created: true, path: bakPath };
  }
  return { created: false, path: bakPath };
}

/**
 * Dosyayı .bak yedeğinden geri yükler.
 */
function restoreFile(filePath) {
  const bakPath = filePath + '.bak';
  if (fs.existsSync(bakPath)) {
    fs.copyFileSync(bakPath, filePath);
    return { restored: true, path: filePath };
  }
  return { restored: false, reason: 'Yedek dosyası bulunamadı (.bak)' };
}

/**
 * Hedef bundle dosyasına kural listesini uygular.
 */
function patchFile(filePath, rules) {
  if (!fs.existsSync(filePath)) {
    return { success: false, reason: `Dosya bulunamadı: ${filePath}` };
  }

  // 1. Orijinal yedeği al
  const backupResult = ensureBackup(filePath);

  // 2. Dosya içeriğini oku
  let content = fs.readFileSync(filePath, 'utf8');
  let matchCount = 0;

  for (const rule of rules) {
    const { search, replace } = rule;
    if (content.includes(search)) {
      // Güvenli global değiştirme
      const parts = content.split(search);
      const occurrences = parts.length - 1;
      matchCount += occurrences;
      content = parts.join(replace);
    }
  }

  // 3. Değişiklik varsa dosyaya yaz
  if (matchCount > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    return {
      success: true,
      modified: true,
      matches: matchCount,
      backupCreated: backupResult.created
    };
  }

  return {
    success: true,
    modified: false,
    matches: 0,
    backupCreated: backupResult.created,
    message: 'Yamalanacak dize bulunamadı veya dosya zaten yamalı.'
  };
}

/**
 * Tüm Antigravity bundle dosyalarını yamalar.
 */
function applyAllPatches(paths, dictionary) {
  const results = [];

  // 1. jetskiAgent yaması
  if (paths.ide && paths.ide.jetskiFile && dictionary.rules.jetskiAgent) {
    const res = patchFile(paths.ide.jetskiFile, dictionary.rules.jetskiAgent);
    results.push({ target: 'jetskiAgent (Sohbet & AI Arayüzü)', file: paths.ide.jetskiFile, ...res });
  }

  // 2. workbench yaması
  if (paths.ide && paths.ide.workbenchFile && dictionary.rules.workbench) {
    const res = patchFile(paths.ide.workbenchFile, dictionary.rules.workbench);
    results.push({ target: 'workbench (Editör Arayüzü)', file: paths.ide.workbenchFile, ...res });
  }

  return results;
}

/**
 * Tüm Antigravity bundle dosyalarını geri yükler.
 */
function restoreAllPatches(paths) {
  const results = [];

  if (paths.ide && paths.ide.jetskiFile) {
    const res = restoreFile(paths.ide.jetskiFile);
    results.push({ target: 'jetskiAgent', file: paths.ide.jetskiFile, ...res });
  }

  if (paths.ide && paths.ide.workbenchFile) {
    const res = restoreFile(paths.ide.workbenchFile);
    results.push({ target: 'workbench', file: paths.ide.workbenchFile, ...res });
  }

  return results;
}

module.exports = {
  patchFile,
  restoreFile,
  applyAllPatches,
  restoreAllPatches
};
