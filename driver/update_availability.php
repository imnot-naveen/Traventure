<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $driver_id = $_POST['driver_id'];

    // Get current availability
    $stmt = $pdo->prepare("SELECT availability FROM drivers WHERE id = ?");
    $stmt->execute([$driver_id]);
    $driver = $stmt->fetch();

    if (!$driver) {
        die("Driver not found.");
    }

    // Toggle the status
    $new_status = $driver['availability'] === 'available' ? 'unavailable' : 'available';

    // Update in DB
    $stmt2 = $pdo->prepare("UPDATE drivers SET availability = ? WHERE id = ?");
    $stmt2->execute([$new_status, $driver_id]);

    header("Location: driver_dashboard.php");
    exit;
} else {
    echo "Invalid request.";
}
?>
