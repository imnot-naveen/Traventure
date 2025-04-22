<?php
    include '../../Session_check.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TSP Profile | Admin</title>
  <link rel="stylesheet" href="AdminDriver-profile.css">
  <link rel="stylesheet" href="AdminDriver-updateModal.css">
  <link rel="stylesheet" href="AdminDriver-Deactivate-Modal.css">
  <link rel="stylesheet" href="../../LogoutModal/logoutModal.css">
  <link rel="stylesheet" href="../../Sidebar/Sidebar.css">
  <link rel="stylesheet" href="../../Recent_updates/Recent.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
</head>
<body>
  <div class="container">
  <?php include '../../Sidebar/Sidebar.php'; ?>
    <main>
            <h1>Driver Profile</h1>
            <div class="insights">
                <div class="sales">
                    <div class="profile-header">
                        <img src="../../../assets/img/AvatarMaker.png" alt="Admin Profile Picture" class="profile-picture">
                        <div class="profile-info">
                            <h2 id="driverName">TSP Not found</h2>
                            <h3>Driver</h3>
                            <p>Status: <span id="driverStatus" class="status active">Acti</span></p>
                        </div>
                    </div>
                    <div class="profile-details">
                        <div class="profile-details">
                            <ul class="left-details">
                                <li>Email: <span id="driverEmail">email not found</span></li>
                                <li>Phone: <span id="driverContact">Contact no: Not found</span></li>
                            </ul>
                            <ul class="right-details">
                                <li>Role: Driver</li>
                                <li>Driver ID: <span id="driverid">Driver: Not found</span></li>
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
                    <h3>Are you sure you want to deactivate this Driver?</h3>
                    <button id="confirmDeactivateBtn">Yes, Deactivate</button>
                    <button id="cancelDeactivateBtn">Cancel</button>
                </div>
            </div>
            <a href=""></a>            

        </main>

        <div class="right">
            <?php include '../../Recent_updates/Recent.php'; ?>
        </div>
  </div>

  <?php include '../../LogoutModal/logoutModal.php'; ?>
    
 <script src="../../LogoutModal/logoutModal.js"></script>
 <script src="AdminTsp-profile.js"></script>
 <script src="AdminTsp-profile-crud.js"></script>
 <script src="AdminTsp-profile-edit.js"></script>
</body>
</html>