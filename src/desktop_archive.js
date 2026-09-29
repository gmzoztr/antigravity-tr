// Rebuild an archive without changing unrelated files or unpacked-file flags.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { Readable } = require('node:stream');

async function rewriteArchive(archivePath, replacements) {
  const asar = await import('@electron/asar');
  asar.uncacheAll();
  const names = asar.listPackage(archivePath).map(name => name.replaceAll('\\', '/').replace(/^\//, ''));
  for (const name of replacements.keys()) {
    if (!names.includes(name)) throw new Error(`Arşivde dosya bulunamadı: ${name}`);
  }
  const streams = names.map(name => {
    const entry = asar.statFile(archivePath, path.normalize(name), false);
    if ('files' in entry) return { type: 'directory', path: name, unpacked: !!entry.unpacked };
    if ('link' in entry) throw new Error('Bağlantı içeren arşiv bu sürümde desteklenmiyor.');
    if (entry.unpacked && replacements.has(name)) throw new Error(`Paket dışı dosya değişikliği desteklenmiyor: ${name}`);
    const bytes = replacements.get(name) || asar.extractFile(archivePath, path.normalize(name));
    return { type: 'file', path: name, unpacked: !!entry.unpacked,
      stat: { size: bytes.length, mode: entry.executable ? 0o755 : 0o644 },
      streamGenerator: () => Readable.from([bytes]) };
  });
  const temporary = fs.mkdtempSync(path.join(path.dirname(archivePath), '.antigravity-tr-'));
  const candidate = path.join(temporary, 'app.asar');
  let backup;
  try {
    await asar.createPackageFromStreams(candidate, streams);
    asar.uncacheAll();
    for (const name of names) {
      const original = asar.statFile(archivePath, path.normalize(name), false);
      const next = asar.statFile(candidate, path.normalize(name), false);
      if (!!original.unpacked !== !!next.unpacked) throw new Error(`Paket türü değişti: ${name}`);
      if ('files' in original) continue;
      const expected = replacements.get(name) || asar.extractFile(archivePath, path.normalize(name));
      if (!expected.equals(asar.extractFile(candidate, path.normalize(name)))) throw new Error(`Doğrulama başarısız: ${name}`);
    }
    backup = `${archivePath}.backup-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    fs.copyFileSync(archivePath, backup, fs.constants.COPYFILE_EXCL);
    if (streams.some(s => s.unpacked)) {
      fs.cpSync(`${archivePath}.unpacked`, `${backup}.unpacked`, { recursive: true, errorOnExist: true });
    }
    // Unpacked contents are identical and remain at their existing location.
    fs.renameSync(candidate, archivePath);
    asar.uncacheAll();
    return { success: true, backup, changedFiles: [...replacements.keys()] };
  } finally {
    // Only the unique directory allocated by this invocation is removed.
    fs.rmSync(temporary, { recursive: true, force: true });
  }
}

async function restoreArchive(archivePath, backupPath) {
  const asar = await import('@electron/asar');
  asar.uncacheAll();
  const readVersion = file => JSON.parse(asar.extractFile(file, 'package.json').toString()).version;
  if (readVersion(archivePath) !== readVersion(backupPath)) throw new Error('Yedek ve kurulu uygulamanın sürümleri farklı; geri alma durduruldu.');
  const temp = fs.mkdtempSync(path.join(path.dirname(archivePath), '.antigravity-tr-restore-'));
  try {
    const staged = path.join(temp, 'app.asar');
    fs.copyFileSync(backupPath, staged);
    const names = asar.listPackage(backupPath).map(n => n.replaceAll('\\', '/').replace(/^\//, ''));
    for (const name of names) {
      const entry = asar.statFile(backupPath, path.normalize(name), false);
      if ('files' in entry) continue;
      if ('link' in entry) throw new Error('Bağlantı içeren yedek desteklenmiyor.');
      if (entry.unpacked) {
        const current = fs.readFileSync(path.join(archivePath + '.unpacked', name));
        const separate = path.join(backupPath + '.unpacked', name);
        const expectedHash = entry.integrity?.hash;
        if (fs.existsSync(separate)) {
          if (!current.equals(fs.readFileSync(separate))) throw new Error(`Paket dışı dosya farklı: ${name}`);
        } else if (!expectedHash || crypto.createHash('sha256').update(current).digest('hex') !== expectedHash) {
          throw new Error(`Paket dışı yedek doğrulanamadı: ${name}`);
        }
      } else {
        const bytes = asar.extractFile(backupPath, path.normalize(name));
        if (entry.integrity?.hash && crypto.createHash('sha256').update(bytes).digest('hex') !== entry.integrity.hash) throw new Error(`Yedek bütünlüğü bozuk: ${name}`);
      }
    }
    const saved = `${archivePath}.backup-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    fs.copyFileSync(archivePath, saved, fs.constants.COPYFILE_EXCL);
    if (fs.existsSync(archivePath + '.unpacked')) fs.cpSync(archivePath + '.unpacked', saved + '.unpacked', { recursive: true });
    fs.renameSync(staged, archivePath);
    asar.uncacheAll();
    return { restored: true, backup: saved, restoredFrom: backupPath };
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
}

module.exports = { rewriteArchive, restoreArchive };
