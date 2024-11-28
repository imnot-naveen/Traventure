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
    <title>Traventure</title>
    <link rel="stylesheet" href="dashboard.css">
</head>
<body>
    <header>
        <div class="logo">
            <img src="logo.png" alt="Logo">
        </div>
    </header>
    <main>
        <div class="content">
            <div class="buttons">
                <button class="btn" onclick="location.href='../manage trains/managetrains.php';">Manage Trains <img src="arrow.png" alt="Arrow icon"> </button>
                <button class="btn" onclick="location.href='../manage destinations/managedestinations.php';">Manage Destinations <img src="arrow.png" alt="Arrow icon"> </button>
            </div>
            <div class="image">
                <img src="train.png" alt="Train image">
            </div>
        </div>
    </main>
</body>
</html>