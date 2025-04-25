<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, GET');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Include dependencies
include_once('../core/initialize.php');

// Handle GET request for fetching driver data
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID is required']);
        exit();
    }

    $id = $_GET['id'];
    $driver = new driver($db);
    $result = $driver->getDriverDetailsByID($id);

    if ($result) {
        echo json_encode(['success' => true, 'data' => $result]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Driver not found']);
    }
    exit();
}

// Handle PUT request for updating Driver data
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID is required']);
        exit();
    }

    $driver = new Driver($db);
    $driver->id = $input['id'];
    $driver->first_name = $input['first_name'] ?? null;
    $driver->last_name = $input['last_name'] ?? null;
    $driver->contact_number = $input['contact_number'] ?? null;

    $result = $driver->updateDriver();

    if ($result['success']) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'driver updated successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to update driver']);
    }
    exit();
}

// Default response for unsupported methods
http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Invalid request method']);
exit();
?>
