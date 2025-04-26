<?php
    include '../Session_check.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Drivers | Admin</title>
  <link rel="stylesheet" href="AdminDriver.css">
  <link rel="stylesheet" href="AdminDriverAdd.css">
  <link rel="stylesheet" href="../LogoutModal/logoutModal.css">
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
                            <h3>Total Drivers</h3>
                            <h1 id="driverCount">3</h1>
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
                            <h3>Requests</h3>
                            <h1 id="reqCount">43</h1>
                        </div>
                    </div>
                    <small class="text-muted">
                        Last 30 Days
                    </small>
                </div>

            </div>
            <!-- END OF INSIGHTS -->
             <div class="recent-orders">
                <!-- <h2>Drivers Details</h2> -->
                <div class="search-container">
                    <input
                      type="text"
                      id="searchBar"
                      class="search-input"
                      placeholder="Search users by name..."
                      oninput="filterUsers()"
                    />
                  </div>
                  <div class="Add-driver">
                    <button id="Add-driver">Add Driver</button>
                  </div>
                  <div id="driverModal" class="modal">
                    <div class="modal-content">
                      <form id="addDriverForm">
                        <div class="form-group">
                          <label for="username">Username</label>
                          <input type="text" id="username" name="username" required autocomplete="username">
                        </div>
                        
                        <div class="form-group">
                          <label for="firstName">First Name</label>
                          <input type="text" id="firstName" name="firstName" 
                                required 
                                autocomplete="given-name" 
                                pattern="[A-Za-z]+" 
                                title="First name should contain letters only">
                        </div>

                        
                        <div class="form-group">
                          <label for="lastName">Last Name</label>
                          <input type="text" id="lastName" name="lastName" required 
                          autocomplete="given-name" 
                          pattern="[A-Za-z]+" 
                          title="First name should contain letters only">
                        </div>

                        <div class="form-group">
                          <label for="nic">NIC No</label>
                          <input type="text" id="nic" name="nic" 
                                required 
                                pattern="^(\d{9}[vVxX]|\d{12})$" 
                                title="Enter a valid NIC: 9 digits followed by V/X or 12 digits">
                        </div>

                        
                        <div class="form-group">
                          <label for="email">Email</label>
                          <input type="email" id="email" name="email" required autocomplete="email">
                        </div>
                        
                        <div class="form-group">
                          <label for="contactNumber">Contact Number</label>
                          <input 
                            type="tel" 
                            id="contactNumber" 
                            name="contactNumber" 
                            pattern="\d{10}" 
                            title="Enter a valid 10-digit phone number" 
                            required 
                            autocomplete="tel">
                        </div>

                        <div class="form-group">
                          <label for="maxPassengers">Max Passengers</label>
                          <input 
                            type="number" 
                            id="maxPassengers" 
                            name="maxPassengers" 
                            min="1" 
                            max="99" 
                            required 
                            title="Enter a number between 1 and 99">
                        </div>

                        <div class="form-group">
                          <label for="station">Assigned Station</label>
                          <input type="tel" id="station" name="station" title="Enter a 10-digit phone number" required >
                        </div>

                        <div class="form-group">
                          <label for="vehicle">Vehicle ID</label>
                          <input 
                            type="text" 
                            id="vehicle" 
                            name="vehicle" 
                            pattern="^[A-Z]{2,3}[- ]?[0-9]{3,5}$"
                            required 
                            title="Enter only numeric Vehicle ID">
                        </div>

                        <div class="form-group">
                          <label for="license">Driving License</label>
                          <input 
                            type="text" 
                            id="license" 
                            name="license" 
                            pattern="^[A-Za-z]{1,2}-\d{7}$" 
                            required 
                            title="Enter a valid Sri Lankan driver's license (e.g., P-1234567)">
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
                            <th>Driver ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Vehicle</th>
                            <th>Licence</th>
                            <th>Contact Number</th>
                        </tr>
                    </thead>
                    <tbody id="driverTableBody">
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
 <script src="AdminDriver-crud-v3.js"></script>
 <script src="AdminDriver.js"></script>
 <script src="AdminDriverAdd.js"></script>
 <script src="../Recent_updates/Recent.js"></script>
 
</body>
</html>