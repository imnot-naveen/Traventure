<?php
session_start();
require 'db.php';

// For now, hardcode the driver ID (you can change this after login integration)
$driver_id = 1;

// Get driver details
$stmt = $pdo->prepare("SELECT * FROM drivers WHERE id = ?");
$stmt->execute([$driver_id]);
$driver = $stmt->fetch();

if (!$driver) {
    die("Driver not found in the database.");
}

// Get ride requests for the driver's assigned station with status = 'pending'
$stmt2 = $pdo->prepare("SELECT * FROM ride_requests WHERE destination = ? AND status = 'pending'");
$stmt2->execute([$driver['assigned_station']]);
$ride_requests = $stmt2->fetchAll();
?>

<!DOCTYPE html>
<html>
<head>
    <title>Driver Dashboard - Traventure</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f1f3f5;
            padding: 20px;
        }
        .container {
            max-width: 900px;
            margin: auto;
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 0 15px rgba(0,0,0,0.1);
        }
        h2 {
            color: #333;
        }
        .ride {
            border: 1px solid #ccc;
            border-radius: 8px;
            margin: 15px 0;
            padding: 15px;
            background: #f9f9f9;
        }
        .btn {
            padding: 8px 14px;
            border: none;
            border-radius: 5px;
            color: white;
            cursor: pointer;
            margin-right: 10px;
        }
        .accept { background-color: #28a745; }
        .decline { background-color: #dc3545; }
    </style>
</head>
<body>
<div class="container">
    <h2>Welcome, <?php echo htmlspecialchars($driver['name']); ?> 👋</h2>
    <p>Station: <strong><?php echo htmlspecialchars($driver['assigned_station']); ?></strong></p>
    
    <form method="post" action="update_availability.php">
    <input type="hidden" name="driver_id" value="<?php echo $driver_id; ?>">
    <p>
        <strong>Availability:</strong> 
        <span style="color: <?php echo $driver['availability'] === 'available' ? 'green' : 'red'; ?>">
            <?php echo ucfirst($driver['availability']); ?>
        </span>
        <button type="submit" name="toggle" style="margin-left: 15px; padding: 6px 12px;">
            <?php echo $driver['availability'] === 'available' ? 'Set Unavailable' : 'Set Available'; ?>
        </button>
    </p>
    </form>

    <hr>

    <h3>Pending Ride Requests for Your Station</h3>

    <?php if (count($ride_requests) > 0): ?>
        <?php foreach ($ride_requests as $ride): ?>
            <div class="ride">
                <p><strong>Customer:</strong> <?php echo htmlspecialchars($ride['user_name']); ?></p>
                <p><strong>Destination:</strong> <?php echo htmlspecialchars($ride['destination']); ?></p>
                <form method="post" action="handle_request.php">
                    <input type="hidden" name="ride_id" value="<?php echo $ride['id']; ?>">
                    <input type="hidden" name="driver_id" value="<?php echo $driver_id; ?>">
                    <button class="btn accept" name="action" value="accept">Accept</button>
                    <button class="btn decline" name="action" value="decline">Decline</button>
                </form>
            </div>
        <?php endforeach; ?>
    <?php else: ?>
        <p>No ride requests at the moment.</p>
    <?php endif; ?>

    <hr>
    <h3>Accepted Rides</h3>

    <?php
    $stmt3 = $pdo->prepare("SELECT * FROM ride_requests WHERE driver_id = ? AND status = 'accepted'");
    $stmt3->execute([$driver_id]);
    $accepted_rides = $stmt3->fetchAll();
    ?>

    <?php if (count($accepted_rides) > 0): ?>
        <?php foreach ($accepted_rides as $ride): ?>
            <div class="ride">
                <p><strong>Customer:</strong> <?php echo htmlspecialchars($ride['user_name']); ?></p>
                <p><strong>Destination:</strong> <?php echo htmlspecialchars($ride['destination']); ?></p>
                <form method="post" action="cancel_ride.php">
                    <input type="hidden" name="ride_id" value="<?php echo $ride['id']; ?>">
                    <input type="hidden" name="driver_id" value="<?php echo $driver_id; ?>">
                    <button class="btn decline" onclick="return confirm('Are you sure you want to cancel this ride?');">Cancel Ride</button>
                </form>
            </div>
        <?php endforeach; ?>
    <?php else: ?>
        <p>No accepted rides currently.</p>
    <?php endif; ?>

</div>
</body>
</html>
