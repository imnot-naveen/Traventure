<?php
declare(strict_types=1);

/**
 * Traventure Automatic Database Provisioning Script
 *
 * Connects to local MySQL, provisions the `traventure` database,
 * imports the master schema from `traventure.sql`, and applies
 * production covering composite indexes.
 */

if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    echo "CLI invocation required.\n";
    exit(1);
}

require_once(dirname(__DIR__) . '/includes/security.php');

$db_host = getenv('DB_HOST') ?: '127.0.0.1';
$db_port = getenv('DB_PORT') ?: '3306';
$db_name = getenv('DB_NAME') ?: 'traventure';
$db_user = getenv('DB_USER') ?: 'root';
$db_password = getenv('DB_PASSWORD') !== false ? getenv('DB_PASSWORD') : '';

echo "================================================================\n";
echo "       TRAVENTURE DATABASE PROVISIONING & SETUP                 \n";
echo "================================================================\n\n";

echo "Connecting to MySQL server at {$db_host}:{$db_port} as user '{$db_user}'...\n";

try {
    // 1. Connect to MySQL server without selecting database
    $pdo = new PDO("mysql:host={$db_host};port={$db_port};charset=utf8mb4", $db_user, $db_password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    echo "  ✓ Connected to MySQL server successfully.\n\n";
} catch (PDOException $e) {
    echo "  ❌ Connection Failed: " . $e->getMessage() . "\n\n";
    echo "TROUBLESHOOTING:\n";
    echo "1. Ensure MySQL is running on port {$db_port}.\n";
    echo "   - Start WampServer (or run 'Start-Service wampmysqld64' in Admin PowerShell).\n";
    echo "2. Check credentials in your .env file.\n\n";
    exit(1);
}

try {
    // 2. Create database if it does not exist
    echo "Creating database `{$db_name}` if not exists...\n";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    $pdo->exec("USE `{$db_name}`;");
    echo "  ✓ Database `{$db_name}` selected.\n\n";

    // 3. Check if tables already exist
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    $tableCount = count($tables);

    $sqlFile = __DIR__ . DIRECTORY_SEPARATOR . 'traventure.sql';
    if (!file_exists($sqlFile)) {
        throw new RuntimeException("SQL seed file not found: {$sqlFile}");
    }

    if ($tableCount > 0) {
        echo "Database `{$db_name}` already contains {$tableCount} table(s).\n";
        echo "Skipping full import to preserve existing records.\n\n";
    } else {
        echo "Importing schema and timetable records from traventure.sql (~440 KB)...\n";
        $sqlContent = file_get_contents($sqlFile);

        // Execute batch SQL queries
        $pdo->exec($sqlContent);
        echo "  ✓ Schema and seed data successfully imported.\n\n";
    }

    // 4. Run composite index optimizations
    echo "Applying production composite indexes...\n";
    require_once(__DIR__ . DIRECTORY_SEPARATOR . 'apply_indexes.php');

    echo "\n================================================================\n";
    echo "  ✓ DATABASE SETUP COMPLETE! You can now use the full web app.  \n";
    echo "================================================================\n";

} catch (Throwable $e) {
    echo "  ❌ Setup Error: " . $e->getMessage() . "\n";
    exit(1);
}
