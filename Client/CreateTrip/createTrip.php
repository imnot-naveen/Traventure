<?php

session_start();
// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    header("Location: ../login/loginpage.html"); // Redirect to login if not logged in
    exit();
}

if (trim($_SESSION['userType']) !== "Traveller") {
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
    <title>Plan Your Journey</title>
    <link rel="stylesheet" href="createTrip.css">
</head>
<body>
    <div class="top-section"></div>
    <div class="middle-section">
        <div class="form-container">
            <div class="left-panel">
                <h2>Plan your journey</h2>
            </div>
            <div class="right-panel">
                <form>
                    <div class="form-group">
                        <label for="start-station">Start Station</label>
                        <select id="start-station" name="start-station">
                            <option value="">Select</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="end-station">End Station</label>
                        <select id="end-station" name="end-station">
                            <option value="">Select</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="search-date">Date</label>
                        <input type="date" id="search-date" name="search-date">
                    </div>
                    <div class="form-group">
                        <label for="adults">No. of Adults</label>
                        <input type="number" id="adults" name="adults" min="0" max="10" placeholder="Enter no. of adults">
                    </div>
                    <div class="form-group">
                        <label for="children">No. of Children</label>
                        <input type="number" id="children" name="children" min="0" max="10" placeholder="Enter no. of children">
                    </div>
                    <div class="form-group">
                        <label for="total-passengers">Total No. of Passengers</label>
                        <input type="number" id="total-passengers" name="total-passengers" min="1" max="10" placeholder="Enter total passengers">
                    </div>
                    
                    
                    <div class="buttons">
                        <button type="button">Search</button>
                        <button type="reset" class="reset">Reset</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div class="bottom-section"></div>
    <script src="createTrip.js"></script>
</body>
</html>
