<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');

// Include database and user class
include_once('../core/initialize.php');

// Instantiate user object
$contentWriter = new contentWriter($db);

// Get the raw posted data
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
if (
  isset($data['username']) &&
  isset($data['firstName']) &&
  isset($data['lastName']) &&
  isset($data['IDNumber']) &&
  isset($data['email']) &&
  isset($data['contactNumber']) &&
  isset($data['password'])
) {
  // Assign data to the CW object  
  $contentWriter->username = $data['username'];
  $contentWriter->first_name = $data['firstName'];
  $contentWriter->last_name = $data['lastName'];
  $contentWriter->id_number = $data['IDNumber'];
  $contentWriter->email = $data['email'];
  $contentWriter->contact_number = $data['contactNumber'];
  $contentWriter->password = $data['password'];

  // Set default userType
  $contentWriter->userType = 'CW';

  // Call the `registerTSP` method
  $result = $contentWriter->registerCW();

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
