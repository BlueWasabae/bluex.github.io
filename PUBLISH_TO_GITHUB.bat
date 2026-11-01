@echo off
title BlueX Academy - 1-Click Publisher
color 0b
echo ========================================================
echo       BlueX Academy - Automatic GitHub Publisher
echo ========================================================
echo.

set "PATH=C:\Users\Asus ROG\AppData\Local\MinGit\cmd;C:\Users\Asus ROG\AppData\Local\gh-cli\bin;%PATH%"

echo [1/3] Connecting to your GitHub account...
echo A browser window will open asking to authorize GitHub CLI.
echo Please confirm or click Authorize in your browser.
echo.
gh auth login --hostname github.com --git-protocol https --web --skip-ssh-key

echo.
echo [2/3] Configuring Git credentials...
gh auth setup-git

echo.
echo [3/3] Uploading all website files to root of GitHub...
cd /d "d:\My Website"
git push -u origin main --force

echo.
echo ========================================================
echo   SUCCESS! ALL FILES HAVE BEEN PUBLISHED TO GITHUB!
echo ========================================================
echo.
echo Your website will be live in 1 minute at:
echo https://bluewasabae.github.io/bluex.github.io/
echo.
pause
