<?php
// Include database and other necessary files
require_once '../core/initialize.php';
require_once '../stripe-php-master/init.php';
\Stripe\Stripe::setApiKey('sk_test_51RCy68QwgaoFWhBRwdHxXBnm0PfR48XwhFFjstKkrsehntGXk841cmi7tswvHn9n2NDOiwQ7f0IoguWf7V2LyZfl00fs5vEnlm');

header('Content-Type: application/json');

// Retrieve and decode incoming JSON data
$input = json_decode(file_get_contents("php://input"), true);
$amount = $input['amount'] ?? 0;
$tripID = $input['tripID'] ?? null;
$bookingID = $input['bookingID'] ?? null;

try {
    // Validate required parameters
    if (!$bookingID || !$tripID) {
        throw new Exception('Missing required parameters: bookingID and tripID are required.');
    }
    
    // Update the booking status to "Processing Payment"
    $updateBookingQuery = "UPDATE booking SET paymentStatus = 'Processing Payment' WHERE bookingID = :bookingID";
    $updateStmt = $db->prepare($updateBookingQuery);
    $updateStmt->bindParam(':bookingID', $bookingID);
    
    if (!$updateStmt->execute()) {
        throw new Exception('Failed to update booking status.');
    }
    
    // Create Stripe checkout session with metadata to track booking
    $session = \Stripe\Checkout\Session::create([
        'payment_method_types' => ['card'],
        'line_items' => [[
            'price_data' => [
                'currency' => 'lkr',
                'unit_amount' => $amount * 100,
                'product_data' => ['name' => 'Train Ticket Booking'],
            ],
            'quantity' => 1,
        ]],
        'mode' => 'payment',
        'success_url' => 'http://localhost/Traventure/Client/Booking/PaymentSuccess/Success.html?booking_id=' . $bookingID . '&trip_id=' . $tripID,
        'cancel_url' => 'http://localhost/Traventure/Client/Booking/PaymentCancel/cancel.html',
        'metadata' => [
            'booking_id' => $bookingID,
            'trip_id' => $tripID
        ]
    ]);
    
    echo json_encode([
        'id' => $session->id,
        'success' => true
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage(), 'success' => false]);
}
?>