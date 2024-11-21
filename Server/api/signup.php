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

// Instantiate person object
$person = new Person($db);

// Get raw posted data
$data = json_decode(file_get_contents("php://input"));

// Check if data is valid
if (!isset($data->username, $data->first_name, $data->last_name, $data->email, $data->contact_number, $data->password, $data->user_type)) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid input']);
    exit();
}

// Set properties
$person->username = $data->username;
$person->first_name = $data->first_name;
$person->last_name = $data->last_name;
$person->email = $data->email;
$person->contact_number = $data->contact_number;
$person->password = $data->password;
$person->user_type = $data->user_type;
// Execute signup
$result = $person->signup();
http_response_code($result['success'] ? 200 : 400); // Set appropriate HTTP status code
echo json_encode($result);
?>