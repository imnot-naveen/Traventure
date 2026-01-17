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
    <title>Dynamic Trains List</title>
    <link rel="stylesheet" href="vieweditTrains.css">
</head>
<body>
<header>
            <div class="logo">
                <img src="logo.png" alt="Traventure Logo">
            </div>
            <nav>
                <a href="../Manage Trains/managetrains.php" class="go-back-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                    Go Back
                </a>
            </nav>
        </header>

    <div class="table-container">
        <h2>Trains</h2>
        <table>
            <thead>
                <tr>
                    <th>Train No.</th>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="train-list">
                <!-- Dynamic train rows will be populated here -->
            </tbody>
        </table>
        <div class="pagination">
            <button id="prev-btn">Previous</button>
            <span id="current-page">1</span>
            <button id="next-btn">Next</button>
        </div>
    </div>

    <!-- Disable Modal -->
    <div id="disableModal" class="modal">
    <div class="modal-content">
        <p>Are you sure you want to disable this train?</p>
        <button id="confirmDisable">Yes, Disable</button>
        <button id="cancelDisable">Cancel</button>
    </div>
    </div>

    <!-- Activate Modal -->
    <div id="activateModal" class="modal">
    <div class="modal-content">
        <p>Are you sure you want to activate this train?</p>
        <button id="confirmActivate">Yes, Activate</button>
        <button id="cancelActivate">Cancel</button>
    </div>
    </div>

    
    <script src="viewedittrains.js"></script>
</body>
</html>