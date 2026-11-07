<?php
declare(strict_types=1);

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
require_once('../core/TransitRouter.php');

try {
    $rawInput = file_get_contents("php://input");
    $data = json_decode($rawInput, true);

    $startStation = isset($data['startStation']) ? (int)$data['startStation'] : null;
    $endStation = isset($data['endStation']) ? (int)$data['endStation'] : null;
    $searchDate = $data['searchDate'] ?? date('Y-m-d');

    if (!$startStation || !$endStation) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Please provide start and end stations.']);
        exit();
    }

    $timestamp = strtotime($searchDate);
    $dayOfWeek = date('D', $timestamp);
    $isWeekend = in_array($dayOfWeek, ['Sat', 'Sun'], true);

    $router = new TransitRouter($db);

    // 1. Direct Trains via TransitRouter
    $directTrains = $router->findDirectTrains($startStation, $endStation, $searchDate);
    $directItineraries = [];
    foreach ($directTrains as $dt) {
        $directItineraries[] = [
            'type' => 'direct',
            'isOvernight' => $dt['isOvernight'],
            'totalDuration' => $dt['duration'],
            'legs' => [
                [
                    'trainID' => $dt['trainID'],
                    'trainName' => $dt['trainName'],
                    'trainType' => $dt['trainType'],
                    'departureStation' => $dt['departureStation'],
                    'departureTime' => $dt['departureTime'],
                    'arrivalStation' => $dt['arrivalStation'],
                    'arrivalTime' => $dt['arrivalTime'],
                    'terminalStation' => $dt['terminalStation'],
                    'duration' => $dt['duration'],
                    'days' => $dt['days']
                ]
            ]
        ];
    }

    // 2. Multi-Leg Transfers across major railway transit hubs
    // Hubs: Colombo Fort (102), Maradana (101), Polgahawela (413), Ragama (425), Peradeniya (406)
    $transitHubs = [102, 101, 413, 425, 406];
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

    $transferItineraries = [];
    $matchedTransfers = [];

    foreach ($leg1Results as $l1) {
        if (!$router->isTrainRunning($l1['days'] ?? '', $dayOfWeek, $isWeekend)) {
            continue;
        }

        $l1DepSec = (int)strtotime("1970-01-01 " . $l1['departureTime']);

        foreach ($leg2Results as $l2) {
            if ($l1['hubStationID'] != $l2['hubStationID']) {
                continue;
            }

            if (!$router->isTrainRunning($l2['days'] ?? '', $dayOfWeek, $isWeekend)) {
                continue;
            }

            // Utilize evaluateTransfer()
            $eval = $router->evaluateTransfer($l1['arrivalTime'], $l2['departureTime']);
            if ($eval === null) {
                continue;
            }

            $key = $l1['trainID'] . '_' . $l2['trainID'];
            if (isset($matchedTransfers[$key])) {
                continue;
            }
            $matchedTransfers[$key] = true;

            $l2ArrSec = (int)strtotime("1970-01-01 " . $l2['arrivalTime']);
            $totalSec = ($eval['isOvernight'] ? $l2ArrSec + 86400 : $l2ArrSec) - $l1DepSec;
            if ($totalSec < 0) {
                $totalSec += 86400;
            }

            $transferItineraries[] = [
                'type' => 'transfer',
                'isOvernightLayover' => $eval['isOvernight'],
                'layoverStation' => $l1['hubStationName'],
                'layoverDuration' => $eval['layoverFormatted'],
                'layoverHours' => round($eval['layoverSeconds'] / 3600, 1),
                'totalDuration' => $router->formatDuration($totalSec),
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

    // Sort by departure time and limit results
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
