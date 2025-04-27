<?php
    include '../../Session_check.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>User Profile | Admin</title>
  <link rel="stylesheet" href="AdminUserProfile-v2.css">
  <link rel="stylesheet" href="AdminUser-updateModal.css">
  <link rel="stylesheet" href="AdminUser-Deactivate-Modal.css">
  <link rel="stylesheet" href="../../LogoutModal/logoutModal.css">
  <link rel="stylesheet" href="../../Sidebar/Sidebar.css">
  <link rel="stylesheet" href="../../Recent_updates/Recent.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
</head>
<body>
  <div class="container">
  <?php include '../../Sidebar/Sidebar.php'; ?>
    <main>
            <h1>User Profile</h1>
            <div class="insights">
                <div class="sales">
                    <div class="profile-header">
                        <img src="../../../assets/img/AvatarMaker.png" alt="Admin Profile Picture" class="profile-picture">
                        <div class="profile-info">
                            <h2 id="userName">User Not found</h2>
                            <h3>User</h3>
                            <p>Status: <span id="userStatus" class="status active">loading..</span></p>
                        </div>
                    </div>
                    <div class="profile-details">
                            <ul class="left-details">
                                <li>Email: <span id="userEmail">not found</span></li>
                                <li>Phone: <span id="userContact">Not found</span></li>
                            </ul>
                            <ul class="right-details">
                                <li>Role: User</li>
                                <li>User ID: <span id="userid">Not found</span></li>
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

            <!-- END OF INSIGHTS -->
            <div class="recent-orders">
                <h2>User Bookings</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>Start Station</th>
                            <th>End Station</th>
                            <th>Class</th>
                            <th>No of Passengers</th>
                            <th>Kids Count</th>
                            <th>Total Fare</th>
                            <th>Payment Method</th>
                            <th>Booking Date</th>
                            <th>Train</th>
                        </tr>
                    </thead>
                    <tbody id="BookingTableBody">      
                    </tbody>
                </table>
                <div class="pagination">
                    <button id="prevBtn" onclick="prevPage()">Previous</button>
                    <span id="pageInfo"></span>
                    <button id="nextBtn" onclick="nextPage()">Next</button>
                </div>
             </div>

            <!-- Modal Structure -->
             <div id="updateUserModal" class="modal">
                <div class="modal-content">
                    <span class="close-u">&times;</span>
                    <h2>Update User</h2>
                    <form id="updateUserForm">
                        <input type="hidden" id="userId" name="userId" />

                        <label for="userFirstName">First Name:</label>
                        <input 
                            type="text" 
                            id="userFirstName" 
                            name="firstName" 
                            placeholder="First Name" 
                            required 
                        />

                        <label for="userLastName">Last Name:</label>
                        <input 
                            type="text" 
                            id="userLastName" 
                            name="lastName" 
                            placeholder="Last Name" 
                            required 
                        />

                        <label for="userPhone">Phone:</label>
                        <input 
                            type="tel" 
                            id="userPhone" 
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
                    <h3>Are you sure you want to deactivate this User?</h3>
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
 <script src="AdminUserProfile.js"></script>
 <script src="AdminUser-profile-edit.js"></script>
 <script src="AdminUserProfile-crud.js"></script>
 <script src="../../Recent_updates/Recent.js"></script>
 <script src="GetBookings.js"></script>
</body>
</html>