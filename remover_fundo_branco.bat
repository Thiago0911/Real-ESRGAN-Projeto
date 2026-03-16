@echo off
cd /d "%~dp0"

REM O primeiro argumento (%1) será o caminho completo para o python.exe
set PY=%1

if not exist output_rgba mkdir output_rgba
if not exist output_white mkdir output_white

%PY% run\Inference.py --config configs\extra_dataset\Plus_Ultra.yaml --source input --dest output_rgba --type rgba

%PY% converter_branco.py
