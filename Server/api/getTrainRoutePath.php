<?php
declare(strict_types=1);

// Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once('../core/initialize.php');

try {
    $trainID = isset($_GET['trainID']) ? (int)$_GET['trainID'] : null;

    if (!$trainID) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Please provide a valid trainID.']);
        exit();
    }

    // Load coordinates map from public/station_coordinates.json
    $geoFilePath = dirname(__DIR__, 2) . '/public/station_coordinates.json';
    $coordsMap = [];
    if (file_exists($geoFilePath)) {
        $geoList = json_decode(file_get_contents($geoFilePath), true) ?: [];
        foreach ($geoList as $g) {
            $coordsMap[(int)$g['stationID']] = [
                'lat' => $g['lat'],
                'lng' => $g['lng']
            ];
        }
    }

    // Query train information
    $trainStmt = $db->prepare("
        SELECT t.trainID, t.name, t.type, t.days,
               st_start.name AS startStationName,
               st_end.name AS endStationName
        FROM train t
        LEFT JOIN station st_start ON st_start.stationID = t.startStation
        LEFT JOIN station st_end ON st_end.stationID = t.endStation
        WHERE t.trainID = :trainID
        LIMIT 1
    ");
    $trainStmt->execute([':trainID' => $trainID]);
    $train = $trainStmt->fetch(PDO::FETCH_ASSOC);

    if (!$train) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Train not found.']);
        exit();
    }

    // Query ordered stops
    $stopsStmt = $db->prepare("
        SELECT ts.stationid AS stationID,
               s.name AS stationName,
               s.city,
               ts.arrivaltime AS arrivalTime,
               ts.departuretime AS departureTime
        FROM trainstops ts
        JOIN station s ON s.stationID = ts.stationid
        WHERE ts.trainID = :trainID
        ORDER BY ts.departuretime ASC
    ");
    $stopsStmt->execute([':trainID' => $trainID]);
    $rawStops = $stopsStmt->fetchAll(PDO::FETCH_ASSOC);

    $stops = [];
    $waypoints = []; // GeoJSON coordinate pairs: [lng, lat] for Leaflet / GIS

    foreach ($rawStops as $s) {
        $stId = (int)$s['stationID'];
        $hasCoords = isset($coordsMap[$stId]);
        $lat = $hasCoords ? $coordsMap[$stId]['lat'] : null;
        $lng = $hasCoords ? $coordsMap[$stId]['lng'] : null;

        if ($hasCoords) {
            $waypoints[] = [$lat, $lng];
        }

        $stops[] = [
            'stationID' => $stId,
            'stationName' => $s['stationName'],
            'city' => $s['city'],
            'arrivalTime' => substr($s['arrivalTime'], 0, 5),
            'departureTime' => substr($s['departureTime'], 0, 5),
            'lat' => $lat,
            'lng' => $lng
        ];
    }

    echo json_encode([
        'success' => true,
        'train' => [
            'trainID' => (int)$train['trainID'],
            'name' => $train['name'],
            'type' => $train['type'],
            'days' => $train['days'],
            'startStation' => $train['startStationName'],
            'endStation' => $train['endStationName']
        ],
        'stopsCount' => count($stops),
        'waypoints' => $waypoints,
        'stops' => $stops
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error fetching train route.', 'error' => $e->getMessage()]);
}

