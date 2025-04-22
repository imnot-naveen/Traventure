<?php
session_start(); // Start the session

// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    header("Location: ../login/loginpage.html"); // Redirect to login if not logged in
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
    <title>Profile Page</title>
    <link rel="stylesheet" href="profile.css">
    <script>
        // Pass the username from PHP to JavaScript
        const username = "<?php echo htmlspecialchars($username); ?>"; // Use htmlspecialchars to prevent XSS
    </script>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="profile-picture" style="background-color: #f0f0f0; width: 100px; height: 100px; border-radius: 50%; background-size: cover; background-position: center;"></div>
            <h1 class="name">User  Name</h1>
            <button class="logout-btn">Log out</button>
        </div>
        <form class="profile-form">
            <div class="form-group">
                <label for="first-name">First Name</label>
                <input type="text" id="first-name" placeholder="First Name" disabled>
            </div>
            <div class="form-group">
                <label for="last-name">Last Name</label>
                <input type="text" id="last-name" placeholder="Last Name" disabled>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" placeholder="Email" disabled>
            </div>
            <div class="form-group">
                <label for="contact-number">Contact Number</label>
                <input type="text" id="contact-number" placeholder="Contact Number" disabled>
            </div>
            <div class="form-group">
                <label>Preferred Destinations</label>
                <div class="destinations-container">
                    <!-- Destinations will be populated here dynamically -->
                </div>
            </div>
            <div class="links">
                <a href="../userTrips/userTrips.html" class="trip-history">View Trip History...</a>

                <a href="../Bookinghistory/bookingHistory.php" id="booking-history">View Booking History</a>

                <a href="#" class="edit-profile">Edit profile..</a>
            </div>
            <button type="button" class="save-btn">Save</button>
        </form>
    </div>
    <script src="profile.js"></script>
</body>
</html>