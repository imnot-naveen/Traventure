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

// Check if `user_id` is provided in the query string
if (isset($_GET['user_id'])) {
    $user_id = htmlspecialchars(strip_tags($_GET['user_id']));

    // Instantiate Booking object
    $booking = new Booking($db);

    // Set other booking properties (e.g., for testing purposes)
    $booking->no_of_passengers = 3; // Example: You can replace this with dynamic input
    $booking->payment_status = 'Pending'; // Example: Set default payment status

    // Create a booking
    $result = $booking->createBooking($user_id);

    // Check the result of booking creation
    if ($result['success']) {
        // Return success response with booking data
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => $result['message'],
            'booking_id' => $result['booking_id'] ?? null // Include booking ID if available
        ]);
    } else {
        // Return error response with failure message
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => $result['message']
        ]);
    }
} else {
    // Return error response if `user_id` is not provided
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'No user ID provided'
    ]);
}
?>
