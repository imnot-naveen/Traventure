<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers
header('Access-Control-Allow-Origin: *'); // Allow CORS
header('Content-Type: application/json'); // JSON output

// Include database and TrainServiceProvider class
include_once('../core/initialize.php');

// Instantiate TrainServiceProvider object
$contentWriter = new contentWriter($db);

// Get the count of Train Service Providers
$count = $contentWriter->getRowCount();

// Output the count in JSON format
if ($count !== null) {
    http_response_code(200); // Success
    echo json_encode(['success' => true, 'count' => $count]);
} else {
    http_response_code(500); // Internal server error
    echo json_encode(['success' => false, 'message' => 'Failed to fetch count.']);
}
?>
