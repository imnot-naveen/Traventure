<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers
header('Access-Control-Allow-Origin: *'); // Allow CORS
header('Access-Control-Allow-Methods: PUT');
header('Content-Type: application/json');

// Include database and TSP class
include_once('../core/initialize.php');

// Instantiate TSP object
$driver = new Driver($db);

// Get the raw posted data
$data = json_decode(file_get_contents("php://input"), true);

// Check if required data is provided
if (isset($data['id']) && isset($data['status'])) {
    // Validate input for `status`
    $validStatuses = ['active', 'inactive'];
    if (!in_array($data['status'], $validStatuses)) {
        http_response_code(400); // Bad Request
        echo json_encode(['success' => false, 'message' => 'Invalid status provided. Valid values are "active" or "inactive".']);
        exit;
    }

    // Set driver properties
    $id = $data['id'];
    $status = $data['status'];

    // Update status
    if ($driver->updateStatus($id, $status)) {
        http_response_code(200); // OK
        echo json_encode(['success' => true, 'message' => 'Status updated successfully.']);
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(['success' => false, 'message' => 'Failed to update status.']);
    }
} else {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Incomplete data provided.']);
}
