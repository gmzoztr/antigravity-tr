# Antigravity Türkçe Otomatik Kurulum Betiği (antigravity-tr)
[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   Antigravity Türkçe Dil Paketi ve Yama Aracı (antigravity-tr)" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Node.js kontrolü
$nodePath = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodePath) {
    Write-Host "[HATA] Sistemde Node.js kurulu değil. Lütfen önce Node.js yükleyin: https://nodejs.org/" -ForegroundColor Red
    exit 1
}

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Eğer script doğrudan GitHub'dan çekilip web üzerinden çalıştırıldıysa geçici dizinde çalıştır
if (-not $ScriptDir -or -not (Test-Path "$ScriptDir\src\installer.js")) {
    $TempDir = Join-Path $env:TEMP "antigravity-tr"
    if (Test-Path $TempDir) { Remove-Item -Path $TempDir -Recurse -Force }
    Write-Host "[*] Kaynak dosyalar GitHub üzerinden indiriliyor..." -ForegroundColor Yellow
    git clone --depth 1 https://github.com/gmzoztr/antigravity-tr.git $TempDir
    $ScriptDir = $TempDir
}

Write-Host "[*] Kurulum motoru başlatılıyor..." -ForegroundColor Green
node "$ScriptDir\bin\antigravity-tr.js" install

Write-Host ""
Write-Host "[✓] Kurulum başarıyla tamamlandı!" -ForegroundColor Green
Write-Host "[!] Lütfen değişikliklerin geçerli olması için Antigravity / Antigravity IDE'yi yeniden başlatın." -ForegroundColor Yellow
