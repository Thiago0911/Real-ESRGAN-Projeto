@echo off
cd /d "%~dp0"

"C:\Users\thiago.fonseca\.venv\Scripts\python.exe" -c "import kornia; print('kornia OK')"
"C:\Users\thiago.fonseca\.venv\Scripts\python.exe" run\Inference.py --config configs\extra_dataset\Plus_Ultra.yaml --source input --dest output --type rgba

pause