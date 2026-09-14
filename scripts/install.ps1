$root = Split-Path -Parent $PSScriptRoot
$steam = (Get-ItemProperty "HKCU:\Software\Valve\Steam").SteamPath -replace '/', '\'
$target = Join-Path $steam "millennium\plugins\RelationshipNotifier"

node (Join-Path $root "scripts\build.mjs")
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

New-Item -ItemType Directory -Force $target | Out-Null
Copy-Item -Recurse -Force (Join-Path $root "plugin.json"), (Join-Path $root "backend"), (Join-Path $root ".millennium") $target

Write-Host "Installed to $target"
Write-Host "Restart Steam to load the changes."
