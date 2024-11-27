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
  <title>TSP Profile | Admin</title>
  <link rel="stylesheet" href="AdminTsp-profile.css">
  <link rel="stylesheet" href="AdminTsp-updateModal.css">
  <link rel="stylesheet" href="AdminTsp-Deactivate-Modal.css">
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
                <a href="../../AdminUsers/AdminUsers.php">
                    <span class="material-symbols-outlined">
                        manage_accounts
                    </span>
                    <h3>Users</h3>
                </a>
                <a href="#"  class="active">
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
            <h1>TSP Profile</h1>
            <div class="insights">
                <div class="sales">
                    <div class="profile-header">
                        <img src="../../../assets/img/AvatarMaker.png" alt="Admin Profile Picture" class="profile-picture">
                        <div class="profile-info">
                            <h2 id="tspName">TSP Not found</h2>
                            <h3>Train Service Provider</h3>
                            <p>Status: <span id="tspStatus" class="status active">Acti</span></p>
                        </div>
                    </div>
                    <div class="profile-details">
                        <div class="profile-details">
                            <ul class="left-details">
                                <li>Email: <span id="tspEmail">email not found</span></li>
                                <li>Phone: <span id="tspContact">Contact no: Not found</span></li>
                            </ul>
                            <ul class="right-details">
                                <li>Role: TSP</li>
                                <li>TSP ID: <span id="tspid">Tsp: Not found</span></li>
                            </ul>
                        </div>
                        <div class="action-buttons">
                          <button class="update-button">Update</button>
                          <button id="deactivateBtn" class="deactivate-button">
                            Deactivate
                          </button>
                      </div>
                    </div>
                </div>
            </div>

            <!-- END OF INSIGHTS -->
            <div class="recent-orders">
                <h2>Trains Added</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Train ID</th>
                            <th>Name</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>T001</td>
                            <td>Blue Express</td>
                            <td>Intercity</td>   
                        </tr>
                        <tr>
                            <td>T001</td>
                            <td>Blue Express</td>
                            <td>Intercity</td>   
                        </tr>
                        <tr>
                            <td>T001</td>
                            <td>Blue Express</td>
                            <td>Intercity</td>   
                        </tr>
                        <tr>
                            <td>T001</td>
                            <td>Blue Express</td>
                            <td>Intercity</td>   
                        </tr>
                        
                    </tbody>
                </table>
                <a href="../AdminBookings/AdminBookings.php">Show All</a>
             </div>

            <!-- Modal Structure -->
            <div id="updateTspModal" class="modal">
                <div class="modal-content">
                    <span class="close-u">&times;</span>
                    <h2>Update Travel Service Provider</h2>
                    <form id="updateTspForm">
                        <input type="hidden" id="tspId" name="tspId" />

                        <label for="tspFirstName">First Name:</label>
                        <input type="text" id="tspFirstName" name="firstName" placeholder="First Name" />
                        
                        <label for="tspLastName">Last Name:</label>
                        <input type="text" id="tspLastName" name="lastName" placeholder="Last Name"  />
                        
                        <label for="tspPhone">Phone:</label>
                        <input 
                            type="tel" 
                            id="tspPhone" 
                            name="contactNumber" 
                            placeholder="Enter Sri Lankan Phone Number" 
                            pattern="0[0-9]{2}[0-9]{7}" 
                            maxlength="10" 
                            minlength="10" 
                            required 
                            title="Phone number must be a valid Sri Lankan number (e.g., 0771234567 or 0112345678)." 
                        />
                        
                        <button type="submit">Update</button>
                    </form>
                </div>
            </div>

            <!--Deactivate Modal -->
            <div id="deactivateModal" class="modal-d">
                <div class="modal-d-content">
                    <span class="close-btn" id="closeModal-d">&times;</span>
                    <h3>Are you sure you want to deactivate this TSP?</h3>
                    <button id="confirmDeactivateBtn">Yes, Deactivate</button>
                    <button id="cancelDeactivateBtn">Cancel</button>
                </div>
            </div>
            <a href=""></a>            

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

 <script src="AdminTsp-profile.js"></script>
 <script src="AdminTsp-profile-crud.js"></script>
 <script src="AdminTsp-profile-edit.js"></script>
</body>
</html>