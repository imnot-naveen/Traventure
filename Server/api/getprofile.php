<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Content-Type: application/json');

// Include database and person class files
include_once('../core/initialize.php');

// Start the session
session_start();

// Instantiate person object
$person = new Person($db);

// Check if the username is stored in the session
if (!isset($_SESSION['username'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Username is required.'
    ]);
    exit();
}

// Set the username from the session
$person->username = $_SESSION['username'];

// Execute the getUserProfile method and get the result
$profileData = $person->getUserProfile($person->username);

// Check if the profile data is found
if ($profileData) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $profileData
    ]);
} else {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => 'User not found.'
    ]);
}

exit;
?>
