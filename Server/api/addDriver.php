<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers for CORS and response format
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');

// Include necessary files
include_once('../core/initialize.php');

// Instantiate the Driver object
$driver = new Driver($db);

// Get the raw posted data
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
if (
    isset($data['username']) &&
    isset($data['firstName']) &&
    isset($data['lastName']) &&
    isset($data['email']) &&
    isset($data['IDNumber']) &&
    isset($data['contactNumber']) &&
    isset($data['password']) &&
    isset($data['assignedStation']) &&
    isset($data['maxPassengers']) &&
    isset($data['vehicleID']) &&
    isset($data['license']) &&
    isset($data['vehicleType'])
) {
    // Assign data to the Driver object
    $driver->username = $data['username'];
    $driver->first_name = $data['firstName'];
    $driver->last_name = $data['lastName'];
    $driver->email = $data['email'];
    $driver->contact_number = $data['contactNumber'];
    $driver->id_number = $data['IDNumber'];
    $driver->password = $data['password'];
    $driver->assigned_station = $data['assignedStation'];
    $driver->availability = 'Available';
    $driver->vehicleID = $data['vehicleID'];
    $driver->license = $data['license'];
    $driver->maxPassengers = $data['maxPassengers'];
    $driver->vehicleType = $data['vehicleType'];
    $driver->status = 'Active';
    $driver->userType = 'Driver';

    $result = $driver->registerDriver();

    if ($result['success']) {
        http_response_code(201);
        echo json_encode($result);
    } else {
        http_response_code(500);
        echo json_encode($result);
    }
} else {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Incomplete data provided. Please provide all required fields.'
    ]);
}
?>
