const path = require('node:path');
const { execFileSync } = require('node:child_process');

function assertStopped(paths, includeIde = false) {
  if (process.platform !== 'win32') throw new Error('Bu sürüm yalnızca Windows üzerinde doğrulandı.');
  const targets = [path.join(paths.desktop.appPath, 'Antigravity.exe')];
  if (includeIde) targets.push(path.join(paths.ide.appPath, 'Antigravity.exe'), path.join(paths.ide.appPath, 'Antigravity IDE.exe'));
  const script = '$paths = $env:ANTIGRAVITY_TR_TARGETS | ConvertFrom-Json; $running = Get-CimInstance Win32_Process -ErrorAction Stop | Where-Object { $_.ExecutablePath -and ($paths -contains $_.ExecutablePath) }; if ($running) { exit 9 }';
  try {
    execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', script], {
      env: { ...process.env, ANTIGRAVITY_TR_TARGETS: JSON.stringify(targets) }, windowsHide: true, stdio: 'pipe'
    });
  } catch (error) {
    if (error.status === 9) throw new Error('Yamayı uygulamadan önce Antigravity pencerelerini kapatın.');
    throw new Error('Çalışan uygulamalar denetlenemedi; hiçbir değişiklik yapılmadı.');
  }
}
module.exports = { assertStopped };
