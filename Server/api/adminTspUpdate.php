<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Include dependencies
include_once('../core/initialize.php');

// Check if the request method is PUT
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'message' => 'Invalid request method. Use PUT.']);
    exit();
}

// Decode input JSON data
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data.']);
    exit();
}

// Validate required fields
if (empty($input['tspid'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'TSPID is required.']);
    exit();
}

// Instantiate TSP object
$tsp = new TrainServiceProvider($db);

// Set TSP properties
$tsp->tspid = $input['tspid'];
$tsp->first_name = $input['first_name'] ?? null;
$tsp->last_name = $input['last_name'] ?? null;
$tsp->contact_number = $input['contact_number'] ?? null;

// Call the update method
$result = $tsp->updateTsp();

if ($result['success']) {
    http_response_code(200); // Success
    echo json_encode(['success' => true, 'message' => $result['message']]);
} else {
    http_response_code(500); // Internal Server Error
    echo json_encode(['success' => false, 'message' => $result['message']]);
}
?>
