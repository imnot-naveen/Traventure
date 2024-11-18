<?php
// Enable error reporting 
ini_set('display_errors', 1); 
ini_set('display_startup_errors', 1); 
error_reporting(E_ALL);  

// Headers 
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: POST'); 
header('Content-Type: application/json');  

// Start the session
session_start();

// Check if the user is logged in
if (isset($_SESSION['username'])) {
    // Destroy the session
    session_destroy();
    
    // Send a success response
    echo json_encode([
        'success' => true,
        'message' => 'Logged out successfully'
    ]);
} else {
    // User is not logged in
    echo json_encode([
        'success' => false,
        'message' => 'No user is logged in'
    ]);
}
exit;
?>