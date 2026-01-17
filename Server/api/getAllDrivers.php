<?php
// Enable error reporting (for development)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers for CORS and JSON
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Content-Type: application/json');

// Include initialization and driver class
include_once('../core/initialize.php');

// Create driver object
$driver = new Driver($db);

// Call getAllDrivers method
$result = $driver->getAllDrivers();

if ($result['success']) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $result['data']
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $result['message']
    ]);
}
?>
