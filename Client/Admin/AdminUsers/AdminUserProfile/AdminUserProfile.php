<?php

session_start();
// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    header("Location: ../login/loginpage.html"); // Redirect to login if not logged in
    exit();
}

if ($_SESSION['userType'] !== "Admin") {
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
  <title>User Profile | Admin</title>
  <link rel="stylesheet" href="AdminUserProfile-v2.css">
  <link rel="stylesheet" href="../../Common/Logout_Modal.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
</head>
<body>
  <div class="container">
    <aside>
    <div class="top">
                <div class="logo">
                    <img src="../../../assets/logo/logo.png" alt="logo">
                </div>
                <div class="close" id="close-btn">
                    <span class="material-symbols-outlined">
                        close
                    </span>
                </div>
            </div>
            <div class="sidebar">
                <a href="../../AdminDashboard/AdminDashboard.php">
                    <span class="material-symbols-outlined">
                        grid_view
                    </span>
                    <h3>Dashboard</h3>
                </a>
                <a href="../../AdminForum/AdminForum.php">
                    <span class="material-symbols-outlined">
                        forum
                    </span>
                    <h3>Forums</h3>
                </a>
                <a href="AdminUserProfile.php" class="active">
                    <span class="material-symbols-outlined">
                        manage_accounts
                    </span>
                    <h3>Users</h3>
                </a>
                <a href="../../AdminTsp/AdminTsp.php">
                    <span class="material-symbols-outlined">
                        train
                    </span>
                    <h3>Train Service Providers</h3>
                </a>
                <a href="../../AdminCW/AdminCW.php">
                    <span class="material-symbols-outlined">
                        smb_share
                        </span>
                    <h3>Content Writers</h3>
                </a>
                <a href="../../AdminDriver/AdminDriver.php">
                    <span class="material-symbols-outlined">
                        directions_car
                        </span>
                    <h3>Drivers</h3>
                </a>
                <a href="../../AdminAnalytics/AdminAnalytics.php">
                    <span class="material-symbols-outlined">
                        monitoring
                    </span>
                    <h3>Analytics</h3>
                </a>
                <a href="../../AdminBookings/AdminBookings.php">
                    <span class="material-symbols-outlined">
                        report
                    </span>
                    <h3>Bookings</h3>
                </a>
                <a id="logoutButton">
                    <span class="material-symbols-outlined">
                        logout
                    </span>
                    <h3>Logout</h3>
                </a>
            </div>
    </aside>

    <main>
        <h1>TSP Profile</h1>
        <div class="insights">
          <div class="sales">
              <div class="profile-header">
                  <img src="../../../assets/img/AvatarMaker.png" alt="Admin Profile Picture" class="profile-picture">
                  <div class="profile-info">
                      <h2>Dimuthu Harshamal</h2>
                      <h3>Train Service Provider</h3>
                      <p>Status: <span class="status active">Active</span></p>
                  </div>
              </div>
              <div class="profile-details">
                  <div class="profile-details">
                      <ul class="left-details">
                          <li>Email: admin@example.com</li>
                          <li>Phone: +94 71 234 5678</li>
                      </ul>
                      <ul class="right-details">
                          <li>Role: Administrator</li>
                          <li>Last Login: 2024-11-22</li>
                      </ul>
                  </div>
                  <div class="action-buttons">
                    <button class="update-button">Update</button>
                    <button class="deactivate-button">Deactivate</button>
                </div>
              </div>
          </div>
      </div>
  
        <!-- Activity Logs Section -->
        <section class="activity-logs">
          <h3>Activity Logs</h3>
          <table class="logs-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Action</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2024-11-20</td>
                <td>Updated Article</td>
                <td>Revised "Top 10 Travel Tips" blog</td>
              </tr>
              <tr>
                <td>2024-11-18</td>
                <td>New Article</td>
                <td>Published "Best Destinations 2024"</td>
              </tr>
              <tr>
                <td>2024-11-15</td>
                <td>Profile Update</td>
                <td>Changed contact details</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
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
            <!-- END OF TOP --> 
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
    
 <script src="../../Common/Logout_Modal.js"></script>
 <script src="AdminUserProfile.js"></script>
</body>
</html>