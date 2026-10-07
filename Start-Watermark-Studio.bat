@echo off
title Bulk Watermark Studio
cd /d "%~dp0"
echo ===================================================
echo Starting Bulk Watermark Studio (Local)
echo ===================================================
echo Opening http://localhost:3000 in your browser...
start http://localhost:3000
npm start
pause
