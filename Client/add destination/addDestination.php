<?php
session_start(); // Start the session

// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    header("Location: ../login/loginpage.html"); // Redirect to login if not logged in
    exit();
}

if (!($_SESSION['userType'] == "TSP")){
    header("Location: ../Home/home.html"); // If not authorized, redirect to homepage
}

// Get the username from the session
$username = $_SESSION['username'];
?>

<<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Add Destination</title>
    <link rel="stylesheet" href="addDestination.css" />
  </head>
  <body>
    <div class="form-container">
      <form id="destination-form">
        <h2>Add Destination</h2>

        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required />

        <label for="description">Description:</label>
        <textarea id="description" name="description" required></textarea>

        <label for="type">Type/s:</label>
        <div id="typesContainer"></div>

        <label for="nearestStation">Nearest Station:</label>
        <select id="nearestStation" name="nearestStation" required></select>

        <label for="photos">Upload Photos:</label>
        <input
          type="file"
          id="photos"
          name="photos[]"
          multiple
          accept="image/*"
        />
        <div class="form-actions">
            <button type="submit">Submit</button>
            <button type="button" onclick="window.location.href='../manage destinations/managedestinations.php'" class="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>

    <script src="addDestination.js"></script>
  </body>
</html>