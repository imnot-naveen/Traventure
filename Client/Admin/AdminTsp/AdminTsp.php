<?php
    include '../Session_check.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TSPs | Admin</title>
  <link rel="stylesheet" href="AdminTsp.css">
  <link rel="stylesheet" href="AdminTspAdd.css">
  <link rel="stylesheet" href="../LogoutModal/logoutModal.css">
  <link rel="stylesheet" href="../Sidebar/Sidebar.css">
  <link rel="stylesheet" href="../Recent_updates/Recent.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
</head>
<body>
  <div class="container">
  <?php include '../Sidebar/Sidebar.php'; ?>
    <main>
            <h1>Train Service Providers</h1>
            <div class="insights">
                <div class="sales">
                    <span class="material-symbols-outlined">
                        group_add
                        </span>
                    <div class="middle">
                        <div class="left">
                            <h3>Total TSPs</h3>
                            <h1 id="tspCount">Loading..</h1>
                        </div>
                    </div>
                    <small class="text-muted">
                        Total
                    </small>
                </div>

            </div>
            <!-- END OF INSIGHTS -->
             <div class="recent-orders">
                <h2>TSPs Details</h2>
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
                    <button id="Add-user">Add TSP</button>
                  </div>
                  <div id="userModal" class="modal">
                    <div class="modal-content">
                      <span class="close-m">&times;</span>
                      <h2>Add New TSP</h2>
                      <form id="addTspForm">
                        <div class="form-group">
                          <label for="tspid">TSP ID</label>
                          <input type="number" id="tspid" name="tspid" required autocomplete="off">
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
                          <label for="IDNumber">NIC No</label>
                          <input type="text" id="IDNumber" name="IDNumber" required>
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
                            <th>TSP ID</th>
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

  <?php include '../LogoutModal/logoutModal.php'; ?>

 <script src="../LogoutModal/logoutModal.js"></script>
 <script src="AdminTsp-crud-v3.js"></script>
 <script src="AdminTsp.js"></script>
 <script src="AdminTspAdd.js"></script>
 <script src="../Recent_updates/Recent.js"></script>
</body>
</html>