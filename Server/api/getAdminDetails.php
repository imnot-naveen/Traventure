<?php
// Enable error reporting (only during development)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers
header('Access-Control-Allow-Origin: *'); 
header('Content-Type: application/json');

// Include database and class files
include_once('../core/initialize.php');

// Check if `username` is provided in the query string
if (isset($_GET['username'])) {
    $username = htmlspecialchars(strip_tags($_GET['username']));

    // Instantiate Admin object
    $admin = new Admin($db);

    // Fetch admin details
    $result = $admin->getAdminDetails($username);

    if ($result) {
        // Return success response with admin data
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => $result
        ]);
    } else {
        // Return error response if no data found
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Admin not found for the given username.'
        ]);
    }
} else {
    // Return error response if username is not provided
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'No username provided.'
    ]);
}
?>
