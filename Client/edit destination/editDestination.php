<?php
session_start();
// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    header("Location: ../login/loginpage.html");
    exit();
}

if (trim($_SESSION['userType']) !== "TSP") {
    header("Location: ../Home/home.html");
    exit();
}

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
    <form id="edit-destination-form" enctype="multipart/form-data">
      <div class="form-group">
        <label for="destinationNameInput" class="form-label">Name:</label>
        <input type="text" id="destinationNameInput" name="name" class="form-input" required>
      </div>

      <div class="form-group" id="destinationTypes">
        <!-- Destination types checkboxes will be populated here by JS -->
      </div>

      <div class="form-group">
        <label for="nearestStation" class="form-label">Nearest Station:</label>
        <select id="nearestStation" name="nearestStation" class="form-select" required>
          <option value="">Select Nearest Station</option>
          <!-- Stations will be populated by JS -->
        </select>
      </div>

      <div class="form-group">
        <label for="destinationDescriptionInput" class="form-label">Description:</label>
        <textarea id="destinationDescriptionInput" name="description" class="form-textarea" required></textarea>
      </div>

      <div class="form-group" id="photos-section">
        <h3 class="photos-heading">Photos</h3>
        <div id="destinationPhotos" class="photos-grid">
          <!-- Photos will be populated by JS -->
        </div>
        <div class="file-upload-wrapper">
          <input type="file" id="newPhotosInput" name="newPhotos[]" multiple accept="image/*" class="file-input">
          <label for="newPhotosInput" class="file-upload-label">
            <span>+ Add Photos</span>
          </label>
          <p class="file-upload-hint">Maximum 5 photos (JPEG, PNG)</p>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Save Changes</button>
        <button type="button" onclick="goBack()" class="btn btn-secondary">Cancel</button>
      </div>
    </form>
  </div>

  <script src="editDestination.js"></script>
</body>
</html>
