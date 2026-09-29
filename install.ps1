# Antigravity Türkçe kurulum yardımcısı. Kaynak klasöründen çalıştırın.
[CmdletBinding()]
param([ValidateSet('desktop','full','repair')][string]$Target = 'desktop')
$ErrorActionPreference = 'Stop'
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw 'Node.js 22.12 veya üstü gerekiyor.' }
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { throw 'npm bulunamadı.' }
Push-Location -LiteralPath $PSScriptRoot
try {
    & npm ci --omit=dev --ignore-scripts
    if ($LASTEXITCODE -ne 0) { throw 'Bağımlılıklar kurulamadı.' }
    $taskCommand = switch ($Target) { 'full' { 'install' } 'repair' { 'repair-desktop' } default { 'install-desktop' } }
    & node (Join-Path $PSScriptRoot 'bin\antigravity-tr.js') $taskCommand
    if ($LASTEXITCODE -ne 0) { throw 'Yama tamamlanamadı. Yukarıdaki hata mesajını inceleyin.' }
    Write-Host 'Yama tamamlandı. Antigravity uygulamasını açabilirsiniz.' -ForegroundColor Green
} finally { Pop-Location }
