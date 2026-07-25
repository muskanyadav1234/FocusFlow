@echo off
setlocal

title FocusFlow Local Server

echo.
echo ========================================
echo   FocusFlow - Local Development Server
echo ========================================
echo.

if not exist package.json (
  echo package.json was not found in this folder.
  echo.
  echo Please open the real FocusFlow project folder in VS Code.
  echo It must contain: package.json, src, vite.config.ts
  echo.
  pause
  exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or not available in PATH.
  echo Install Node.js LTS from https://nodejs.org/ and run this file again.
  echo.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm is not installed or not available in PATH.
  echo Reinstall Node.js LTS from https://nodejs.org/ and run this file again.
  echo.
  pause
  exit /b 1
)

echo Installing dependencies...
call npm install
if errorlevel 1 (
  echo.
  echo npm install failed. Please check the error above.
  pause
  exit /b 1
)

echo.
echo Starting FocusFlow...
echo Open the local URL shown below in your browser.
echo.
call npm run dev

pause
