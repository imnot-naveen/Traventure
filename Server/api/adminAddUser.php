<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers
header('Access-Control-Allow-Origin: *'); // Allow CORS
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');

// Include database and user class
include_once('../core/initialize.php');

// Instantiate user object
$user = new Person($db);

// Get the raw posted data
$data = json_decode(file_get_contents("php://input"), true);

// Check if required data is provided
if (
    isset($data['username']) &&
    isset($data['firstName']) &&
    isset($data['lastName']) &&
    isset($data['email']) &&
    isset($data['contactNumber'])
) {
    // Set user properties
    $user->username = $data['username'];
    $user->first_name = $data['firstName'];
    $user->last_name = $data['lastName'];
    $user->email = $data['email'];
    $user->contact_number = $data['contactNumber'];

    // Save the user
    if ($user->createUser()) {
        http_response_code(201); // Created
        echo json_encode(['success' => true, 'message' => 'User created successfully.']);
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(['success' => false, 'message' => 'Failed to create user.']);
    }
} else {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Incomplete data provided.']);
}
?>
