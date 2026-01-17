<?php
// Required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Include database and fare model files
include_once('../core/initialize.php');


// Initialize fare object
$fare = new Fare($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Check if data is complete
if (
    !empty($data->class) &&
    !empty($data->base_fare) &&
    !empty($data->per_km_rate)
) {
    // Call the updateFare method
    $result = $fare->updateFare($data->class, $data->base_fare, $data->per_km_rate);
    
    // Send response
    http_response_code(200);
    echo json_encode($result);
} else {
    // If data is incomplete
    http_response_code(400);
    echo json_encode(array(
        "success" => false,
        "message" => "Unable to update fare. Data is incomplete."
    ));
}
?>