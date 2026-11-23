Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "    Starting Traventure Development Server...      " -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""
Start-Process "http://127.0.0.1:8085"
Write-Host "Server running at http://127.0.0.1:8085 (Press Ctrl+C to stop)" -ForegroundColor Green
php -S 127.0.0.1:8085
