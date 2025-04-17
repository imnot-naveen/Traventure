<?php
    include '../Session_check.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard</title>
  <link rel="stylesheet" href="AdminBookings.css">
  <link rel="stylesheet" href="../Common/Logout_Modal.css">
  <link rel="stylesheet" href="../Sidebar/Sidebar.css">
  <link rel="stylesheet" href="../Recent_updates/Recent.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
</head>
<body>
  <div class="container">
  <?php include '../Sidebar/Sidebar.php'; ?>
    <main>
            <h1>Booking Details</h1>
            <div class="insights">
                <div class="sales">
                    <span class="material-symbols-outlined">analytics</span>
                    <div class="middle">
                        <div class="left">
                            <h3>Total Revenue</h3>
                            <h1 id="totalRevenue">Loading</h1>
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

                <div class="expenses">
                    <span class="material-symbols-outlined">
                        bar_chart
                        </span>
                    <div class="middle">
                        <div class="left">
                            <h3>Total Bookings</h3>
                            <h1 id="totalBookings">Loading..</h1>
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
                        Last 24 Hours
                    </small>
                </div>

                <div class="income">
                    <span class="material-symbols-outlined">
                        trending_up
                        </span>
                    <div class="middle">
                        <div class="left">
                            <h3>Monthly Revenue</h3>
                            <h1 id="lastMonthRevenue">Loading..</h1>
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
                <h2>Recent Bookings</h2>
                <div class="search-container">
                    <input
                      type="text"
                      id="searchBar"
                      class="search-input"
                      placeholder="Search users by name..."
                      oninput="filterUsers()"
                    />
                  </div>
                <table>
                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>User</th>
                            <th>Train</th>
                            <th>No of passengers</th>
                            <th>Payment Status</th>
                            <th>Booking Date</th>
                            <th>Amount</th>
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
  <script src="AdminBookings.js"></script>
  <script src="../Recent_updates/Recent.js"></script>
</body>
</html>