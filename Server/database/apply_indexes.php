<?php
declare(strict_types=1);

/**
 * Traventure Database Index Optimization Migration Runner
 *
 * Applies composite indexes to ensure covering index scans on transit routing
 * queries across 8,000+ stop records. Compatible with both MySQL and SQLite.
 */

if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    echo "CLI invocation required.\n";
    exit(1);
}

require_once(dirname(__DIR__) . '/includes/config.php');

echo "================================================================\n";
echo "       TRAVENTURE DATABASE COMPOSITE INDEX MIGRATION            \n";
echo "================================================================\n\n";

$indexes = [
    [
        'table' => 'trainstops',
        'name' => 'idx_trainstops_origin_covering',
        'columns' => ['stationid', 'trainID', 'departuretime'],
        'purpose' => 'Origin covering index for timetable pathfinding'
    ],
    [
        'table' => 'trainstops',
        'name' => 'idx_trainstops_dest_covering',
        'columns' => ['trainID', 'stationid', 'arrivaltime'],
        'purpose' => 'Destination covering index for transit route joins'
    ],
    [
        'table' => 'seat_reservations',
        'name' => 'idx_seat_reservations_lookup',
        'columns' => ['train_id', 'journey_date', 'status'],
        'purpose' => 'Seat availability and layout lookup optimization'
    ],
    [
        'table' => 'seat_reservations',
        'name' => 'idx_seat_reservations_sweeper',
        'columns' => ['status', 'expires_at'],
        'purpose' => 'High-frequency expiring hold cleanup index'
    ],
    [
        'table' => 'userreviews',
        'name' => 'idx_userreviews_dest_user',
        'columns' => ['destination', 'username'],
        'purpose' => 'User review rating deduplication index'
    ],
    [
        'table' => 'train',
        'name' => 'idx_train_endstation',
        'columns' => ['endStation'],
        'purpose' => 'Terminal station lookup optimization'
    ]
];

$driver = $db->getAttribute(PDO::ATTR_DRIVER_NAME);
echo "Connected Database Driver: " . strtoupper($driver) . "\n\n";

$appliedCount = 0;
$skippedCount = 0;

foreach ($indexes as $idx) {
    $tableName = $idx['table'];
    $indexName = $idx['name'];
    $colsList = implode(', ', $idx['columns']);

    echo "Analyzing [{$tableName}].[{$indexName}] ({$idx['purpose']})...\n";

    try {
        if ($driver === 'mysql') {
            // Check if index exists in information_schema
            $checkStmt = $db->prepare("
                SELECT COUNT(1) 
                FROM information_schema.statistics 
                WHERE table_schema = DATABASE() 
                  AND table_name = :table 
                  AND index_name = :index
            ");
            $checkStmt->execute([':table' => $tableName, ':index' => $indexName]);
            $exists = (int)$checkStmt->fetchColumn() > 0;

            if ($exists) {
                echo "  ↳ Index already exists. Skipping.\n\n";
                $skippedCount++;
                continue;
            }

            $sql = "ALTER TABLE `{$tableName}` ADD INDEX `{$indexName}` ({$colsList})";
            $db->exec($sql);
            echo "  ✓ Successfully applied MySQL composite index.\n\n";
            $appliedCount++;
        } else {
            // SQLite syntax
            $sql = "CREATE INDEX IF NOT EXISTS `{$indexName}` ON `{$tableName}` ({$colsList})";
            $db->exec($sql);
            echo "  ✓ Successfully ensured SQLite composite index.\n\n";
            $appliedCount++;
        }
    } catch (Throwable $e) {
        echo "  ↳ Note / Warning: " . $e->getMessage() . "\n\n";
    }
}

echo "================================================================\n";
echo "Migration Complete: {$appliedCount} applied, {$skippedCount} existing.\n";
echo "================================================================\n";
