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

// Get year and month from query parameters, default to current year and month
$year = isset($_GET['year']) ? (int)$_GET['year'] : date('Y');
$month = isset($_GET['month']) ? (int)$_GET['month'] : date('m');

// Validate year and month
if ($year < 1900 || $year > date('Y') || $month < 1 || $month > 12) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid year or month.'
    ]);
    exit();
}

// Instantiate Bookings object
$booking = new Bookings($db);

// Fetch bookings for the specified year and month
$result = $booking->getBookingsByMonth($year, $month);

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
?>
