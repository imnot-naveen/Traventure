<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers
header('Access-Control-Allow-Origin: *'); // Allow CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST'); // Allow only POST method
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// Include database and class files
include_once('../core/initialize.php');

$request = new RideRequests($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

if (
  !empty($data->clientID) &&
  !empty($data->destination) &&
  !empty($data->passengerCount) &&
  !empty($data->stationID) &&
  !empty($data->tripID) &&
  !empty($data->rideDate) 
){

      // Validate input data
      $clientID = htmlspecialchars(strip_tags($data->clientID));
      $passengerCount = htmlspecialchars(strip_tags($data->passengerCount));
      $destination = htmlspecialchars(strip_tags($data->destination));
      $stationID = htmlspecialchars(strip_tags($data->stationID));
      $tripID = htmlspecialchars(strip_tags($data->tripID));
      $rideDate = htmlspecialchars(strip_tags($data->rideDate));

      $result = $request->createRideRequest(
        $clientID,
        $passengerCount,
        $destination,
        $stationID,
        $tripID,
        $rideDate
      );

    // Check if booking was created successfully
    if ($result['success']) {
      http_response_code(201);
      echo json_encode($result);
    } else {
      http_response_code(503);
      echo json_encode($result);
    }

}else{
      http_response_code(400);
      $missingFields = array();

      if (empty($data->clientID)) $missingFields[] = 'clientID';
      if (empty($data->destination)) $missingFields[] = 'destination';
      if (empty($data->stationID)) $missingFields[] = 'stationID';
      if (empty($data->tripID)) $missingFields[] = 'tripID';
      if (empty($data->rideDate)) $missingFields[] = 'rideDate';

      echo json_encode(array(
        'success' => false,
        'message' => 'Unable to create booking. The following fields are required: ' . implode(', ', $missingFields)
    ));
}


