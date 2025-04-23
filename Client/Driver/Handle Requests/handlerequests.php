<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $ride_id = $_POST['ride_id'];
    $driver_id = $_POST['driver_id'];
    $action = $_POST['action']; // 'accept' or 'decline'

    // Fetch ride request details
    $stmt = $pdo->prepare("SELECT * FROM ride_requests WHERE id = ?");
    $stmt->execute([$ride_id]);
    $ride = $stmt->fetch();

    if (!$ride) {
        die("Ride request not found.");
    }

    // Fetch driver details
    $stmt2 = $pdo->prepare("SELECT * FROM drivers WHERE id = ?");
    $stmt2->execute([$driver_id]);
    $driver = $stmt2->fetch();

    if (!$driver) {
        die("Driver not found.");
    }

    // Set new status based on action
    $new_status = $action === 'accept' ? 'accepted' : 'declined';

    // Update ride request
    $stmt3 = $pdo->prepare("UPDATE ride_requests SET status = ?, driver_id = ? WHERE id = ?");
    $stmt3->execute([$new_status, $driver_id, $ride_id]);

    // Log the action (optional)
    $stmt4 = $pdo->prepare("INSERT INTO driver_actions_log (driver_id, ride_request_id, action) VALUES (?, ?, ?)");
    $stmt4->execute([$driver_id, $ride_id, $action]);

    // Send email to customer
    $to = $ride['user_email'];
    $subject = "Ride Request - Traventure";
    
    if ($action === 'accept') {
        $message = "Dear " . $ride['user_name'] . ",\n\n"
                 . "Your ride request to " . $ride['destination'] . " has been accepted by Driver " . $driver['name'] . ".\n"
                 . "Driver email: " . $driver['email'] . "\n\n"
                 . "Please confirm your trip by replying or contacting the driver.\n\n"
                 . "Traventure Team";
    } else {
        $message = "Dear " . $ride['user_name'] . ",\n\n"
                 . "We're sorry. Your ride request to " . $ride['destination'] . " has been declined by Driver " . $driver['name'] . ".\n"
                 . "You may try requesting again later.\n\n"
                 . "Traventure Team";
    }

    $headers = "From: no-reply@traventure.com";

    // Simple mail function
    if (mail($to, $subject, $message, $headers)) {
        echo "<script>alert('Request $action successful and email sent.'); window.location.href='driver_dashboard.php';</script>";
    } else {
        echo "<script>alert('Request $action successful, but email could not be sent.'); window.location.href='driver_dashboard.php';</script>";
    }

} else {
    echo "Invalid request.";
}
?>