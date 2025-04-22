<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $ride_id = $_POST['ride_id'];
    $driver_id = $_POST['driver_id'];

    // Get ride details
    $stmt = $pdo->prepare("SELECT * FROM ride_requests WHERE id = ? AND driver_id = ?");
    $stmt->execute([$ride_id, $driver_id]);
    $ride = $stmt->fetch();

    if (!$ride) {
        die("Ride not found or you're not authorized.");
    }

    // Update status to cancelled
    $stmt2 = $pdo->prepare("UPDATE ride_requests SET status = 'cancelled' WHERE id = ?");
    $stmt2->execute([$ride_id]);

    // Send email to customer
    $to = $ride['user_email'];
    $subject = "Traventure - Ride Cancelled by Driver";
    $message = "Dear " . htmlspecialchars($ride['user_name']) . ",\n\nWe're sorry to inform you that your ride to " . htmlspecialchars($ride['destination_station']) . " has been cancelled by the driver.\n\nPlease try requesting another ride.\n\n- Traventure Team";
    $headers = "From: no-reply@traventure.com";

    mail($to, $subject, $message, $headers);

    header("Location: driver_dashboard.php");
    exit;
} else {
    echo "Invalid request.";
}
?>
