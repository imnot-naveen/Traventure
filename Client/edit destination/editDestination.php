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

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Edit Destination</title>
  <link rel="stylesheet" href="editDestination.css">
</head>
<body>
  <div id="edit-destination">
    <h1>Edit Destination</h1>
    <form id="edit-destination-form">
      <label for="destinationNameInput">Name:</label>
      <input type="text" id="destinationNameInput" name="name" required>

      <label for="destinationType">Type:</label>
      <select id="destinationType" name="type" required>
        <option value="">Select Destination Type</option>
        <!-- Types will be populated dynamically -->
      </select>

      <label for="nearestStation">Nearest Station:</label>
      <select id="nearestStation" name="nearestStation" required>
        <option value="">Select Nearest Station</option>
        <!-- Stations will be populated dynamically -->
      </select>

      <label for="destinationDescriptionInput">Description:</label>
      <textarea id="destinationDescriptionInput" name="description" required></textarea>

      <div id="photos-section">
        <h3>Photos</h3>
        <div id="destinationPhotos">
          <!-- Existing photos dynamically loaded here -->
        </div>
        <input type="file" id="newPhotosInput" name="newPhotos[]" multiple>
      </div>

      <button type="submit">Save</button>
    </form>
    <button onclick="goBack()">Cancel</button>
  </div>

  <script src="editDestination.js"></script>
</body>
</html>