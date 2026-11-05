<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once('../core/initialize.php');

try {
    $rawInput = file_get_contents("php://input");
    $data = json_decode($rawInput, true);

    $startStation = $data['startStation'] ?? null;
    $endStation = $data['endStation'] ?? null;
    $searchDate = $data['searchDate'] ?? date('Y-m-d');

    if (!$startStation || !$endStation) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Please provide start and end stations.']);
        exit();
    }

    $timestamp = strtotime($searchDate);
    $dayOfWeek = date('D', $timestamp); // Mon, Tue, Wed, Thu, Fri, Sat, Sun
    $isWeekend = in_array($dayOfWeek, ['Sat', 'Sun']);

    // Helper to check running days
    function isTrainRunningOnDate($daysStr, $dayOfWeek, $isWeekend) {
        if (empty($daysStr)) return true;
        $daysStr = trim($daysStr);
        if ($daysStr === 'Daily') return true;
        if ($daysStr === 'Weekdays') return !$isWeekend;
        if ($daysStr === 'Weekends') return $isWeekend;
        // Check comma-separated tokens (e.g., 'Mon, Tue, Wed, Thu, Fri')
        $tokens = array_map('trim', explode(',', $daysStr));
        return in_array($dayOfWeek, $tokens);
    }

    // 1. DIRECT TRAIN SEARCH
    $directQuery = "
        SELECT 
            t.trainID,
            t.name AS trainName,
            t.type AS trainType,
            t.days,
            ts1.departuretime AS departureTime,
            ts2.arrivaltime AS arrivalTime,
            st_start.name AS startStationName,
            st_end.name AS endStationName,
            st_term.name AS terminalStationName,
            TIMEDIFF(ts2.arrivaltime, ts1.departuretime) AS rawDuration
        FROM trainstops ts1
        JOIN trainstops ts2 ON ts1.trainID = ts2.trainID
        JOIN train t ON t.trainID = ts1.trainID
        JOIN station st_start ON st_start.stationID = ts1.stationid
        JOIN station st_end ON st_end.stationID = ts2.stationid
        LEFT JOIN station st_term ON st_term.stationID = t.endStation
        WHERE ts1.stationid = :startStation 
          AND ts2.stationid = :endStation
          AND (
              ts1.departuretime < ts2.arrivaltime 
              OR (ts2.arrivaltime < ts1.departuretime) -- Overnight train
          )
        ORDER BY ts1.departuretime ASC
    ";

    $stmt = $db->prepare($directQuery);
    $stmt->execute([
        ':startStation' => $startStation,
        ':endStation' => $endStation
    ]);
    $rawDirect = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $directItineraries = [];
    foreach ($rawDirect as $tr) {
        if (!isTrainRunningOnDate($tr['days'], $dayOfWeek, $isWeekend)) {
            continue;
        }

        // Calculate clean duration
        $depSec = strtotime("1970-01-01 " . $tr['departureTime']);
        $arrSec = strtotime("1970-01-01 " . $tr['arrivalTime']);
        $isOvernight = false;
        if ($arrSec < $depSec) {
            $arrSec += 86400; // Next day arrival
            $isOvernight = true;
        }
        $diffSec = $arrSec - $depSec;
        $hours = floor($diffSec / 3600);
        $minutes = floor(($diffSec % 3600) / 60);
        $formattedDuration = "{$hours}h {$minutes}m";

        $directItineraries[] = [
            'type' => 'direct',
            'isOvernight' => $isOvernight,
            'totalDuration' => $formattedDuration,
            'legs' => [
                [
                    'trainID' => $tr['trainID'],
                    'trainName' => $tr['trainName'],
                    'trainType' => $tr['trainType'],
                    'departureStation' => $tr['startStationName'],
                    'departureTime' => substr($tr['departureTime'], 0, 5),
                    'arrivalStation' => $tr['endStationName'],
                    'arrivalTime' => substr($tr['arrivalTime'], 0, 5),
                    'terminalStation' => $tr['terminalStationName'],
                    'duration' => $formattedDuration,
                    'days' => $tr['days']
                ]
            ]
        ];
    }

    // 2. MULTI-LEG / TRANSFER SEARCH (Key Sri Lanka Railway Junctions)
    // Major transit hubs in Sri Lanka: Colombo Fort (102), Maradana (101), Ragama (425/424), Polgahawela (413), Maho (340), Peradeniya (406)
    $transitHubs = [102, 101, 413, 425, 406];
    $transferItineraries = [];

    // Only search transfers if direct results are few, or if user is searching cross-line routes
    $hubPlaceholders = implode(',', array_map('intval', $transitHubs));

    // Leg 1: startStation -> Hub
    $leg1Query = "
        SELECT 
            t.trainID,
            t.name AS trainName,
            t.type AS trainType,
            t.days,
            ts1.departuretime AS departureTime,
            ts2.arrivaltime AS arrivalTime,
            ts2.stationid AS hubStationID,
            st_start.name AS startStationName,
            st_hub.name AS hubStationName,
            st_term.name AS terminalStationName
        FROM trainstops ts1
        JOIN trainstops ts2 ON ts1.trainID = ts2.trainID
        JOIN train t ON t.trainID = ts1.trainID
        JOIN station st_start ON st_start.stationID = ts1.stationid
        JOIN station st_hub ON st_hub.stationID = ts2.stationid
        LEFT JOIN station st_term ON st_term.stationID = t.endStation
        WHERE ts1.stationid = :startStation 
          AND ts2.stationid IN ($hubPlaceholders)
          AND ts2.stationid != :startStation
          AND ts2.stationid != :endStation
        ORDER BY ts1.departuretime ASC
    ";

    $stmt1 = $db->prepare($leg1Query);
    $stmt1->execute([
        ':startStation' => $startStation,
        ':endStation' => $endStation
    ]);
    $leg1Results = $stmt1->fetchAll(PDO::FETCH_ASSOC);

    // Leg 2: Hub -> endStation
    $leg2Query = "
        SELECT 
            t.trainID,
            t.name AS trainName,
            t.type AS trainType,
            t.days,
            ts1.departuretime AS departureTime,
            ts2.arrivaltime AS arrivalTime,
            ts1.stationid AS hubStationID,
            st_hub.name AS hubStationName,
            st_end.name AS endStationName,
            st_term.name AS terminalStationName
        FROM trainstops ts1
        JOIN trainstops ts2 ON ts1.trainID = ts2.trainID
        JOIN train t ON t.trainID = ts1.trainID
        JOIN station st_hub ON st_hub.stationID = ts1.stationid
        JOIN station st_end ON st_end.stationID = ts2.stationid
        LEFT JOIN station st_term ON st_term.stationID = t.endStation
        WHERE ts1.stationid IN ($hubPlaceholders)
          AND ts2.stationid = :endStation
          AND ts1.stationid != :startStation
          AND ts1.stationid != :endStation
        ORDER BY ts1.departuretime ASC
    ";

    $stmt2 = $db->prepare($leg2Query);
    $stmt2->execute([
        ':endStation' => $endStation,
        ':startStation' => $startStation
    ]);
    $leg2Results = $stmt2->fetchAll(PDO::FETCH_ASSOC);

    // Pair matching Hub transfers
    $matchedTransfers = [];
    foreach ($leg1Results as $l1) {
        if (!isTrainRunningOnDate($l1['days'], $dayOfWeek, $isWeekend)) continue;

        $l1DepSec = strtotime("1970-01-01 " . $l1['departureTime']);
        $l1ArrSec = strtotime("1970-01-01 " . $l1['arrivalTime']);
        if ($l1ArrSec < $l1DepSec) $l1ArrSec += 86400;

        foreach ($leg2Results as $l2) {
            if ($l1['hubStationID'] != $l2['hubStationID']) continue;

            $l2DepSec = strtotime("1970-01-01 " . $l2['departureTime']);
            $l2ArrSec = strtotime("1970-01-01 " . $l2['arrivalTime']);
            if ($l2ArrSec < $l2DepSec) $l2ArrSec += 86400;

            $isOvernightLayover = false;
            $layoverSeconds = $l2DepSec - $l1ArrSec;

            // Same day transfer: layover must be >= 25 mins and <= 4 hours
            if ($layoverSeconds >= 1500 && $layoverSeconds <= 14400) {
                $isOvernightLayover = false;
            } 
            // Overnight transfer: L1 arrives in evening/night, L2 departs next morning (layover 4h to 16h)
            elseif ($layoverSeconds < 1500) {
                // Next day morning departure
                $nextDayL2DepSec = $l2DepSec + 86400;
                $overnightLayoverSec = $nextDayL2DepSec - $l1ArrSec;
                if ($overnightLayoverSec >= 14400 && $overnightLayoverSec <= 57600) {
                    $layoverSeconds = $overnightLayoverSec;
                    $isOvernightLayover = true;
                } else {
                    continue; // Infeasible layover
                }
            } else {
                continue;
            }

            // Format layover duration
            $layHours = floor($layoverSeconds / 3600);
            $layMins = floor(($layoverSeconds % 3600) / 60);
            $formattedLayover = "{$layHours}h {$layMins}m";

            // Total journey duration
            $totalSec = ($isOvernightLayover ? $l2ArrSec + 86400 : $l2ArrSec) - $l1DepSec;
            $totHours = floor($totalSec / 3600);
            $totMins = floor(($totalSec % 3600) / 60);

            $key = $l1['trainID'] . '_' . $l2['trainID'];
            if (isset($matchedTransfers[$key])) continue;
            $matchedTransfers[$key] = true;

            $transferItineraries[] = [
                'type' => 'transfer',
                'isOvernightLayover' => $isOvernightLayover,
                'layoverStation' => $l1['hubStationName'],
                'layoverDuration' => $formattedLayover,
                'layoverHours' => round($layoverSeconds / 3600, 1),
                'totalDuration' => "{$totHours}h {$totMins}m",
                'departureTime' => substr($l1['departureTime'], 0, 5),
                'arrivalTime' => substr($l2['arrivalTime'], 0, 5),
                'legs' => [
                    [
                        'legNumber' => 1,
                        'trainID' => $l1['trainID'],
                        'trainName' => $l1['trainName'],
                        'trainType' => $l1['trainType'],
                        'departureStation' => $l1['startStationName'],
                        'departureTime' => substr($l1['departureTime'], 0, 5),
                        'arrivalStation' => $l1['hubStationName'],
                        'arrivalTime' => substr($l1['arrivalTime'], 0, 5),
                        'terminalStation' => $l1['terminalStationName']
                    ],
                    [
                        'legNumber' => 2,
                        'trainID' => $l2['trainID'],
                        'trainName' => $l2['trainName'],
                        'trainType' => $l2['trainType'],
                        'departureStation' => $l2['hubStationName'],
                        'departureTime' => substr($l2['departureTime'], 0, 5),
                        'arrivalStation' => $l2['endStationName'],
                        'arrivalTime' => substr($l2['arrivalTime'], 0, 5),
                        'terminalStation' => $l2['terminalStationName']
                    ]
                ]
            ];
        }
    }

    // Limit transfer count to top 15 fastest
    usort($transferItineraries, function($a, $b) {
        return strcmp($a['departureTime'], $b['departureTime']);
    });
    $transferItineraries = array_slice($transferItineraries, 0, 15);

    echo json_encode([
        'success' => true,
        'searchDate' => $searchDate,
        'dayOfWeek' => $dayOfWeek,
        'directCount' => count($directItineraries),
        'transferCount' => count($transferItineraries),
        'direct' => $directItineraries,
        'transfers' => $transferItineraries
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error querying transit schedules.',
        'error' => $e->getMessage()
    ]);
}
