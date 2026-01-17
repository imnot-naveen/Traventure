<?php
// Enable error reporting for development
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set headers for cross-origin resource sharing and JSON response
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Content-Type: application/json');

// Start the session
session_start();

// Debugging: Output session data to ensure it's being set correctly
// Uncomment this line for debugging purposes
// var_dump($_SESSION);

// Check if the username is set in the session
if (isset($_SESSION['username'])) {
    // Return a JSON response with the username
    echo json_encode([
        'success' => true,
        'username' => $_SESSION['username']
    ]);
} else {
    // Return a 401 Unauthorized error if the session username is not found
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'User not logged in'
    ]);
}
?>
