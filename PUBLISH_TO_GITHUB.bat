@echo off
title BlueX Academy & Quantitative Cockpit - Publisher
color 0b
echo ========================================================
echo   BlueX Terminal & Academy - GitHub Publisher
echo   Domain: www.bluexacedamy.space
echo   Target Repo: BlueWasabae/bluexacedamy
echo ========================================================
echo.

set "PATH=C:\Users\Asus ROG\AppData\Local\MinGit\cmd;C:\Users\Asus ROG\AppData\Local\gh-cli\bin;%PATH%"

echo [*] Configuring Git credentials...
gh auth setup-git

echo.
echo [*] Pushing to https://github.com/BlueWasabae/bluexacedamy.git ...
cd /d "%~dp0"
git push -u bluexacedamy main --force

echo.
echo ========================================================
echo   SUCCESS! PUBLISHED TO https://github.com/BlueWasabae/bluexacedamy
echo   LIVE AT: https://www.bluexacedamy.space
echo ========================================================
echo.
pause
