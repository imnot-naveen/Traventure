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

// Handle GET request for fetching ContentWriter data
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['cwid'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'CWID is required']);
        exit();
    }

    $cwid = $_GET['cwid'];
    $contentWriter = new contentWriter($db);
    $result = $contentWriter->getCWDetails($cwid);

    if ($result) {
        echo json_encode(['success' => true, 'data' => $result]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'CW not found']);
    }
    exit();
}

// Handle PUT request for updating CW data
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['cwid'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'CWID is required']);
        exit();
    }

    $contentWriter = new contentWriter($db);
    $contentWriter->cwid = $input['cwid'];
    $contentWriter->first_name = $input['first_name'] ?? null;
    $contentWriter->last_name = $input['last_name'] ?? null;
    $contentWriter->contact_number = $input['contact_number'] ?? null;

    $result = $contentWriter->updateCw();

    if ($result['success']) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'ContentWriter updated successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to update ContentWriter']);
    }
    exit();
}

// Default response for unsupported methods
http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Invalid request method']);
exit();
?>
