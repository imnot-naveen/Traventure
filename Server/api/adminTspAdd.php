<?php
// Enable error reporting for debugging purposes
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers for CORS and response format
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');

// Include necessary files
include_once('../core/initialize.php');

// Instantiate the TSP object
$tsp = new TrainServiceProvider($db);

// Get the raw posted data
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
if (
    isset($data['tspid']) &&
    isset($data['username']) &&
    isset($data['firstName']) &&
    isset($data['lastName']) &&
    isset($data['IDNumber']) &&
    isset($data['email']) &&
    isset($data['contactNumber']) &&
    isset($data['password'])
) {
    // Assign data to the TSP object
    $tsp->tspid = $data['tspid'];
    $tsp->username = $data['username'];
    $tsp->first_name = $data['firstName'];
    $tsp->id_number = $data['IDNumber'];
    $tsp->last_name = $data['lastName'];
    $tsp->email = $data['email'];
    $tsp->contact_number = $data['contactNumber'];
    $tsp->password = $data['password'];

    // Set default userType
    $tsp->userType = 'tsp';

    // Call the `registerTSP` method
    $result = $tsp->registerTSP();

    // Check the result
    if ($result['success']) {
        http_response_code(201); // Created
        echo json_encode($result);
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode($result);
    }
} else {
    // Missing required fields
    http_response_code(400); // Bad Request
    echo json_encode([
        'success' => false,
        'message' => 'Incomplete data provided. Please provide all required fields.'
    ]);
}
?>
