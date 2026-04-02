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

REM if not exist output_rgba mkdir output_rgba
REM if not exist output_white mkdir output_white

echo [BAT] Processando: %INPUT_FILE%

%PY% run\Inference.py ^
  --config configs\extra_dataset\Plus_Ultra.yaml ^
  --source "%INPUT_FILE%" ^
  --dest output ^
  --type rgba

if %errorlevel% neq 0 (
  echo ERRO no Inference.py
  exit /b %errorlevel%
)

REM %PY% converter_branco.py

REM if %errorlevel% neq 0 (
REM   echo ERRO no converter_branco.py
REM   exit /b %errorlevel%
REM )

echo [BAT] Finalizado com sucesso
exit /b 0