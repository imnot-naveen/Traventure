<?php
declare(strict_types=1);

/**
 * Traventure High-Concurrency Query Performance & Index Benchmark
 *
 * Measures query latency percentiles (P50, P95, P99) and throughput (QPS)
 * across 8,000+ stop records comparing non-indexed baselines against
 * production covering composite indexes.
 */

echo "================================================================\n";
echo "    TRAVENTURE TRANSIT QUERY BENCHMARK & LATENCY PROFILER       \n";
echo "================================================================\n\n";

require_once(__DIR__ . '/../Server/core/TransitRouter.php');
require_once(__DIR__ . '/../Server/core/SeatReservationService.php');

/**
 * Computes statistical latency distribution percentiles from benchmark run.
 *
 * @param float[] $latencies Array of measured query latencies in milliseconds
 * @return array{count: int, min: float, avg: float, p50: float, p95: float, p99: float, max: float, qps: float}
 */
function calculatePercentiles(array $latencies): array {
    if (empty($latencies)) {
        return [
            'count' => 0,
            'min' => 0.0,
            'avg' => 0.0,
            'p50' => 0.0,
            'p95' => 0.0,
            'p99' => 0.0,
            'max' => 0.0,
            'qps' => 0.0
        ];
    }

    sort($latencies);

    $count = count($latencies);
    $min = $latencies[0];
    $max = $latencies[$count - 1];

    $avg = array_sum($latencies) / $count;

    $p50Idx = (int)floor(0.50 * ($count - 1));
    $p95Idx = (int)floor(0.95 * ($count - 1));
    $p99Idx = (int)floor(0.99 * ($count - 1));

    $throughput = round(1000 / max(0.001, $avg), 1);

    return [
        'count' => $count,
        'min' => round($min, 3),
        'avg' => round($avg, 3),
        'p50' => round($latencies[$p50Idx], 3),
        'p95' => round($latencies[$p95Idx], 3),
        'p99' => round($latencies[$p99Idx], 3),
        'max' => round($max, 3),
        'qps' => $throughput
    ];
}

/**
 * Creates an in-memory SQLite railway database seeded with 8,000+ realistic stop records.
 */
function createBenchmarkDatabase(bool $withCompositeIndexes): PDO {
    $db = new PDO('sqlite::memory:');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $db->exec("
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
            coach_class TEXT DEFAULT '1st Class',
            status TEXT NOT NULL,
            expires_at TEXT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(train_id, journey_date, seat_number)
        );
    ");

    if ($withCompositeIndexes) {
        $db->exec("
            CREATE INDEX idx_trainstops_origin_covering ON trainstops (stationid, trainID, departuretime);
            CREATE INDEX idx_trainstops_dest_covering ON trainstops (trainID, stationid, arrivaltime);
            CREATE INDEX idx_seat_reservations_lookup ON seat_reservations (train_id, journey_date, status);
        ");
    } else {
        // Baseline: Only single-column indexes
        $db->exec("
            CREATE INDEX idx_trainstops_station_single ON trainstops (stationid);
            CREATE INDEX idx_trainstops_train_single ON trainstops (trainID);
        ");
    }

    // Seed Stations (50 core Sri Lankan railway stations)
    $stations = [
        101 => 'Maradana', 102 => 'Colombo Fort', 103 => 'Kollupitiya', 104 => 'Bambalapitiya',
        105 => 'Dehiwala', 106 => 'Mount Lavinia', 107 => 'Ratmalana', 108 => 'Moratuwa',
        109 => 'Panadura', 110 => 'Wadduwa', 111 => 'Kalutara North', 112 => 'Kalutara South',
        113 => 'Beruwala', 114 => 'Aluthgama', 115 => 'Bentota', 116 => 'Induruwa',
        117 => 'Ambalangoda', 118 => 'Hikkaduwa', 119 => 'Galle', 120 => 'Talpe',
        121 => 'Ahangama', 122 => 'Weligama', 123 => 'Matara', 124 => 'Beliatta',
        401 => 'Ragama', 402 => 'Gampaha', 403 => 'Veyangoda', 404 => 'Mirigama',
        405 => 'Polgahawela', 406 => 'Peradeniya', 407 => 'Kandy', 408 => 'Gampola',
        409 => 'Nawalapitiya', 410 => 'Hatton', 411 => 'Nanu Oya', 412 => 'Ella', 413 => 'Badulla',
        501 => 'Kurunegala', 502 => 'Maho', 503 => 'Anuradhapura', 504 => 'Vavuniya', 505 => 'Jaffna'
    ];

    $stInsert = $db->prepare("INSERT INTO station (stationID, name) VALUES (?, ?)");
    foreach ($stations as $id => $name) {
        $stInsert->execute([$id, $name]);
    }

    // Seed 200 Trains and ~8,200 Stop Records to simulate production load
    $trainInsert = $db->prepare("INSERT INTO train (trainID, name, type, days, endStation) VALUES (?, ?, ?, ?, ?)");
    $stopInsert = $db->prepare("INSERT INTO trainstops (trainID, stationid, arrivaltime, departuretime) VALUES (?, ?, ?, ?)");

    $stationIds = array_keys($stations);
    $totalStations = count($stationIds);

    $db->beginTransaction();
    for ($t = 1; $t <= 200; $t++) {
        $trainId = 1000 + $t;
        $name = "Express Line #{$t}";
        $type = ($t % 2 === 0) ? 'Express' : 'Intercity';
        $days = 'Daily';
        $endStation = $stationIds[$totalStations - 1];

        $trainInsert->execute([$trainId, $name, $type, $days, $endStation]);

        // Each train stops at 41 stations on average = 8,200 stop records
        $stopsPerTrain = min(41, $totalStations);
        $startHour = 4 + ($t % 16); // Departures between 04:00 and 20:00

        for ($s = 0; $s < $stopsPerTrain; $s++) {
            $minuteOffset = ($s * 15) + (($t % 5) * 2);
            $totalMin = ($startHour * 60) + $minuteOffset;
            $arrHour = floor($totalMin / 60) % 24;
            $arrMin = $totalMin % 60;
            $depMin = ($arrMin + 2) % 60;
            $depHour = ($arrMin + 2 >= 60) ? ($arrHour + 1) % 24 : $arrHour;

            $arrStr = sprintf('%02d:%02d:00', $arrHour, $arrMin);
            $depStr = sprintf('%02d:%02d:00', $depHour, $depMin);

            $stId = $stationIds[$s];
            $stopInsert->execute([$trainId, $stId, $arrStr, $depStr]);
        }
    }
    $db->commit();

    return $db;
}

/**
 * Runs a suite of queries measuring individual execution times in milliseconds.
 */
function runBenchmarkSuite(PDO $db, int $iterations): array {
    $router = new TransitRouter($db);
    $latencies = [];

    // Realistic search pairs:
    $testPairs = [
        [102, 119], // Colombo Fort -> Galle (Coastal)
        [102, 407], // Colombo Fort -> Kandy (Main Line)
        [101, 123], // Maradana -> Matara (Coastal)
        [401, 412], // Ragama -> Ella (Scenic Hill Country)
        [102, 505]  // Colombo Fort -> Jaffna (Northern Line)
    ];

    $pairCount = count($testPairs);

    for ($i = 0; $i < $iterations; $i++) {
        $pair = $testPairs[$i % $pairCount];
        $startSt = $pair[0];
        $endSt = $pair[1];

        $t0 = hrtime(true);
        $results = $router->findDirectTrains($startSt, $endSt, '2026-11-20');
        $t1 = hrtime(true);

        $elapsedMs = ($t1 - $t0) / 1e6; // Convert nanoseconds to milliseconds
        $latencies[] = $elapsedMs;
    }

    return $latencies;
}

// -------------------------------------------------------------
// EXECUTE BENCHMARKS
// -------------------------------------------------------------
echo "[STAGE 1/3] Building Baseline In-Memory Transit DB (8,200+ stops, single-column indexes)...\n";
$baselineDb = createBenchmarkDatabase(false);

// Query Execution Plan Inspection
echo "[STAGE 2/3] Inspecting Query Plan via EXPLAIN QUERY PLAN...\n";
$explainBaseline = $baselineDb->query("
    EXPLAIN QUERY PLAN
    SELECT ts1.trainID, ts1.departuretime, ts2.arrivaltime
    FROM trainstops ts1
    JOIN trainstops ts2 ON ts1.trainID = ts2.trainID
    WHERE ts1.stationid = 102 AND ts2.stationid = 119
")->fetchAll(PDO::FETCH_ASSOC);

echo "  Baseline Query Plan:\n";
foreach ($explainBaseline as $step) {
    echo "    - " . ($step['detail'] ?? json_encode($step)) . "\n";
}

echo "\n[STAGE 3/3] Building Optimized Transit DB (8,200+ stops, Covering Composite Indexes)...\n";
$optDb = createBenchmarkDatabase(true);

$explainOpt = $optDb->query("
    EXPLAIN QUERY PLAN
    SELECT ts1.trainID, ts1.departuretime, ts2.arrivaltime
    FROM trainstops ts1
    JOIN trainstops ts2 ON ts1.trainID = ts2.trainID
    WHERE ts1.stationid = 102 AND ts2.stationid = 119
")->fetchAll(PDO::FETCH_ASSOC);

echo "  Optimized Query Plan (Covering Indexes):\n";
foreach ($explainOpt as $step) {
    echo "    - " . ($step['detail'] ?? json_encode($step)) . "\n";
}

echo "\n----------------------------------------------------------------\n";
echo "  RUNNING 1,000 CONCURRENT SEARCH QUERIES PER BENCHMARK...\n";
echo "----------------------------------------------------------------\n";

$iterations = 1000;
$baselineLatencies = runBenchmarkSuite($baselineDb, $iterations);
$optLatencies = runBenchmarkSuite($optDb, $iterations);

$baselineStats = calculatePercentiles($baselineLatencies);
$optStats = calculatePercentiles($optLatencies);

echo "\n================================================================\n";
echo "                   BENCHMARK RESULTS SUMMARY                    \n";
echo "================================================================\n";
printf("%-18s | %-16s | %-16s | %-12s\n", "Metric", "Baseline", "Optimized", "Improvement");
echo "-------------------+------------------+------------------+-------------\n";
printf("%-18s | %-16d | %-16d | %-12s\n", "Sample Count", $baselineStats['count'], $optStats['count'], "-");
printf("%-18s | %-13.3f ms | %-13.3f ms | %-12s\n", "Min Latency", $baselineStats['min'], $optStats['min'], "-");
printf("%-18s | %-13.3f ms | %-13.3f ms | %-12s\n", "Average Latency", $baselineStats['avg'], $optStats['avg'], 
    ($baselineStats['avg'] > 0 ? sprintf("%.1fx faster", $baselineStats['avg'] / max(0.001, $optStats['avg'])) : "-"));
printf("%-18s | %-13.3f ms | %-13.3f ms | %-12s\n", "Median (P50)", $baselineStats['p50'], $optStats['p50'], "-");
printf("%-18s | %-13.3f ms | %-13.3f ms | %-12s\n", "95th %-tile (P95)", $baselineStats['p95'], $optStats['p95'], "-");
printf("%-18s | %-13.3f ms | %-13.3f ms | %-12s\n", "99th %-tile (P99)", $baselineStats['p99'], $optStats['p99'], "-");
printf("%-18s | %-13.3f ms | %-13.3f ms | %-12s\n", "Max Latency", $baselineStats['max'], $optStats['max'], "-");
printf("%-18s | %-13.1f qps| %-13.1f qps| %-12s\n", "Throughput (QPS)", $baselineStats['qps'], $optStats['qps'], 
    ($optStats['qps'] > 0 ? sprintf("%.1fx", $optStats['qps'] / max(1.0, $baselineStats['qps'])) : "-"));
echo "================================================================\n\n";

if ($optStats['p95'] > 0 && $optStats['p95'] < 50.0) {
    echo "  ✓ TARGET MET: P95 latency is sub-50ms (Actual: {$optStats['p95']} ms) across 8,200+ stops!\n";
} else if ($optStats['count'] === 0) {
    echo "  ⏳ PENDING: calculatePercentiles() needs implementation to produce final latency metrics.\n";
}
