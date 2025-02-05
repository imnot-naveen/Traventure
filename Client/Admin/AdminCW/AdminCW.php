<?php
    // include '../Session_check.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Writer | Admin</title>
  <link rel="stylesheet" href="AdminCW.css">
  <link rel="stylesheet" href="AdminCWAdd.css">
  <link rel="stylesheet" href="../Common/Logout_Modal.css">
  <link rel="stylesheet" href="../Sidebar/Sidebar.css">
  <link rel="stylesheet" href="../Recent_updates/Recent.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
</head>
<body>
  <div class="container">
  <?php include '../Sidebar/Sidebar.php'; ?>
    <main>
            <h1>Content Writers</h1>
            <div class="insights">
                <div class="sales">
                    <span class="material-symbols-outlined">
                        group_add
                        </span>
                    <div class="middle">
                        <div class="left">
                            <h3>Total CWs</h3>
                            <h1 id="cwCount">Loading..</h1>
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
                        train
                        </span>
                    <div class="middle">
                        <div class="left">
                            <h3>Articles Added</h3>
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
                        cancel
                        </span>
                    <div class="middle">
                        <div class="left">
                            <h3>Trains Cancalled</h3>
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

            </div>
            <!-- END OF INSIGHTS -->
             <div class="recent-orders">
                <h2>CWs Details</h2>
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
                    <button id="Add-user">Add CW</button>
                  </div>
                  <div id="userModal" class="modal">
                    <div class="modal-content">
                      <span class="close-m">&times;</span>
                      <h2>Add New CW</h2>
                      <form id="addCWForm">
                        <div class="form-group">
                          <label for="cwid">CW ID</label>
                          <input type="number" id="cwid" name="cwid" required autocomplete="off">
                        </div>
                        
                        <div class="form-group">
                          <label for="username">Username</label>
                          <input type="text" id="username" name="username" required autocomplete="username">
                        </div>
                        
                        <div class="form-group">
                          <label for="firstName">First Name</label>
                          <input type="text" id="firstName" name="firstName" required autocomplete="given-name">
                        </div>
                        
                        <div class="form-group">
                          <label for="lastName">Last Name</label>
                          <input type="text" id="lastName" name="lastName" required autocomplete="family-name">
                        </div>
                        
                        <div class="form-group">
                          <label for="email">Email</label>
                          <input type="email" id="email" name="email" required autocomplete="email">
                        </div>
                        
                        <div class="form-group">
                          <label for="contactNumber">Contact Number</label>
                          <input type="tel" id="contactNumber" name="contactNumber" pattern="[0-9]{10}" title="Enter a 10-digit phone number" required autocomplete="tel">
                        </div>
                        
                        <div class="form-group">
                          <label for="new-password">Password</label>
                          <input type="password" id="new-password" name="new-password" required autocomplete="new-password">
                        </div>
                        
                        <div class="form-group">
                          <label for="confirm-password">Confirm Password</label>
                          <input type="password" id="confirm-password" name="confirm-password" required autocomplete="new-password">
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
                            <th>CW ID</th>
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
 <script src="AdminCW-crud.js"></script>
 <script src="AdminCW.js"></script>
 <script src="AdminCWAdd.js"></script>
</body>
</html>