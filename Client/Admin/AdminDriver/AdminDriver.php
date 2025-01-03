<?php
    // include '../Session_check.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Users | Admin</title>
  <link rel="stylesheet" href="AdminDriver.css">
  <link rel="stylesheet" href="AdminDriverAdd.css">
  <link rel="stylesheet" href="../Common/Logout_Modal.css">
  <link rel="stylesheet" href="../Sidebar/Sidebar.css">
  <link rel="stylesheet" href="../Recent_updates/Recent.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
</head>
<body>
  <div class="container">
  <?php include '../Sidebar/Sidebar.php'; ?>
    <main>
            <h1>Drivers</h1>
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
            <!-- END OF INSIGHTS -->
             <div class="recent-orders">
                <h2>Drivers Details</h2>
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
                    <button id="Add-user">Add Driver</button>
                  </div>
                  <div id="userModal" class="modal">
                    <div class="modal-content">
                      <span class="close">&times;</span>
                      <h2>Add New Driver</h2>
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
            <?php include '../Recent_updates/Recent.php'; ?>
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
 <script src="AdminDriver-crud-v3.js"></script>
 <script src="AdminDriver.js"></script>
 <script src="AdminDriverAdd.js"></script>
</body>
</html>