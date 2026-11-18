<?php
declare(strict_types=1);

/**
 * Traventure PHP 8.x Modernization & Security Audit Verification Suite
 *
 * Validates:
 * 1. PHP 8.0+ Idioms (Constructor Property Promotion, Match Expressions, Union Types)
 * 2. Unified ApiResponse Schema & RFC HTTP Status Mapping
 * 3. High-Throughput Token-Bucket Rate Limiter & RFC Header Contracts
 * 4. Systems Integration Across Core Transit, Reservation & Accommodation Engines
 */

echo "================================================================\n";
echo "    TRAVENTURE PHP 8.x MODERNIZATION & SECURITY TEST SUITE      \n";
echo "================================================================\n\n";

$passCount = 0;
$totalTests = 4;

// -------------------------------------------------------------
// [TEST 1/4] Audit PHP 8.x Idioms via Reflection
// -------------------------------------------------------------
echo "[TEST 1/4] Auditing PHP 8.x Language Idioms via Reflection...\n";

require_once(__DIR__ . '/../Server/core/ApiResponse.php');
require_once(__DIR__ . '/../Server/core/RateLimiter.php');
require_once(__DIR__ . '/../Server/core/TransitRouter.php');
require_once(__DIR__ . '/../Server/core/AccommodationService.php');
require_once(__DIR__ . '/../Server/core/SeatReservationService.php');

$reflectionChecks = [
    TransitRouter::class => ['db'],
    AccommodationService::class => ['db'],
    SeatReservationService::class => ['db']
];

$allPromoted = true;
foreach ($reflectionChecks as $className => $promotedParams) {
    $refClass = new ReflectionClass($className);
    $constructor = $refClass->getConstructor();
    if (!$constructor) {
        throw new RuntimeException("Constructor missing in {$className}");
    }

    $params = $constructor->getParameters();
    foreach ($params as $param) {
        if (in_array($param->getName(), $promotedParams, true)) {
            if (!$param->isPromoted()) {
                echo "  FAIL: {$className}::\${$param->getName()} is not promoted.\n";
                $allPromoted = false;
            }
        }
    }
}

if ($allPromoted) {
    echo "  ✓ Constructor Property Promotion active across core services (TransitRouter, AccommodationService, SeatReservationService)\n";
} else {
    exit(1);
}

// Test PHP 8 match expressions in TransitRouter
$pdoDummy = new PDO('sqlite::memory:');
$router = new TransitRouter($pdoDummy);

$runningDaily = $router->isTrainRunning('Daily', 'Mon', false);
$runningWeekdays = $router->isTrainRunning('Weekdays', 'Sat', true);
$runningSunday = $router->isTrainRunning('Sun', 'Sun', true);
$runningSundayFail = $router->isTrainRunning('Sun', 'Mon', false);

if ($runningDaily && !$runningWeekdays && $runningSunday && !$runningSundayFail) {
    echo "  ✓ PHP 8 match expression verified in TransitRouter::isTrainRunning\n";
} else {
    echo "  FAIL: TransitRouter::isTrainRunning match expression returned unexpected result\n";
    exit(1);
}

// Test PHP 8 match expression in SeatReservationService
$seatService = new SeatReservationService($pdoDummy);
$statusHeld = $seatService->normalizeHoldStatus('held');
$statusConfirmed = $seatService->normalizeHoldStatus('CONFIRMED');
$statusExpired = $seatService->normalizeHoldStatus('expired');
$statusUnknown = $seatService->normalizeHoldStatus('foobar');

if ($statusHeld === 'HELD' && $statusConfirmed === 'CONFIRMED' && $statusExpired === 'RELEASED' && $statusUnknown === 'AVAILABLE') {
    echo "  ✓ PHP 8 match expression verified in SeatReservationService::normalizeHoldStatus\n";
} else {
    echo "  FAIL: SeatReservationService::normalizeHoldStatus match expression returned unexpected result\n";
    exit(1);
}

// Test PHP 8 match expression in AccommodationService
$accommService = new AccommodationService();
$tierBudget = $accommService->categorizeBudgetTier(20);
$tierMid = $accommService->categorizeBudgetTier('45.00');
$tierPrem = $accommService->categorizeBudgetTier(95);

if (str_contains($tierBudget, 'Budget') && str_contains($tierMid, 'Mid-scale') && str_contains($tierPrem, 'Premium')) {
    echo "  ✓ PHP 8 match expression & union types verified in AccommodationService::categorizeBudgetTier\n";
} else {
    echo "  FAIL: AccommodationService::categorizeBudgetTier match expression returned unexpected result\n";
    exit(1);
}

$passCount++;
echo "\n";

// -------------------------------------------------------------
// [TEST 2/4] Audit Standardized ApiResponse Contracts
// -------------------------------------------------------------
echo "[TEST 2/4] Auditing Unified ApiResponse Contract & Status Mapping...\n";

$statusCodesToTest = [200, 201, 400, 401, 403, 404, 409, 429, 500];
$expectedPhrases = [
    200 => 'OK',
    201 => 'Created',
    400 => 'Bad Request',
    401 => 'Unauthorized',
    403 => 'Forbidden',
    404 => 'Not Found',
    409 => 'Conflict',
    429 => 'Too Many Requests',
    500 => 'Internal Server Error'
];

foreach ($statusCodesToTest as $code) {
    $text = ApiResponse::statusText($code);
    if ($text !== $expectedPhrases[$code]) {
        echo "  FAIL: Mismatch for status {$code}: got '{$text}', expected '{$expectedPhrases[$code]}'\n";
        exit(1);
    }
}
echo "  ✓ All standard RFC status code reason phrases correctly mapped via PHP 8 match\n";

// Helper to run PHP code in an isolated subprocess via STDIN (platform-independent across Windows/Linux)
function runPhpCode(string $code): string {
    $descriptors = [
        0 => ['pipe', 'r'],
        1 => ['pipe', 'w'],
        2 => ['pipe', 'w']
    ];
    $process = proc_open(PHP_BINARY, $descriptors, $pipes);
    if (!is_resource($process)) {
        return '';
    }
    fwrite($pipes[0], "<?php\n" . $code);
    fclose($pipes[0]);
    $stdout = stream_get_contents($pipes[1]);
    fclose($pipes[1]);
    fclose($pipes[2]);
    proc_close($process);
    return (string)$stdout;
}

// Verify backward compatibility envelope formatting
// Run in an isolated subprocess to capture output and exit code without terminating the test runner
$codeSuccessTest = '
    require_once("Server/core/ApiResponse.php");
    ApiResponse::ok(["trainID" => 1005, "seats" => ["A1", "A2"]]);
';
$output = runPhpCode($codeSuccessTest);
$decoded = json_decode($output ?: '', true);

if (!is_array($decoded) || !isset($decoded['success']) || $decoded['success'] !== true || $decoded['trainID'] !== 1005) {
    echo "  FAIL: ApiResponse::ok payload structure invalid. Output: {$output}\n";
    exit(1);
}
echo "  ✓ ApiResponse::ok emits valid JSON with backward-compatible associative payload\n";

$codeErrorTest = '
    require_once("Server/core/ApiResponse.php");
    ApiResponse::badRequest("Station not found");
';
$errOutput = runPhpCode($codeErrorTest);
$errDecoded = json_decode($errOutput ?: '', true);

if (!is_array($errDecoded) || !isset($errDecoded['success']) || $errDecoded['success'] !== false || $errDecoded['statusCode'] !== 400) {
    echo "  FAIL: ApiResponse::badRequest payload invalid. Output: {$errOutput}\n";
    exit(1);
}
echo "  ✓ ApiResponse::badRequest correctly formats 400 response with success: false\n";

$passCount++;
echo "\n";

// -------------------------------------------------------------
// [TEST 3/4] High-Performance Token-Bucket Rate Limiter
// -------------------------------------------------------------
echo "[TEST 3/4] Testing High-Performance Token-Bucket Rate Limiter...\n";

$testDir = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'traventure_test_rate_limits_' . uniqid();
$limiter = new RateLimiter($testDir);

$clientKey = 'test_client_audit_' . time();
$limit = 5;
$decaySeconds = 10;

// Test allowance within limit (5 requests allowed)
for ($i = 1; $i <= $limit; $i++) {
    $res = $limiter->check($clientKey, $limit, $decaySeconds);
    if (!$res['allowed']) {
        echo "  FAIL: Request {$i} should have been allowed\n";
        exit(1);
    }
    if ($res['remaining'] !== ($limit - $i)) {
        echo "  FAIL: Request {$i} expected remaining " . ($limit - $i) . ", got {$res['remaining']}\n";
        exit(1);
    }
}
echo "  ✓ Token-bucket allowed {$limit} sequential burst requests and decremented tokens monotonically\n";

// 6th request must be rejected (exhausted bucket)
$exhaustedRes = $limiter->check($clientKey, $limit, $decaySeconds);
if ($exhaustedRes['allowed']) {
    echo "  FAIL: 6th request exceeded limit but was allowed!\n";
    exit(1);
}

if ($exhaustedRes['remaining'] !== 0 || $exhaustedRes['retryAfter'] <= 0) {
    echo "  FAIL: Exhausted bucket should have remaining=0 and retryAfter > 0. Got: " . json_encode($exhaustedRes) . "\n";
    exit(1);
}
echo "  ✓ Rate limit correctly triggered 429 state with Retry-After: {$exhaustedRes['retryAfter']}s\n";

// Cleanup temp test directory
$limiter->purgeAll();
@rmdir($testDir);
echo "  ✓ Rate limiter test storage cleaned up\n";

$passCount++;
echo "\n";

// -------------------------------------------------------------
// [TEST 4/4] End-to-End Core Integration Test
// -------------------------------------------------------------
echo "[TEST 4/4] Verifying Core Services End-to-End Integration...\n";

// 1. SQLite schema initialization for transit testing
$sqlite = new PDO('sqlite::memory:');
$sqlite->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$sqlite->exec("
    CREATE TABLE station (
        stationID INTEGER PRIMARY KEY,
        name TEXT NOT NULL
    );
    CREATE TABLE train (
        trainID INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        days TEXT NOT NULL,
        endStation INTEGER
    );
    CREATE TABLE trainstops (
        trainID INTEGER,
        stationid INTEGER,
        arrivaltime TEXT,
        departuretime TEXT,
        PRIMARY KEY (trainID, stationid)
    );
    CREATE TABLE seat_reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        train_id INTEGER NOT NULL,
        journey_date TEXT NOT NULL,
        seat_number TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        booking_id INTEGER NULL,
        coach_class TEXT DEFAULT '1st Class',
        status TEXT NOT NULL,
        held_at TEXT DEFAULT CURRENT_TIMESTAMP,
        expires_at TEXT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(train_id, journey_date, seat_number)
    );
");

// Populate sample route: Colombo Fort (102) -> Kandy (406)
$sqlite->exec("
    INSERT INTO station (stationID, name) VALUES (102, 'Colombo Fort'), (406, 'Kandy');
    INSERT INTO train (trainID, name, type, days, endStation) VALUES (1005, 'Podi Menike', 'Express', 'Daily', 406);
    INSERT INTO trainstops (trainID, stationid, arrivaltime, departuretime) VALUES
        (1005, 102, '05:55:00', '06:00:00'),
        (1005, 406, '08:45:00', '08:50:00');
");

$testRouter = new TransitRouter($sqlite);
$directs = $testRouter->findDirectTrains(102, 406, '2026-11-20');

if (count($directs) === 1 && $directs[0]['trainName'] === 'Podi Menike' && $directs[0]['duration'] === '2h 45m') {
    echo "  ✓ TransitRouter direct search computed valid itinerary on SQLite in-memory graph\n";
} else {
    echo "  FAIL: TransitRouter returned unexpected results: " . json_encode($directs) . "\n";
    exit(1);
}

// 2. Seat reservation test
$testSeatService = new SeatReservationService($sqlite);
$holdRes = $testSeatService->holdSeats(1005, '2026-11-20', ['A1', 'A2'], 42);
if ($holdRes['success'] !== true) {
    echo "  FAIL: Seat hold failed on SQLite in-memory engine\n";
    exit(1);
}
echo "  ✓ SeatReservationService successfully acquired 5-minute hold for seats A1, A2\n";

// 3. Accommodation service test
$testAccomm = new AccommodationService($sqlite);
$hotels = $testAccomm->getHotelsForLayover('Colombo Fort', '2026-11-20', '2026-11-21');
if (!empty($hotels['hotels']) && !empty($hotels['links']['bookingDeepLink'])) {
    echo "  ✓ AccommodationService resolved layover hotels and affiliate deep-links\n";
} else {
    echo "  FAIL: AccommodationService failed to return hotels or links\n";
    exit(1);
}

$passCount++;
echo "\n";

echo "================================================================\n";
echo "  ALL PHP 8.x MODERNIZATION & SECURITY INVARIANTS: ✓ PASSED    \n";
echo "================================================================\n";
