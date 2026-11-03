@echo off
TITLE BlueX Quantitative Bridge - MT5 / MT4 Execution Gateway
COLOR 0B
echo ==============================================================================
echo  BLUEX QUANTITATIVE EXECUTION GATEWAY (XAU/USD)
echo  LS Trading Academy Institutional Execution System
echo ==============================================================================
echo.

cd /d "%~dp0"

where python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [!] Python is not currently installed or not in PATH.
    echo [*] Attempting automated installation via winget...
    winget install Python.Python.3.11 --silent --accept-source-agreements --accept-package-agreements
    echo [*] Please restart this script once installation completes.
    pause
    exit /b 1
)

if not exist ".venv" (
    echo [*] Creating isolated Python virtual environment (.venv)...
    python -m venv .venv
)

echo [*] Activating environment and updating dependencies...
call .venv\Scripts\activate.bat
python -m pip install --upgrade pip >nul 2>&1
pip install -r requirements.txt

echo.
echo [*] Booting BlueX Execution Server on port 8000...
echo.
python server.py

pause
