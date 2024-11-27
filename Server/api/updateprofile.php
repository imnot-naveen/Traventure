<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers
header('Access-Control-Allow-Origin: *'); //CORS
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');

// Include database and person class
include_once('../core/initialize.php');
session_start(); // Start session to verify logged-in user

// Instantiate person object
$person = new Person($db);

// Get raw posted data
$data = json_decode(file_get_contents("php://input"));

//Check if user is logged in
if (!isset($_SESSION['username'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized: Please log in.']);
    exit();
}

// Validate input
if (!isset($data->firstName, $data->lastName, $data->email, $data->contactNo)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit();
}

// Set properties
$person->username = $_SESSION['username'];
$person->first_name = $data->firstName;
$person->last_name = $data->lastName;
$person->email = $data->email;
$person->contact_number = $data->contactNo;

// Execute profile update
$result = $person->updateProfile();
http_response_code($result['success'] ? 200 : 400);
echo json_encode($result);
?>