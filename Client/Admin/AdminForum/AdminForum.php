<?php

session_start();
// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    header("Location: ../../Login/LoginPage.html"); 
    exit();
}

if ($_SESSION['userType'] !== "Admin") {
    header("Location: ../../Home/home.html"); 
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
  <title>Admin Dashboard</title>
  <link rel="stylesheet" href="AdminForum.css">
  <link rel="stylesheet" href="../Common/Logout_Modal.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
</head>
<body>
  <div class="container">
    <aside>
    <div class="top">
                <div class="logo">
                    <img src="../../assets/logo/logo.png" alt="logo">
                </div>
                <div class="close" id="close-btn">
                    <span class="material-symbols-outlined">
                        close
                    </span>
                </div>
            </div>
            <div class="sidebar">
                <a href="../AdminDashboard/AdminDashboard.php">
                    <span class="material-symbols-outlined">
                        grid_view
                    </span>
                    <h3>Dashboard</h3>
                </a>
                <a href="#" class="active">
                    <span class="material-symbols-outlined">
                        forum
                    </span>
                    <h3>Forums</h3>
                </a>
                <a href="../AdminUsers/AdminUsers.php">
                    <span class="material-symbols-outlined">
                        manage_accounts
                    </span>
                    <h3>Users</h3>
                </a>
                <a href="../AdminTsp/AdminTsp.php">
                    <span class="material-symbols-outlined">
                        train
                    </span>
                    <h3>Train Service Providers</h3>
                </a>
                <a href="../AdminCW/AdminCW.php">
                    <span class="material-symbols-outlined">
                        smb_share
                        </span>
                    <h3>Content Writers</h3>
                </a>
                <a href="../AdminDriver/AdminDriver.php">
                    <span class="material-symbols-outlined">
                        directions_car
                        </span>
                    <h3>Drivers</h3>
                </a>
                <a href="../AdminAnalytics/AdminAnalytics.php">
                    <span class="material-symbols-outlined">
                        monitoring
                    </span>
                    <h3>Analytics</h3>
                </a>
                <a href="../AdminForum/AdminForum.php">
                    <span class="material-symbols-outlined">
                        confirmation_number
                    </span>
                    <h3>Bookings</h3>
                </a>
                <a href="#" id="logoutButton">
                    <span class="material-symbols-outlined">
                        logout
                    </span>
                    <h3>Logout</h3>
                </a>
            </div>
    </aside>

    <main>
            <h1>Forum</h1>
            <div class="insights">
            </div>
            <!-- END OF INSIGHTS -->
             <div class="recent-orders">
             </div>
        </main>

        <div class="right">
            <div class="top">
                <button id="menu-btn">
                    <span class="material-symbols-outlined">
                        menu
                        </span>
                </button>
                <div class="profile">
                    <div class="info">
                        <p>Hey, <b>Dimuthu</b></p>
                        <small class="text-muted">Admin</small>
                    </div>
                    <div class="profile-photo">
                        <span class="material-symbols-outlined">
                            account_circle
                            </span>
                    </div>
                </div>
            </div>

             <div class="recent-updates">

             </div>
             <div class="sales-analytics">


             </div>
        </div>
  </div>
 
        <!-- Dialog Box -->
      <div id="logoutDialog" class="modal-lo">
        <div class="modal-content-lo">
            <h2>Logout</h2>
            <p>Are you sure you want to logout?</p>
            <div class="button-group">
                <button id="confirmLogout" class="btn btn-confirm">Yes</button>
                <button id="cancelLogout" class="btn btn-cancel">Cancel</button>
            </div>
        </div>
    </div>

  <script src="../Common/Logout_Modal.js"></script>
  <script src="AdminForum.js"></script>
</body>
</html>