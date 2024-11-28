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
    <title>Manage Trains | Traventure</title>
    <link rel="stylesheet" href="managetrains.css">
</head>
<body>
    <div class="container">
        <header>
            <div class="logo">
                <img src="logo.png" alt="Traventure Logo">
            </div>
            <nav>
                <a href="../TSP Dashboard/dashboard.php" class="go-back-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                    Go Back
                </a>
            </nav>
        </header>

        <main>
            <div class="content">
                <div class="train-management">
                    <h1>Train Management</h1>
                    <div class="action-buttons">
                        <div class="btn-container">
                            <button class="btn btn-primary" onclick="location.href='../add trains/addtrains.php';">
                                <span>Add New Train</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </button>
                            <p class="btn-description">Create and register a new train in the system</p>
                        </div>

                        <div class="btn-container">
                            <button class="btn btn-secondary" onclick="location.href='../view and edit trains/viewedittrains.php';">
                                <span>View / Edit Trains</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </button>
                            <p class="btn-description">Manage and update existing train information</p>
                        </div>
                    </div>
                </div>
                
                <div class="train-illustration">
                    <img src="train.png" alt="Train Illustration">
                </div>
            </div>
        </main>
    </div>

    <script src="managetrains.js"></script>
</body>
</html>