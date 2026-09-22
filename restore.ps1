# Antigravity Türkçe Ayarları Geri Alma / Kaldırma Betiği
[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   Antigravity Orijinal Ayarlara Geri Dönüş (Restore)" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$nodePath = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodePath) {
    Write-Host "[HATA] Sistemde Node.js kurulu değil." -ForegroundColor Red
    exit 1
}

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "[*] Geri alma işlemi başlatılıyor..." -ForegroundColor Yellow
node "$ScriptDir\bin\antigravity-tr.js" restore

Write-Host ""
Write-Host "[✓] Orijinal ayarlara başarıyla dönüldü!" -ForegroundColor Green
Write-Host "[!] Değişikliklerin geçerli olması için Antigravity / Antigravity IDE'yi yeniden başlatın." -ForegroundColor Yellow
