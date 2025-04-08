<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Include core initialization and required files
include_once('../core/initialize.php');
include_once('../core/payment.php');

// Instantiate Payment class
$payment = new Payment($db);

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get raw POST data
    $data = json_decode(file_get_contents("php://input"));

    // Check if required fields are present
    if (
        isset($data->booking_id) &&
        isset($data->amount) &&
        isset($data->payment_method) &&
        isset($data->status) &&
        isset($data->transaction_id) &&
        isset($data->qr_code)
    ) {
        // Sanitize and assign variables
        $bookingId = htmlspecialchars($data->booking_id);
        $amount = htmlspecialchars($data->amount);
        $paymentMethod = htmlspecialchars($data->payment_method);
        $status = htmlspecialchars($data->status);
        $transactionId = htmlspecialchars($data->transaction_id);
        $qrCode = htmlspecialchars($data->qr_code);

        // Try to process payment
        try {
            $result = $payment->processPayment($bookingId, $amount, $paymentMethod, $status, $transactionId, $qrCode);
            echo json_encode($result);
        } catch (Exception $e) {
            http_response_code(500); // Internal Server Error
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to create payment.',
                'error' => $e->getMessage()
            ]);
        }
    } else {
        http_response_code(400); // Bad Request
        echo json_encode(['message' => 'Missing required fields.']);
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['message' => 'Invalid request method. Use POST.']);
}
?>
