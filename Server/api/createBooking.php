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

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode([
        'success' => false,
        'message' => 'Only POST method is allowed'
    ]);
    exit;
}

// Check if `user_id` is provided in the query parameter
if (!isset($_GET['user_id'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'user_id is required as a query parameter'
    ]);
    exit;
}

$user_id = htmlspecialchars(strip_tags($_GET['user_id']));

// Get raw input data (JSON body)
$data = json_decode(file_get_contents("php://input"), true);

// Check if `no_of_passengers` is provided in the body
if (!isset($data['no_of_passengers'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'no_of_passengers is required in the request body'
    ]);
    exit;
}

$no_of_passengers = htmlspecialchars(strip_tags($data['no_of_passengers']));

// Validate `no_of_passengers` (ensure it's a positive integer)
if (!filter_var($no_of_passengers, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid number of passengers'
    ]);
    exit;
}

// Instantiate Booking object
$booking = new Booking($db);

// Set booking properties
$booking->payment_status = 'Pending'; // Example: Set default payment status
$booking->no_of_passengers = $no_of_passengers;

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
?>
