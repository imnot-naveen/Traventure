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
    <!-- Google Fonts: Poppins -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Poppins', Arial, sans-serif;
            background: #f4f8fc;
            margin: 0;
            padding: 48px 32px;
            min-height: 100vh;
            text-align: center;
            color: #333;
        }
        h1 {
            font-size: 2.8rem;
            font-weight: 600;
            color: #1a73e8;
            margin-bottom: 16px;
        }
        h2 {
            font-size: 1.8rem;
            font-weight: 500;
            color: #185abc;
            margin-bottom: 12px;
        }
        h3 {
            font-size: 1.4rem;
            font-weight: 500;
            color: #1a73e8;
            margin: 32px 0 16px 0;
        }
        p, strong, span {
            font-size: 1.25rem;
            color: #555;
        }
        .welcome-section {
            border: 20px solidrgb(48, 67, 89);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            background: #ffffff;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: 0 auto;
        }
        .welcome-section h2 strong {
            font-weight: 800;
            font-size: 100%;
            color: #555;
        }
        .ride {
            border: 1.5px solidrgb(48, 67, 89);
            border-radius: 14px;

            padding: 20px 16px;
            background: #ffffff;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            text-align: center;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
        }
        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 14px;
            color: #fff;
            cursor: pointer;
            margin: 10px 8px 0 0;
            font-family: 'Poppins', Arial, sans-serif;
            font-size: 1.1rem;
            font-weight: 500;
            transition: background 0.3s, box-shadow 0.3s;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .btn:hover {
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
        .accept {
            background: #1a73e8;
        }
        .accept:hover {
            background: #155bb5;
        }
        .decline {
            background: #d93025;
        }
        .decline:hover {
            background: #b2221a;
        }
        button[type="submit"] {
            border-radius: 14px;
            font-family: 'Poppins', Arial, sans-serif;
            background: #1a73e8;
            color: #fff;
            padding: 8px 16px;
            cursor: pointer;
            transition: background 0.3s, box-shadow 0.3s;
        }
        button[type="submit"]:hover {
            background: #155bb5;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        hr {
            border: none;
            border-top: 1.5px solid #d1e3f8;
            margin: 40px 0;
        }
        @media (max-width: 600px) {
            body {
                padding: 16px 8px;
            }
            h1 { font-size: 2rem; }
            h2 { font-size: 1.4rem; }
            h3 { font-size: 1.2rem; }
        }
    </style>
</head>
<body>
    <h1>Traventure Driver Dashboard</h1>
    <div class="welcome-section">
        <h2>Welcome, <strong><?php echo htmlspecialchars($driver['name']); ?></strong></h2>
        <p>Station: <strong><?php echo htmlspecialchars($driver['assigned_station']); ?></strong></p>
        <form method="post" action="update_availability.php">
            <input type="hidden" name="driver_id" value="<?php echo $driver_id; ?>">
            <p>
                <strong>Availability:</strong> 
                <span style="color: <?php echo $driver['availability'] === 'available' ? '#34a853' : '#d93025'; ?>">
                    <?php echo ucfirst($driver['availability']); ?>
                </span>
                <button type="submit" name="toggle">
                    <?php echo $driver['availability'] === 'available' ? 'Set Unavailable' : 'Set Available'; ?>
                </button>
            </p>
        </form>
    </div>

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
</body>
</html>