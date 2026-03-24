@echo off
cd /d "%~dp0"

set PY=C:\Users\theed.ribeiro\Documents\Projeto-Hackathon\Real-ESRGAN-Projeto\.venv\Scripts\python.exe

REM %1 = caminho do arquivo de entrada
set INPUT_FILE=%1

if "%INPUT_FILE%"=="" (
  echo ERRO: arquivo nao informado
  exit /b 1
)

if not exist "%INPUT_FILE%" (
  echo ERRO: arquivo nao encontrado: %INPUT_FILE%
  exit /b 1
)

if not exist output_rgba mkdir output_rgba
if not exist output_white mkdir output_white

echo [BAT] Processando: %INPUT_FILE%

%PY% run\Inference.py ^
  --config configs\extra_dataset\Plus_Ultra.yaml ^
  --source "%INPUT_FILE%" ^
  --dest output_rgba ^
  --type rgba

if %errorlevel% neq 0 (
  echo ERRO no Inference.py
  exit /b %errorlevel%
)

%PY% converter_branco.py

if %errorlevel% neq 0 (
  echo ERRO no converter_branco.py
  exit /b %errorlevel%
)

echo [BAT] Finalizado com sucesso
exit /b 0