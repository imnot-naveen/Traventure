<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET');
header('Content-Type: application/json');

// Include database and User class
include_once('../core/initialize.php');

// Instantiate database and user object
$user = new User($db);

if (isset($_GET['userid'])) {
  $userid = htmlspecialchars(strip_tags($_GET['userid']));

  $result = $user->getUserDetails($userid);

  if ($result) {
    http_response_code(200);
    echo json_encode(['success' => true, 'data' => $result]);
  } else {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'User Not Found!']);
  }
} else {
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'User ID Not Provided!']);
}
