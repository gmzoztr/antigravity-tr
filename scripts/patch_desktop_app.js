/**
 * Antigravity Desktop Yama Scripti (Kalıcı ve Modüler)
 */

const { getPaths } = require('../src/config');
const { patchDesktopApp } = require('../src/desktop_patcher');

const paths = getPaths();
console.log('Antigravity Desktop yamalanıyor...');
const res = patchDesktopApp(paths);
if (res.success) {
  console.log('[✓] Antigravity Desktop (app.asar) başarıyla yamalandı!');
} else {
  console.error('[✗] Hata:', res.reason);
}
