@echo off
cd /d "%~dp0"

echo Testando Kornia...
%1 -c "import kornia; print('kornia OK')"

IF %ERRORLEVEL% NEQ 0 (
 echo ERRO: Kornia nao instalado
 exit /b 1
)

echo Rodando Inference...

%1 run\Inference.py ^
 --config configs\extra_dataset\Plus_Ultra.yaml ^
 --source Removedor-de-Fundo\input ^
 --dest Removedor-de-Fundo\output ^
 --type rgba

IF %ERRORLEVEL% NEQ 0 (
 echo ERRO na inferencia
 exit /b 1
)

echo Finalizado
exit /b 0