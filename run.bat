@echo off
setlocal


echo ============================
echo REAL-ESRGAN BATCH UPSCALE 4X
echo ============================


cd /d "%~dp0engine"

realesrgan-ncnn-vulkan.exe -i "%~dp0input" -o "%~dp0output" -s 4 -t 256 -n realesrgan-x4plus > "%~dp0logs\log.txt" 2>&1

echo.
echo FINALIZADO! Verifique a pasta "output".
pause
