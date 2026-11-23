<?php
// Traventure Development Server Router
// Handles routing and legacy path normalization for PHP built-in server (php -S)

$rawPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$uri = urldecode($rawPath);

// 1. Root redirect
if ($uri === '/' || $uri === '') {
    header('Location: /Client/Home/Home.html');
    exit();
}

// 2. Handle /traventure/ or /Traventure/ path prefix
if (preg_match('#^/traventure/(.*)$#i', $uri, $matches)) {
    $subPath = $matches[1];
    $targetFile = __DIR__ . DIRECTORY_SEPARATOR . str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $subPath);

    if (file_exists($targetFile) && !is_dir($targetFile)) {
        if (pathinfo($targetFile, PATHINFO_EXTENSION) === 'php') {
            chdir(dirname($targetFile));
            require $targetFile;
            return true;
        }
        // Static assets (CSS, JS, SVG, images)
        return false;
    }
}

// 3. Normal request: if file exists, serve it
$filePath = __DIR__ . DIRECTORY_SEPARATOR . str_replace(['/', '\\'], DIRECTORY_SEPARATOR, ltrim($uri, '/\\'));
if (file_exists($filePath) && !is_dir($filePath)) {
    return false;
}

return false;
