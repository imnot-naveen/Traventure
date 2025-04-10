<?php
// Set headers for JSON response
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

// Connect to your database
require_once("../includes/config.php");

// Get the JSON input
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
    exit;
}

// Extract data
$trainID = $data['selectedTrain']['trainID'] ?? null;
$fromStation = $data['fromStationId'] ?? null;
$toStation = $data['toStationId'] ?? null;
$class = $data['selectedClass'] ?? null;
$passengerCount = $data['passengerCount'] ?? 1;
$paymentOption = $data['paymentOption'] ?? 'unknown';
$totalAmount = $data['totalAmount'] ?? 0;

// Basic validation
if (!$trainID || !$fromStation || !$toStation || !$class) {
    echo json_encode(["status" => "error", "message" => "Missing required booking details"]);
    exit;
}

// Insert into your `bookings` table
$sql = "INSERT INTO bookings (train_id, from_station, to_station, class, passenger_count, payment_option, total_amount)
        VALUES (?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssisd", $trainID, $fromStation, $toStation, $class, $passengerCount, $paymentOption, $totalAmount);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Booking recorded successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to record booking"]);
}

$stmt->close();
$conn->close();
?>
