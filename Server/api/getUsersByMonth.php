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

$user = new User($db);

$data = $user->countUsersLastMonth();

if(!empty($data)){
  http_response_code(200);
  echo json_encode(['success' => true, 'data' => $data]);
}else{
  http_response_code(404);
  echo json_encode(['success' => false, 'message' => 'No User found for any month']);
}

