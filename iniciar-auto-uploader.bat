@echo off
title Rocket League Tracker - Auto Uploader
cd /d "%~dp0"
echo ==================================================
echo   INICIANDO AUTO UPLOADER DO ROCKET LEAGUE TRACKER
echo ==================================================
node scripts/uploader.mjs
pause
