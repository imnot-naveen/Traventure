<?php

session_start();
// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    header("Location: ../login/loginpage.html"); 
    exit();
}

if (trim($_SESSION['userType']) !== "Driver") {
    header(header: "Location: ../Home/home.html"); 
    exit();
}

// Get the username from the session
$username = $_SESSION['username'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Driver Dashboard</title>
    <link rel="stylesheet" href="dashboard.css">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
</head>
<body>
    <div class="sidebar">
        <div class="sidebar-header">
            <i class='bx bxs-car'></i>
            <h1>Driver</h1>
        </div>
        
        <ul class="nav-menu">
            <li>
                <a href="../RideRequests/RideRequests.php">
                    <i class='bx bxs-traffic-barrier'></i>
                    Ride Requests
                </a>
            </li>
            <li>
                <a href="../RideHistory/RideHistory.php">
                    <i class='bx bxs-time-five'></i>
                    Ride History
                </a>
            </li>
        </ul>

    <a href="#" class="logout-btn" title="Logout">
    <i class='bx bx-log-out' style="font-size: 20px;"></i>
    Logout
</a>
    </div>

    <div class="main-content">
        <h2 class="dashboard-title">Dashboard Overview</h2>
        
        <div class="dashboard-grid">
            <div class="dashboard-card">
                <img src="total-trains-icon.png" alt="Total Trains">
                <h3>Total Rides</h3>
                <p>25 Rides</p>
            </div>
            
            <div class="dashboard-card">
                <img src="passengers-icon.png" alt="Passengers This Month">
                <h3>Passengers This Month</h3>
                <p>5,420 Passengers</p>
            </div>
            
            <div class="dashboard-card">
                <img src="revenue-icon.png" alt="Monthly Revenue">
                <h3>Monthly Revenue</h3>
                <p>$124,500</p>
            </div>
        </div>
    </div>
    <script src="dashboard.js"></script>
</body>
</html>