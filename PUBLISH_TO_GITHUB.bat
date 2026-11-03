@echo off
title BlueX Academy - 1-Click Publisher
color 0b
echo ========================================================
echo       BlueX Academy - Automatic GitHub Publisher
echo       Target: www.bluexacedamy.space & bluex.github.io
echo ========================================================
echo.

set "PATH=C:\Users\Asus ROG\AppData\Local\MinGit\cmd;C:\Users\Asus ROG\AppData\Local\gh-cli\bin;%PATH%"

echo [1/3] Verifying Git & GitHub credentials...
gh auth setup-git

echo.
echo [2/3] Uploading all website files to origin (bluex.github.io)...
cd /d "d:\My Website"
git push -u origin main

echo.
echo [3/3] Uploading all website files to bluexacedamy (www.bluexacedamy.space)...
git push -u bluexacedamy main

echo.
echo ========================================================
echo   SUCCESS! ALL FILES HAVE BEEN PUBLISHED TO GITHUB!
echo ========================================================
echo.
echo Live at: https://www.bluexacedamy.space
echo Mirror at: https://bluewasabae.github.io/bluex.github.io/
echo.
pause
