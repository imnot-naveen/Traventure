<?php
    // Include security initialization
    require_once(__DIR__ . DIRECTORY_SEPARATOR . 'security.php');

    // Database configuration with environment variable fallback
    $db_host = getenv('DB_HOST') ?: '127.0.0.1';
    $db_port = getenv('DB_PORT') ?: '3306';
    $db_name = getenv('DB_NAME') ?: 'traventure';
    $db_user = getenv('DB_USER') ?: 'root';
    $db_password = getenv('DB_PASSWORD') !== false ? getenv('DB_PASSWORD') : '';

    try {
        $dsn = "mysql:host={$db_host};port={$db_port};dbname={$db_name};charset=utf8mb4";
        $options = [
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => true,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ];
        
        $db = new PDO($dsn, $db_user, $db_password, $options);
    } catch (PDOException $e) {
        error_log("Database connection error: " . $e->getMessage());
        http_response_code(500);
        die(json_encode([
            'success' => false,
            'message' => 'Database connection failed. Please check your configuration.'
        ]));
    }

    if (!defined('APP_NAME')) {
        define('APP_NAME', 'TRAVENTURE');
    }
?>
