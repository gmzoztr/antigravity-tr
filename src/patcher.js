const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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
 * VS Code standart SHA256 base64 checksum formatını hesaplar.
 */
function computeChecksum(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('base64').replace(/=+$/, '');
}

/**
 * product.json dosyasındaki checksums alanını günceller.
 * Bu sayede VS Code 'yüklemeniz bozuk gibi görünüyor' uyarısı vermez.
 */
function updateProductChecksums(paths) {
  if (!paths.ide || !paths.ide.productFile || !fs.existsSync(paths.ide.productFile)) {
    return { success: false, reason: 'product.json bulunamadı.' };
  }

  ensureBackup(paths.ide.productFile);

  const prod = JSON.parse(fs.readFileSync(paths.ide.productFile, 'utf8'));
  if (!prod.checksums) {
    return { success: true, message: 'checksums alanı bulunamadı.' };
  }

  const baseOut = path.join(paths.ide.appPath, 'resources', 'app', 'out');
  let updatedCount = 0;

  for (const relPath of Object.keys(prod.checksums)) {
    const fullPath = path.join(baseOut, relPath);
    if (fs.existsSync(fullPath)) {
      const actualChecksum = computeChecksum(fullPath);
      if (actualChecksum && prod.checksums[relPath] !== actualChecksum) {
        prod.checksums[relPath] = actualChecksum;
        updatedCount++;
      }
    }
  }

  if (updatedCount > 0) {
    fs.writeFileSync(paths.ide.productFile, JSON.stringify(prod, null, '\t') + '\n', 'utf8');
    return { success: true, updated: true, count: updatedCount };
  }

  return { success: true, updated: false, count: 0 };
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
 * nls.messages.json dosyasını doğrudan indekslerle günceller.
 */
function patchNlsFile(filePath, nlsRules) {
  if (!fs.existsSync(filePath)) {
    return { success: false, reason: `Dosya bulunamadı: ${filePath}` };
  }

  const backupResult = ensureBackup(filePath);
  const msgs = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let matchCount = 0;

  for (const rule of nlsRules) {
    const { index, replace } = rule;
    if (index >= 0 && index < msgs.length && msgs[index] !== replace) {
      msgs[index] = replace;
      matchCount++;
    }
  }

  if (matchCount > 0) {
    fs.writeFileSync(filePath, JSON.stringify(msgs), 'utf8');
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
    message: 'nls.messages zaten güncel.'
  };
}

/**
 * Tüm Antigravity bundle dosyalarını yamalar ve checksums doğrulamalarını günceller.
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

  // 3. nls.messages.json yaması (Hızlı Aç vb.)
  if (paths.ide && paths.ide.nlsFile && dictionary.rules.nlsMessages) {
    const res = patchNlsFile(paths.ide.nlsFile, dictionary.rules.nlsMessages);
    results.push({ target: 'nls.messages (Quick Open vb.)', file: paths.ide.nlsFile, ...res });
  }

  // 4. product.json checksums güncellemesi (Bozuk Yükleme Uyarısını Önler)
  const checksumRes = updateProductChecksums(paths);
  results.push({ target: 'product.json Checksums Doğrulaması', ...checksumRes });

  return results;
}

/**
 * Tüm Antigravity bundle dosyalarını ve product.json dosyasını geri yükler.
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

  if (paths.ide && paths.ide.nlsFile) {
    const res = restoreFile(paths.ide.nlsFile);
    results.push({ target: 'nls.messages', file: paths.ide.nlsFile, ...res });
  }

  if (paths.ide && paths.ide.productFile) {
    const res = restoreFile(paths.ide.productFile);
    results.push({ target: 'product.json', file: paths.ide.productFile, ...res });
  }

  return results;
}

module.exports = {
  patchFile,
  patchNlsFile,
  restoreFile,
  computeChecksum,
  updateProductChecksums,
  applyAllPatches,
  restoreAllPatches
};
