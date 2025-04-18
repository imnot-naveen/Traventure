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
                    <h2 id="adminName">Loading...</h2>
                    <h3 id="adminRole">Admin</h3>
                </div>
            </div>
            <div class="profile-details">
                <ul class="left-details">
                    <li id="adminEmail">Email: Loading...</li>
                    <li id="adminPhone">Phone: Loading...</li>
                </ul>
                <ul class="right-details">
                    <li id="adminRoleDetail">Role: Admin</li>
                    <li id="adminUsername">Username: Loading...</li>
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
                            <th>Total Fare</th>
                            <th>Booking Date</th>
                        </tr>
                    </thead>
                    <tbody id="booking-table-body">
                    </tbody> 
                        <script>
                        fetch('http://localhost/Traventure/Server/api/getAllBookings.php') 
                        .then(res => res.json())
                        .then(data => {
                            const tbody = document.getElementById('booking-table-body');
                            if (data.success) {
                                data.data.forEach(booking => {
                                    const row = document.createElement('tr');
                                    row.innerHTML = `
                                        <td>${booking.bookingID}</td>
                                        <td>${booking.userID}</td>
                                        <td>${booking.start_station}</td>
                                        <td>${booking.total_fare}</td>
                                        <td>$${booking.bookingDate}</td>
                                    `;
                                    tbody.appendChild(row);
                                });
                            } else {
                                tbody.innerHTML = `<tr><td colspan="5">${data.message}</td></tr>`;
                            }
                        })
                        .catch(err => {
                            console.error(err);
                            document.getElementById('booking-table-body').innerHTML =
                                `<tr><td colspan="5">Failed to load bookings.</td></tr>`;
                        });
                    </script>
                
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
  <script src="../Recent_updates/Recent.js"></script>
</body>
</html>