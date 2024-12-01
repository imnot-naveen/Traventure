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
  <title>Users | Admin</title>
  <link rel="stylesheet" href="AdminCW.css">
  <link rel="stylesheet" href="AdminCWAdd.css">
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
                <a href="../AdminForum/AdminForum.php">
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
                <a href="#" class="active"> 
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
                <a href="../AdminBookings/AdminBookings.php">
                    <span class="material-symbols-outlined">
                        confirmation_number
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
            <h1>Content Writers</h1>
            <div class="insights">
                <div class="sales">
                    <span class="material-symbols-outlined">
                        group_add
                        </span>
                    <div class="middle">
                        <div class="left">
                            <h3>Total Users</h3>
                            <h1>5,056</h1>
                        </div>
                        <div class="progress">
                            <svg>
                                <circle cx="38" cy="38" r="36"></circle>
                            </svg>
                            <div class="number">
                                <p>81%</p>
                            </div>
                        </div>
                    </div>
                    <small class="text-muted">
                        Total
                    </small>
                </div>

                <div class="expenses">
                    <span class="material-symbols-outlined">
                        bar_chart
                        </span>
                    <div class="middle">
                        <div class="left">
                            <h3>User Accounts</h3>
                            <h1>43</h1>
                        </div>
                        <div class="progress">
                            <svg>
                                <circle cx="38" cy="38" r="36"></circle>
                            </svg>
                            <div class="number">
                                <p>87%</p>
                            </div>
                        </div>
                    </div>
                    <small class="text-muted">
                        Last 30 Days
                    </small>
                </div>

                <div class="income">
                    <span class="material-symbols-outlined">
                        psychology
                        </span>
                    <div class="middle">
                        <div class="left">
                            <h3>User Preferences</h3>
                            <h1>123</h1>
                        </div>
                        <div class="progress">
                            <svg>
                                <circle cx="38" cy="38" r="36"></circle>
                            </svg>
                            <div class="number">
                                <p>81%</p>
                            </div>
                        </div>
                    </div>
                    <small class="text-muted">
                        Last 24 Hours
                    </small>
                </div>
                <!-- END OF INCOME -->

            </div>
            <!-- <a href="AdminCW-profile/AdminCW-profile.php"></a> -->
            <!-- END OF INSIGHTS -->
             <div class="recent-orders">
                <h2>Content Writers</h2>
                <div class="search-container">
                    <input
                      type="text"
                      id="searchBar"
                      class="search-input"
                      placeholder="Search users by name..."
                      oninput="filterUsers()"
                    />
                  </div>
                  <div class="Add-users">
                    <button id="Add-user">Add User</button>
                  </div>
                  <div id="userModal" class="modal">
                    <div class="modal-content">
                      <span class="close">&times;</span>
                      <h2>Add New User</h2>
                      <form id="addUserForm">
                        <div class="form-group">
                          <label for="username">Username</label>
                          <input type="text" id="username" name="username" required>
                        </div>
                        <div class="form-group">
                          <label for="firstName">First Name</label>
                          <input type="text" id="firstName" name="firstName" required>
                        </div>
                        <div class="form-group">
                          <label for="lastName">Last Name</label>
                          <input type="text" id="lastName" name="lastName" required>
                        </div>
                        <div class="form-group">
                          <label for="email">Email</label>
                          <input type="email" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                          <label for="contactNumber">Contact Number</label>
                          <input type="tel" id="contactNumber" name="contactNumber" pattern="[0-9]{10}" title="Enter a 10-digit phone number" required>
                        </div>
                        <div class="modal-buttons">
                          <button type="submit" class="btn-save">Save</button>
                          <button type="button" id="cancelBtn" class="btn-cancel">Cancel</button>
                        </div>
                      </form>
                    </div>
                  </div>
                <table id="userTable">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Contact Number</th>
                        </tr>
                    </thead>
                    <tbody id="userTableBody">
                    </tbody>
                </table>
                <div class="pagination">
                    <button id="prevBtn" onclick="prevPage()">Previous</button>
                    <span id="pageInfo"></span>
                    <button id="nextBtn" onclick="nextPage()">Next</button>
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
            <div class="recent-updates">
                <h2>Recent Updates</h2>
                <div class="updates">
                    <div class="update">
                        <div class="profile-photo">
                            <span class="material-symbols-outlined">
                                account_circle
                                </span>
                        </div>
                        <div class="message">
                            <p><b>John Doe</b> booked a train Maradana to Kandy.</p>
                            <small class="text-muted">2 Minutes Ago</small>
                        </div>
                    </div>
                    <div class="update">
                        <div class="profile-photo">
                            <span class="material-symbols-outlined">
                                account_circle
                                </span>
                        </div>
                        <div class="message">
                            <p><b>Virat Kohli</b> booked a train Kalutara to Panadura.</p>
                            <small class="text-muted">2 Minutes Ago</small>
                        </div>
                    </div>
                    <div class="update">
                        <div class="profile-photo">
                            <span class="material-symbols-outlined">
                                account_circle
                                </span>
                        </div>
                        <div class="message">
                            <p><b>Kylian Mbappe</b> booked a train Maradana to Galle.</p>
                            <small class="text-muted">2 Minutes Ago</small>
                        </div>
                    </div>
                </div>
             </div>
             <div class="sales-analytics">
                <h2>Analytics</h2>
                <div class="item online">
                    <div class="icon">
                        <span class="material-symbols-outlined">
                            local_mall
                            </span>
                    </div>
                    <div class="right">
                        <div class="info">
                            <h3>ONLINE BOOKINGS</h3>
                            <small class="text-muted">Last 24 Hours</small>
                        </div>
                        <h5 class="success">-17%</h5>
                        <h3>1100</h3>
                    </div>
                </div>
                <div class="item online">
                    <div class="icon">
                        <span class="material-symbols-outlined">
                            shopping_cart
                            </span>
                    </div>
                    <div class="right">
                        <div class="info">
                            <h3>TOTAL TRIPS</h3>
                            <small class="text-muted">Last 24 Hours</small>
                        </div>
                        <h5 class="success">+39%</h5>
                        <h3>3849</h3>
                    </div>
                </div>
                <div class="item customers">
                    <div class="icon">
                        <span class="material-symbols-outlined">
                            person
                            </span>
                    </div>
                    <div class="right">
                        <div class="info">
                            <h3>NEW USERS</h3>
                            <small class="text-muted">Last 24 Hours</small>
                        </div>
                        <h5 class="success">+25%</h5>
                        <h3>849</h3>
                    </div>
                </div>
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
 <script src="AdminCW.js"></script>
 <script src="AdminCW-crud.js"></script>
 <script src="AdminCWAdd.js"></script>
</body>
</html>