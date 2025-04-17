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

// Handle GET request to fetch user data
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['userid'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'UserID is required']);
        exit();
    }

    $userid = $_GET['userid'];
    $user = new User($db);
    $result = $user->getUserById($userid);

    if ($result) {
        echo json_encode(['success' => true, 'data' => $result]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User not found']);
    }
    exit();
}

// Handle PUT request to update user data
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);

    // Check if all required fields are available in the request body
    if (!isset($input['userid']) || !isset($input['first_name']) || !isset($input['last_name']) || !isset($input['email']) || !isset($input['contact_number'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit();
    }

    // Get the data from the request body
    $userid = $input['userid'];
    $first_name = $input['first_name'];
    $last_name = $input['last_name'];
    $email = $input['email'];
    $contact_number = $input['contact_number'];

    // Create a User object and update user by ID
    $user = new User($db);
    $result = $user->updateUserById($userid, $first_name, $last_name, $email, $contact_number);

    if ($result['success']) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'User updated successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to update user']);
    }
    exit();
}

// Default for unsupported methods
http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Invalid request method']);
exit();
