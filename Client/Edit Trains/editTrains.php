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
    <title>Edit Train</title>
    <link rel="stylesheet" href="edittrains.css">
</head>
<body>
    <header>
        <div class="logo">
            <img src="logo.png" alt="Traventure Logo">
        </div>
        <nav>
            <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">About us</a></li>
                <li class="profile"><a href="#"><img class="user-icon" src="user-icon.png" alt="User icon"> R</a></li>
            </ul>
        </nav>
    </header>
    
    <div class="form-container">
        <h2>Edit Train Details</h2>
        <form id="editTrainForm">
            <div class="form-group">
                <label for="trainNo">Train No:</label>
                <input type="text" id="trainNo" name="trainNo" readonly>
            </div>
            <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
                <label for="route">Route:</label>
                <select id="route" name="route" required>
                    <option value="" disabled selected>Select Route</option>
                </select>
            </div>
            <div class="form-group">
                <label for="startStation">Start Station:</label>
                <select id="startStation" name="startStation" required>
                    <option value="" disabled selected>Select Start Station</option>
                </select>
            </div>
            <div class="form-group">
                <label for="endStation">End Station:</label>
                <select id="endStation" name="endStation" required>
                    <option value="" disabled selected>Select End Station</option>
                </select>
            </div>
            <div class="form-group">
                <label for="type">Train Type:</label>
                <select id="type" name="type" required>
                    <option value="" disabled selected>Select Train Type</option>
                    <option value="Express">Express</option>
                    <option value="Semi Express">Semi Express</option>
                    <option value="Commuter">Commuter</option>
                </select>
            </div>
            <div class="form-group">
                <label for="date">Date:</label>
                <select id="date" name="date" required>
                    <option value="" disabled selected>Select Dates</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekdays">Weekdays</option>
                </select>
            </div>
            <div class="form-group">
                <label for="departureTime">Departure Time:</label>
                <input type="time" id="departureTime" name="departureTime" required>
            </div>
            <div class="form-group">
                <label for="arrivalTime">Arrival Time:</label>
                <input type="time" id="arrivalTime" name="arrivalTime" required>
            </div>
            <div class="form-group">
                <label for="trainStops">Train Stops:</label>
                <div id="trainStops">
                    <p>Loading train stops...</p>
                </div>
            </div>
            <div class="button-group">
                <button type="submit" class="btn save-btn">Save Changes</button>
                <button type="button" class="btn cancel-btn" onclick="window.location.href='vieweditTrains.html'">Cancel</button>
            </div>
        </form>
    </div>
    <script src="edittrains.js"></script>
</body>
</html>