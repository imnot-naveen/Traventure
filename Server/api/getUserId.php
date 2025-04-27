<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Content-Type: application/json');

// Start session
session_start();

// Check if user ID is set in session
if (isset($_SESSION['userID'])) {
    echo json_encode([
        'success' => true,
        'userID' => $_SESSION['userID']
    ]);
} else {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'User not logged in'
    ]);
}
