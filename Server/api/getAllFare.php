<?php
// Enable error reporting (for development only)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers
header('Access-Control-Allow-Origin: *'); // Enable CORS
header('Access-Control-Allow-Methods: GET');
header('Content-Type: application/json');

// Include database and User class
include_once('../core/initialize.php');

$fare = new Fare($db);

$result = $fare->getFare();

// Check if records are found
if ($result && !empty($result)) {
  http_response_code(200); 
  echo json_encode(['success' => true, 'data' => $result]);
} else {
  http_response_code(404); 
  echo json_encode(['success' => false, 'message' => 'No fare found.']);
}
?>