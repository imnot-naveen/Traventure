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

// Check if `driverid` is provided in the query string
if (isset($_GET['driverID'])) {
    $driverID = htmlspecialchars(strip_tags($_GET['driverID']));

    // Instantiate Driver object
    $driver = new Driver($db);

    // Fetch Driver details
    $result = $driver->getDriverDetailsByID($driverID);

    if ($result) {
        // Return success response with Driver data
        http_response_code(200);
        echo json_encode(['success' => true, 'data' => $result]);
    } else {
        // Return error response if no data found
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Driver not found']);
    }
} else {
    // Return error response if Driverid is not provided
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No Driver ID provided']);
}
?>
