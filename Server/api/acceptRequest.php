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

// Handle only PUT requests
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['username']) || !isset($input['requestID'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'username and requestID are required']);
        exit();
    }

    $username = $input['username'];
    $requestID = $input['requestID'];

    // Load model and call method
    $rideRequest = new RideRequests($db);
    $result = $rideRequest->updateRequestStatus($username, $requestID);

    if ($result['success']) {
        http_response_code(200);
        echo json_encode($result);
    } else {
        http_response_code(500);
        echo json_encode($result);
    }
    exit();
}

// Invalid method
http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Invalid request method']);
exit();
