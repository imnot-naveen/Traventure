<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers
header('Access-Control-Allow-Origin: *'); // Allow CORS
header('Content-Type: application/json'); // JSON output

// Include database and Booking class
include_once('../core/initialize.php');

// Instantiate Booking object
$booking = new Bookings($db);

// Get the revenue for last month
$revenueData = $booking->getBookingRevenueforMonth();

// Output the revenue in JSON format
if ($revenueData['success']) {
    http_response_code(200); // Success
    echo json_encode(['success' => true, 'revenue' => $revenueData['revenue']]);
} else {
    http_response_code(500); // Internal server error
    echo json_encode(['success' => false, 'message' => $revenueData['message']]);
}
?>
