@echo off
setlocal

cd /d "%~dp0..\.."
if errorlevel 1 (
  echo ERROR: Could not move to the Fude repository root.
  exit /b 1
)

set "PYTHON_EXE=D:\MioTTS\python\cpython-3.12-windows-x86_64-none\python.exe"

if exist "%PYTHON_EXE%" (
  "%PYTHON_EXE%" scripts\audio\generate_audio.py %*
) else (
  py -3.12 scripts\audio\generate_audio.py %*
)

exit /b %ERRORLEVEL%
