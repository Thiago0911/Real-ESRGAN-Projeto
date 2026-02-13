Write-Host "============================"
Write-Host "PIXEL FORCE 4X"
Write-Host "============================"
Write-Host "Separando imagens ja tratadas (verificando ja processadas)..."
Write-Host ""

$base = Split-Path -Parent $MyInvocation.MyCommand.Path

$input = Join-Path $base "input"
$output = Join-Path $base "output"
$tratadas = Join-Path $base "tratadas"

if (!(Test-Path $tratadas)) {
    New-Item -ItemType Directory -Path $tratadas | Out-Null
}

$outputNames = Get-ChildItem $output -File | ForEach-Object {
    [System.IO.Path]::GetFileNameWithoutExtension($_.Name)
}

Get-ChildItem $input -File | ForEach-Object {
    $name = [System.IO.Path]::GetFileNameWithoutExtension($_.Name)
    if ($outputNames -contains $name) {
        Move-Item $_.FullName $tratadas
    }
}

Write-Host ""
Write-Host "Separacao concluida."
