<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET');
header('Content-Type: application/json');

// Include core initialization 
include_once('../core/initialize.php');

// Instantiate User object
$user = new User($db);

// Fetch user growth
$data = $user->countUsersLast24Hours();

if (!empty($data)) {
  http_response_code(200);
  echo json_encode(['success' => true, 'data' => $data]);
} else {
  http_response_code(404);
  echo json_encode(['success' => false, 'message' => 'No users found in last 24h']);
}