<?php
// include '../Session_check.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard</title>
  <link rel="stylesheet" href="AdminDashboard.css">
  <link rel="stylesheet" href="../Common/Logout_Modal.css">
  <link rel="stylesheet" href="../Sidebar/Sidebar.css">
  <link rel="stylesheet" href="../Recent_updates/Recent.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
</head>
<body>
  <div class="container">
  <?php include '../Sidebar/Sidebar.php'; ?>
    <main>
            <h1>Admin Dashboard</h1>
            <div class="insights">
                <div class="sales">
                <div class="profile-header">
            <img src="../../assets/img/AvatarMaker.png" alt="Admin Profile Picture" class="profile-picture" id="adminPicture">
            <div class="profile-info">
                <h2 id="adminName">Admin Name</h2>
                <h3 id="adminRole">Admin Role</h3>
            </div>
        </div>
        <div class="profile-details">
            <ul class="left-details">
                <li id="adminEmail">Email: admin@example.com</li>
                <li id="adminPhone">Phone: +94 71 234 5678</li>
            </ul>
            <ul class="right-details">
                <li id="adminRoleDetail">Role: Administrator</li>
                <li id="adminUsername">Username: dimuthu</li>
            </ul>
        </div>
                 
                </div>
            </div>

            <!-- END OF INSIGHTS -->
             <div class="recent-orders">
                <h2>Recent Bookings</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>User</th>
                            <th>Starting Station</th>
                            <th>Destination</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>10002</td>
                            <td>Dimuthu Harshamal</td>
                            <td>Fort</td>
                            <td>Kandy</td>
                            <td>$20.00</td>   
                        </tr>
                        <tr>
                            <td>10003</td>
                            <td>John Doe</td>
                            <td>Fort</td>
                            <td>Galle</td>
                            <td>$13.00</td>   
                        </tr>
                        <tr>
                            <td>10004</td>
                            <td>Kavindu Perera</td>
                            <td>Maradana</td>
                            <td>Badulla</td>
                            <td>$220.00</td>   
                        </tr>
                        <tr>
                            <td>10005</td>
                            <td>Kamal Gunarathne</td>
                            <td>Kalutara</td>
                            <td>Beliatta</td>
                            <td>$30.00</td>   
                        </tr>
                        <tr>
                            <td>10006</td>
                            <td>Tharushi Senarathne</td>
                            <td>Maho</td>
                            <td>Ambewela</td>
                            <td>$22.00</td>   
                        </tr>
                    </tbody>
                </table>
                <a href="../AdminBookings/AdminBookings.php">Show All</a>
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

  <script src="AdminDashboard.js"></script>
  <script src="../Common/Logout_Modal.js"></script>
</body>
</html>