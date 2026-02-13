set BASE_DIR=%~dp0
@echo off
setlocal EnableDelayedExpansion

echo ============================
echo PIXEL FORCE 4X - MODO ILUSTRACAO
echo Modelo: realesrgan-x4plus-anime
echo ============================

echo Limpando input (antes)...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0separar_tratadas.ps1"

echo.

REM ===== Contar quantas realmente vao ser processadas =====
for /f %%A in ('powershell -NoProfile -Command "(Get-ChildItem -Path \"%BASE_DIR%input\" -File).Count"') do set TOTAL_PROCESSAR=%%A

echo Total a processar: %TOTAL_PROCESSAR%

REM ===== Registrar horario inicial =====
for /f %%A in ('powershell -NoProfile -Command "Get-Date -Format o"') do set START_TIME=%%A

echo.
echo Iniciando processamento (Ilustracao/Desenhos)...
cd /d "%~dp0engine"

realesrgan-ncnn-vulkan.exe ^
 -i "%~dp0input" ^
 -o "%~dp0output" ^
 -s 4 ^
 -t 128 ^
 -n realesrgan-x4plus-anime ^
 > "%~dp0logs\log_anime.txt" 2>&1

echo.
echo Limpando input (depois)...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0separar_tratadas.ps1"

REM ===== Registrar horario final =====
for /f %%A in ('powershell -NoProfile -Command "Get-Date -Format o"') do set END_TIME=%%A

echo.
echo Calculando estatisticas...
echo.

powershell -NoProfile -Command ^
"$start = [datetime]::Parse('%START_TIME%'); ^
 $end = [datetime]::Parse('%END_TIME%'); ^
 $diff = $end - $start; ^
 $total = %TOTAL_PROCESSAR%; ^
 if ($total -gt 0) { ^
    $media = [math]::Round($diff.TotalSeconds / $total, 1); ^
 } else { ^
    $media = 0; ^
 } ^
 Write-Host ('Tempo total: ' + $diff.ToString('hh\:mm\:ss')); ^
 Write-Host ('Total processadas: ' + $total); ^
 Write-Host ('Media por imagem: ' + $media + ' segundos')"

echo.
echo FINALIZADO - MODO ILUSTRACAO
pause
