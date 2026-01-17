<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../core/initialize.php';

$request = new RideRequests($db);

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method"
    ]);
    exit();
}

// Parse the incoming data
$data = json_decode(file_get_contents("php://input"));
if (!$data) {
    echo json_encode(["success" => false, "message" => "Empty or invalid JSON body."]);
    exit();
}

// Process the request
if (!empty($data->requestID) && isset($_SESSION['username'])) {
    $username = $_SESSION['username'];
    $requestID = $data->requestID;

    // Call the updated method that now includes email functionality
    $result = $request->updateRequestStatus($username, $requestID);

    if ($result['success']) {
        http_response_code(200);
        
        // Include email sending status in the response
        $response = [
            "success" => true, 
            "message" => $result['message']
        ];
        
        // Add email status information if available
        if (isset($result['emailSent'])) {
            $response['emailSent'] = $result['emailSent'];
            $response['emailMessage'] = $result['emailMessage'] ?? '';
        }
        
        echo json_encode($response);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => $result['message']]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Missing request ID or not logged in."
    ]);
}
?>