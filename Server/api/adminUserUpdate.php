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

// Handle GET request for fetching user data
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['userid'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'userID is required']);
        exit();
    }

    $userid = $_GET['userid'];
    $user = new User($db); 
    $result = $user->getUserById($userid);

    if ($result) {
        echo json_encode(['success' => true, 'data' => $result]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'user not found']);
    }
    exit();
}

// Handle PUT request for updating user data
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['userid'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'userID is required']);
        exit();
    }

    $user = new User($db);
    $user->userid = $input['userid'];
    $user->first_name = $input['first_name'] ?? null;
    $user->last_name = $input['last_name'] ?? null;
    $user->contact_number = $input['contact_number'] ?? null;

    $result = $user->updateRegisteredUser();

    if ($result['success']) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'user updated successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to update user']);
    }
    exit();
}

// Default response for unsupported methods
http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Invalid request method']);
exit();
?>
