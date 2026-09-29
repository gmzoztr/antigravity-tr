const path = require('node:path');
const vm = require('node:vm');
const { rewriteArchive } = require('./desktop_archive');

const brokenGuard = 'if (dictionary[trimmed]) {';
const fixedGuard = 'if (Object.prototype.hasOwnProperty.call(dictionary, trimmed) && dictionary[trimmed] !== trimmed) {';

function repairTranslator(source) {
  if (!source.includes('ANTIGRAVITY DESKTOP TÜRKÇE CANLI ARAYÜZ ÇEVİRMENİ')) {
    throw new Error('Bilinen Türkçe çeviri katmanı bulunamadı; dosya değiştirilmedi.');
  }
  if (!source.includes(brokenGuard) && !source.includes(fixedGuard)) {
    throw new Error('Çeviri katmanı beklenen sürümde değil; dosya değiştirilmedi.');
  }
  const result = source.replaceAll(brokenGuard, fixedGuard);
  new vm.Script(result, { filename: 'preload.js' });
  return result;
}

async function repairDesktopApp(paths) {
  const asar = await import('@electron/asar');
  const archive = path.join(paths.desktop.appPath, 'resources', 'app.asar');
  asar.uncacheAll();
  const original = asar.extractFile(archive, 'dist/preload.js').toString('utf8');
  const fixed = repairTranslator(original);
  if (original === fixed) return { success: true, changedFiles: [], message: 'Düzeltme zaten uygulanmış.' };
  return rewriteArchive(archive, new Map([['dist/preload.js', Buffer.from(fixed)]]));
}

module.exports = { repairTranslator, repairDesktopApp };
