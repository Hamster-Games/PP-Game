@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  if exist "%ProgramFiles%\nodejs\node.exe" (
    set "PATH=%ProgramFiles%\nodejs;%PATH%"
  ) else (
    echo Node.js 18 oder neuer ist nicht installiert oder nicht im PATH.
    pause
    exit /b 1
  )
)

if not exist ".env" (
  copy ".env.example" ".env" >nul
  echo .env wurde erstellt. Trage dort PUBLIC_HOST ein und starte start.bat erneut.
  pause
  exit /b 0
)
if not exist "node_modules\peer" goto install_dependencies
if not exist "node_modules\peerjs" goto install_dependencies
if not exist "..\vendor\peerjs.min.js" goto install_dependencies
goto start_server

:install_dependencies
echo Installiere Server- und PeerJS-Abhaengigkeiten ...
call npm install
if errorlevel 1 (
  echo Die Abhaengigkeiten konnten nicht installiert werden.
  pause
  exit /b 1
)

:start_server
call npm start
pause
