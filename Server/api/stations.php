<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Include core initialization and required files
include_once('../core/initialize.php');
include_once('../core/Train.php');

// Instantiate Train class
$train = new Train($db);

// Handle GET request
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['routeName'])) {
    $routeName = htmlspecialchars($_GET['routeName']); // Sanitize input

    // Fetch stations for the given route
    try {
        $stations = $train->getStationsForRoute($routeName);
        
        if (!empty($stations)) {
            echo json_encode($stations); // Return stations as JSON
        } else {
            echo json_encode(['message' => 'No stations found for this route.']);
        }
    } catch (Exception $e) {
        http_response_code(500); // Internal Server Error
        echo json_encode(value: ['message' => 'Error fetching stations.', 'error' => $e->getMessage()]);
    }
} else {
    // Invalid request handling
    http_response_code(400); // Bad Request
    echo json_encode(['message' => 'Invalid request. Please specify a valid route name.']);
}
?>
