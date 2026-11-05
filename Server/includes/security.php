<?php
// Centralized Security & Environment Configuration for Traventure

// Prevent multiple inclusions
if (defined('TRAVENTURE_SECURITY_INIT')) {
    return;
}
define('TRAVENTURE_SECURITY_INIT', true);

// 1. Secure Session Cookie Parameters (Must run before session_start)
if (session_status() === PHP_SESSION_NONE) {
    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443);
    
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '',
        'secure' => $isHttps,
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
}

// 2. Global Security HTTP Headers
if (!headers_sent()) {
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');
    header('X-XSS-Protection: 1; mode=block');
    header('Referrer-Policy: strict-origin-when-cross-origin');
}

// 3. Simple Environment Variable Loader (.env support without external package)
if (!function_exists('loadEnv')) {
    function loadEnv($envPath) {
        if (!file_exists($envPath)) {
            return false;
        }
        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line) || strpos($line, '#') === 0) {
                continue;
            }
            if (strpos($line, '=') !== false) {
                list($name, $value) = explode('=', $line, 2);
                $name = trim($name);
                $value = trim($value);
                // Strip quotes if present
                $value = trim($value, '"\'');
                if (!array_key_exists($name, $_SERVER) && !array_key_exists($name, $_ENV)) {
                    putenv("$name=$value");
                    $_ENV[$name] = $value;
                    $_SERVER[$name] = $value;
                }
            }
        }
        return true;
    }
}

// Load root .env
$rootEnv = dirname(dirname(__DIR__)) . DIRECTORY_SEPARATOR . '.env';
loadEnv($rootEnv);

// 4. Safe Production Error Reporting Configuration
// Display errors only in local development, never expose traces in production
$isDev = (getenv('APP_ENV') === 'development' || (isset($_SERVER['SERVER_NAME']) && in_array($_SERVER['SERVER_NAME'], ['localhost', '127.0.0.1'])));

if ($isDev) {
    ini_set('display_errors', '0'); // Keep off for API clean JSON responses
    ini_set('display_startup_errors', '0');
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', '0');
    ini_set('display_startup_errors', '0');
    error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED & ~E_STRICT);
}
ini_set('log_errors', '1');

// 5. CSRF Helper Functions
if (!function_exists('generateCsrfToken')) {
    function generateCsrfToken() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }
}

if (!function_exists('verifyCsrfToken')) {
    function verifyCsrfToken($token) {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        if (empty($_SESSION['csrf_token']) || empty($token)) {
            return false;
        }
        return hash_equals($_SESSION['csrf_token'], $token);
    }
}

