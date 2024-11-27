<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once('../core/initialize.php');
include_once('../core/Train.php');

$train = new Train($db);

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['routeName']) && isset($_GET['startStation']) && isset($_GET['endStation'])) {
    $routeName = htmlspecialchars($_GET['routeName']); // Get route name from the request
    $startStation = htmlspecialchars($_GET['startStation']);
    $endStation = htmlspecialchars($_GET['endStation']);

    try {
        // Fetch all stations for the route
        $stations = $train->getStationsForRoute($routeName); // Fetch stations based on the route name

        // Find the indices of start and end stations
        $startIndex = array_search($startStation, array_column($stations, 'stationID'));
        $endIndex = array_search($endStation, array_column($stations, 'stationID'));

        // Validate indices and get train stops
        if ($startIndex !== false && $endIndex !== false && $startIndex < $endIndex) {
            $trainStops = array_slice($stations, $startIndex, $endIndex - $startIndex + 1);
            echo json_encode($trainStops);
        } else {
            echo json_encode([]); // No train stops found
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Error fetching train stops.', 'error' => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid request.']);
}
?>