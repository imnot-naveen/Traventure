<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers
header('Access-Control-Allow-Origin: *'); 
header('Content-Type: application/json'); 

// Include database and User class
include_once('../core/initialize.php');

// Instantiate User object
$user = new User($db);

// Get the count of Train Service Providers
$count = $user->countUsers();

// Output the count in JSON format
if ($count !== null) {
    http_response_code(200); 
    echo json_encode(['success' => true, 'count' => $count]);
} else {
    http_response_code(500); 
    echo json_encode(['success' => false, 'message' => 'Failed to fetch count.']);
}
?>
