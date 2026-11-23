@echo off
echo ===================================================
echo     Starting Traventure Development Server...
echo ===================================================
echo.
echo Opening browser at http://127.0.0.1:8000 ...
start http://127.0.0.1:8000
echo.
echo Server active at http://127.0.0.1:8000 (Press Ctrl+C to terminate)
php -S 127.0.0.1:8000
