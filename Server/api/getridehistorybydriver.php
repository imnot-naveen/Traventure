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

session_start();
if (isset($_SESSION['username'])) {
    $username = $_SESSION['username'];
} elseif (isset($_GET['username'])) {
    // Fallback for manual testing
    $username = htmlspecialchars(strip_tags($_GET['username']));
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Username not provided']);
    exit;
}

$request = new RideRequests($db);
$data = $request->getRidehistorybyDriver($username);

if ($data['success']) {
    http_response_code(200);
    echo json_encode(['success' => true, 'data' => $data['data']]);
} else {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => $data['message']]);
}
