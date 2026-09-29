[CmdletBinding()]
param([ValidateSet('desktop','full')][string]$Target = 'desktop', [string]$Backup)
$ErrorActionPreference = 'Stop'
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw 'Node.js 22.12 veya üstü gerekiyor.' }
$taskCommand = if ($Target -eq 'full') { 'restore' } else { 'restore-desktop' }
$taskArgs = @((Join-Path $PSScriptRoot 'bin\antigravity-tr.js'), $taskCommand)
if ($Backup) {
    if ($Target -ne 'desktop') { throw 'Belirli yedek yalnızca Desktop geri alma için kullanılabilir.' }
    $taskArgs += $Backup
}
& node @taskArgs
if ($LASTEXITCODE -ne 0) { throw 'Geri alma tamamlanamadı.' }
Write-Host 'Geri alma tamamlandı. Antigravity uygulamasını açabilirsiniz.' -ForegroundColor Green
