<?php

session_start();
// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    header("Location: ../login/loginpage.html"); // Redirect to login if not logged in
    exit();
}

if (trim($_SESSION['userType']) !== "TSP") {
    header(header: "Location: ../Home/home.html"); // If not authorized, redirect to homepage
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
    <title>Train Service Provider Dashboard</title>
    <link rel="stylesheet" href="dashboard.css">
</head>
<body>
    <div class="sidebar">
        <div class="sidebar-header">
            <img src="logo.png" alt="Traventure Logo">
            <h1>Train Service Provider</h1>
        </div>
        
        <ul class="nav-menu">
            <li>
                <a href="../manage trains/managetrains.php">
                    <img src="train-icon.png" alt="Manage Trains">
                    Manage Trains
                </a>
            </li>
            <li>
                <a href="../manage destinations/managedestinations.php">
                    <img src="destination-icon.png" alt="Manage Destinations">
                    Manage Destinations
                </a>
            </li>
        </ul>

        <<a href="#" class="logout-btn" title="Logout">
    <img src="logout-icon.png" alt="Logout" style="width: 20px; height: 20px;">
    Logout
</a>
    </div>

    <div class="main-content">
        <h2 class="dashboard-title">Dashboard Overview</h2>
        
        <div class="dashboard-grid">
        <div class="dashboard-card">
                <img src="total-trains-icon.png" alt="Total Trains">
                <h3>Total Trains</h3>
                <p id="trains"></p>
            </div>
            
            <div class="dashboard-card">
                <img src="active-routes-icon.png" alt="Active Routes">
                <h3>Active Routes</h3>
                <p id="routes"></p>
            </div>
            
            <div class="dashboard-card">
                <img src="passengers-icon.png" alt="Passengers This Month">
                <h3>Passengers This Month</h3>
                <p id="passengers"></p>
            </div>
            
            <div class="dashboard-card">
                <img src="revenue-icon.png" alt="Monthly Revenue">
                <h3>Monthly Revenue</h3>
                <p id="revenue"></p>
            </div>
    </div>
    <script src="dashboard.js"></script>
</body>
</html>