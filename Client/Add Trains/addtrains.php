<?php

// session_start();
// // Check if the user is logged in
// if (!isset($_SESSION['username'])) {
//     header("Location: ../login/loginpage.html"); // Redirect to login if not logged in
//     exit();
// }

// if ($_SESSION['userType'] !== "TSP") {
//     header("Location: ../Home/home.html"); // If not authorized, redirect to homepage
//     exit();
// }

// // Get the username from the session
// $username = $_SESSION['username'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Trains</title>
    <link rel="stylesheet" href="addtrains.css">
</head>
<body>
    <header>
        <h1>Train Scheduler</h1>
    </header>
    <div class="form-container">
        <h2>Add Trains</h2>
        <form id="addTrainForm">
            <div class="form-group">
                <label for="trainNo">Train No:</label>
                <input type="text" id="trainNo" name="trainNo" required>
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
                    <p>Please select start and end stations to see train stops.</p>
                </div>
            </div>
            <button type="submit" class="btn">Add Train</button>
        </form>
    </div>
    <script src="addtrains.js"></script>
</body>
</html>