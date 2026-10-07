@echo off
title Markaan by Ahsan Raza
cd /d "%~dp0"
echo ========================================================
echo        Markaan by Ahsan Raza - Bulk Watermark Studio
echo ========================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not detected on your system.
    echo.
    echo Markaan requires Node.js to run locally on your computer.
    echo Please download and install the free Node.js (LTS version) from:
    echo   https://nodejs.org/
    echo.
    echo After installing, restart this file.
    echo.
    pause
    exit /b 1
)

if not exist node_modules (
    echo First-time setup detected. Installing dependencies...
    echo (This only takes a minute)...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies. Please check your internet connection for the initial install.
        pause
        exit /b 1
    )
)

if not exist .next (
    echo Building application for high-speed local processing...
    call npm run build
    if %errorlevel% neq 0 (
        echo [ERROR] Build failed. Trying dev server fallback...
        start http://localhost:3000
        call npm run dev
        pause
        exit /b 1
    )
)

echo.
echo Starting Markaan...
echo Opening http://localhost:3000 in your browser...
echo.
start http://localhost:3000
npm start
if %errorlevel% neq 0 (
    echo Production server stopped. Falling back to development server...
    npm run dev
)
pause
