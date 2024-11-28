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
  <title>Manage Destinations</title>
  <link rel="stylesheet" href="manageDestinations.css">
</head>
<body>
  <div id="manage-destinations">
    <button id="create-destination-btn">Create Destination</button>
    <div id="destination-list">
      <!-- Dynamic Destination List -->
    </div>
  </div>

  <script src="manageDestinations.js"></script>
</body>
</html>
