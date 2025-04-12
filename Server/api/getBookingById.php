<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers
header('Access-Control-Allow-Origin: *'); // Allow CORS
header('Content-Type: application/json');

// Include database and class files
include_once('../core/initialize.php');

// Check if `bookingID` is provided in the query string
if (isset($_GET['id'])) {
    $bookingID = htmlspecialchars(strip_tags($_GET['id']));

    // Instantiate booking object
    $booking = new Bookings($db);

    // Fetch booking details
    $result = $booking->getBookingByID($bookingID);

    if ($result['success']) {
        // Return success response with booking data
        http_response_code(200);
        echo json_encode(['success' => true, 'data' => $result['data']]);
    } else {
        // Return error response if no data found
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => $result['message']]);
    }
} else {
    // Return error response if bookingID is not provided
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No Booking ID provided']);
}
?>
