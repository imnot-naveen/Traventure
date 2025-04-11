<?php
// Set headers for JSON response
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

// Get the JSON input (from Postman or PayHere webhook)
$data = json_decode(file_get_contents("php://input"), true);

// Check if the necessary fields exist in the JSON
if (!isset($data['merchant_id'], $data['order_id'], $data['amount'], $data['status_code'], $data['md5sig'])) {
    http_response_code(400);  // Bad request
    echo json_encode(["status" => "error", "message" => "Invalid PayHere JSON data"]);
    exit;
}

// Extract values from the JSON data
$merchant_id = $data['merchant_id'];
$order_id = $data['order_id'];
$amount = $data['amount'];
$status_code = $data['status_code'];
$md5sig = $data['md5sig'];  // To verify the signature


// Process the payment response based on the status_code
if ($status_code == 2) {
    // Payment was successful
    file_put_contents("log.txt", "Payment successful for Order ID: $order_id\n", FILE_APPEND);
    echo json_encode(["status" => "success", "message" => "Payment successful"]);
} else {
    // Payment failed or cancelled
    file_put_contents("log.txt", "Payment failed or cancelled for Order ID: $order_id\n", FILE_APPEND);
    echo json_encode(["status" => "error", "message" => "Payment failed or cancelled"]);
}

?>
