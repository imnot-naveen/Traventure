<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Include database and class files
include_once('../core/initialize.php');

// Check if `userID` is provided in the query string
if (isset($_GET['userID'])) {
    $userID = htmlspecialchars(strip_tags($_GET['userID']));

    // Instantiate booking object
    $booking = new Bookings($db);

    // Fetch booking details by user ID 
    $result = $booking->getBookingsByUserID($userID);

    if ($result['success']) {
        http_response_code(200);
        echo json_encode(['success' => true, 'data' => $result['data']]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => $result['message']]);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No User ID provided']);
}
?>
