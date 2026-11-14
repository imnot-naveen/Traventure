<?php
declare(strict_types=1);

/**
 * Traventure CLI Maintenance Script: Seat Hold Expiration Sweeper
 *
 * Can be run via Windows Task Scheduler, Linux Cron (`* * * * * php cron_cleanup_holds.php`),
 * or invoked via CLI/Worker to release expired 5-minute passenger holds.
 */

if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    echo json_encode(['error' => 'CLI invocation required.']);
    exit(1);
}

require_once(__DIR__ . '/../includes/config.php');
require_once(__DIR__ . '/SeatReservationService.php');

$isVerbose = in_array('--verbose', $argv, true) || in_array('-v', $argv, true);
$timestamp = date('Y-m-d H:i:s');

try {
    $service = new SeatReservationService($db);
    $releasedCount = $service->releaseExpiredHolds();

    if ($isVerbose || $releasedCount > 0) {
        echo "[{$timestamp}] [CLEANUP] Released {$releasedCount} expired seat reservation hold(s).\n";
    }

    exit(0);
} catch (Throwable $e) {
    fwrite(STDERR, "[{$timestamp}] [ERROR] Cleanup sweeper failed: " . $e->getMessage() . "\n");
    exit(1);
}

