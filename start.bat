@echo off
echo ===================================================
echo     Starting Traventure Development Server...
echo ===================================================
echo.
echo Opening browser at http://127.0.0.1:8085 ...
start "" "http://127.0.0.1:8085"
echo.
echo Server active at http://127.0.0.1:8085 (Press Ctrl+C to terminate)
php -S 127.0.0.1:8085
