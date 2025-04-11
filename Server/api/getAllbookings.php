<?php
// Enable error reporting (for development only)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET');
header('Content-Type: application/json');

// Include core initialization 
include_once('../core/initialize.php');

// Instantiate Bookings object
$booking = new Bookings($db);

// Fetch all bookings
$result = $booking->getAllBookings();

// Return response
if ($result['success'] && !empty($result['data'])) {
    http_response_code(200);
    echo json_encode(['success' => true, 'data' => $result['data']]);
} else {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => $result['message'] ?? 'No bookings found.'
    ]);
}
