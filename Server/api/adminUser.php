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

// Fetch all persons
$result = $person->getAllPersons();

// Check if records are found
if ($result) {
    http_response_code(200); // Success
    echo json_encode(['success' => true, 'data' => $result]);
} else {
    http_response_code(404); // No data found
    echo json_encode(['success' => false, 'message' => 'No persons found.']);
}

?>