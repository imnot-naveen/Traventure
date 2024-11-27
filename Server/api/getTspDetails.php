<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers
header('Access-Control-Allow-Origin: *'); // Allow CORS
header('Content-Type: application/json');

// Include database and class files
include_once('../core/initialize.php');

// Check if `tspid` is provided in the query string
if (isset($_GET['tspid'])) {
    $tspid = htmlspecialchars(strip_tags($_GET['tspid']));

    // Instantiate TrainServiceProvider object
    $tsp = new TrainServiceProvider($db);

    // Fetch TSP details
    $result = $tsp->getTSPDetails($tspid);

    if ($result) {
        // Return success response with TSP data
        http_response_code(200);
        echo json_encode(['success' => true, 'data' => $result]);
    } else {
        // Return error response if no data found
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'TSP not found']);
    }
} else {
    // Return error response if tspid is not provided
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No TSP ID provided']);
}
?>
