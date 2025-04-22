<?php
session_start();
// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    header("Location: ../login/loginpage.html"); // Redirect to login if not logged in
    exit();
}

if (trim($_SESSION['userType']) !== "TSP") {
    header("Location: ../Home/home.html"); // If not authorized, redirect to homepage
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
  <title>Edit Destination</title>
  <link rel="stylesheet" href="editDestination.css">
</head>
<body>
  <div id="edit-destination">
    <h1>Edit Destination</h1>
    <form id="edit-destination-form">
      <label for="destinationNameInput">Name:</label>
      <input type="text" id="destinationNameInput" name="name" required>

      <label>Type:</label>
      <div id="destinationTypes">
        <div class="type-checkbox-container">
          <!-- Checkboxes will be dynamically inserted here -->
        </div>
      </div>

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
          <!-- Existing photos will be loaded here -->
        </div>
        <input type="file" id="newPhotosInput" name="newPhotos[]" multiple accept="image/*">
      </div>

      <button type="submit">Save</button>
    </form>
    <button onclick="goBack()">Cancel</button>
  </div>

  <script src="editDestination.js"></script>
</body>
</html>