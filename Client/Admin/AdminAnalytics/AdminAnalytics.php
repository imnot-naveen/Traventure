<?php
    // include '../Session_check.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Analytics</title>
  <link rel="stylesheet" href="AdminAnalytics.css">
  <link rel="stylesheet" href="../Common/Logout_Modal.css">
  <link rel="stylesheet" href="../Sidebar/Sidebar.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
</head>
<body> 
  <div class="container">
  <?php include '../Sidebar/Sidebar.php'; ?>
    <main>
            <h1>Analytics</h1>
            <div class="insights">
                <div class="sales">
                    <span class="material-symbols-outlined">analytics</span>
                    <div class="middle">
                        <div class="left">
                            <h3>Total Booking Sales</h3>
                            <h1>$25,056</h1>
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
                        Last 24 Hours
                    </small>
                </div>

                <div class="income">
                    <span class="material-symbols-outlined">
                        trending_up
                        </span>
                    <div class="middle">
                        <div class="left">
                            <h3>Total Income</h3>
                            <h1>$10,123</h1>
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
             <div class="charts">
                <div class="chart-container">
                    <h2>User Growth</h2>
                        <canvas id="lineChart" width="400" height="400"></canvas>
                 </div>
                 <div class="chart-container .booking-chart">
                    <h2>Bookings</h2>
                        <canvas id="lineChart2" width="400" height="400"></canvas>
                 </div>
             </div> 
             <div class="Downloads">
                <button class="Download" id="Booking">Download Bookings</button>
                <button class="Download" id="Users">Download User Growth</button>
              </div>              
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

            <!-- END OF TOP --> 
            <div class="recent-updates">
                <h2>Recent Updates</h2>
                <div class="updates">
                    <div class="update">
                        <div class="profile-photo">
                            <span class="material-symbols-outlined">
                                account_circle
                                </span>
                        </div>
                        <div class="message">
                            <p><b>John Doe</b> booked a train Maradana to Kandy.</p>
                            <small class="text-muted">2 Minutes Ago</small>
                        </div>
                    </div>
                    <div class="update">
                        <div class="profile-photo">
                            <span class="material-symbols-outlined">
                                account_circle
                                </span>
                        </div>
                        <div class="message">
                            <p><b>Virat Kohli</b> booked a train Kalutara to Panadura.</p>
                            <small class="text-muted">2 Minutes Ago</small>
                        </div>
                    </div>
                    <div class="update">
                        <div class="profile-photo">
                            <span class="material-symbols-outlined">
                                account_circle
                                </span>
                        </div>
                        <div class="message">
                            <p><b>Kylian Mbappe</b> booked a train Maradana to Galle.</p>
                            <small class="text-muted">2 Minutes Ago</small>
                        </div>
                    </div>
                </div>
             </div>
             <div class="sales-analytics">
                <h2>Analytics</h2>
                <div class="item online">
                    <div class="icon">
                        <span class="material-symbols-outlined">
                            local_mall
                            </span>
                    </div>
                    <div class="right">
                        <div class="info">
                            <h3>ONLINE BOOKINGS</h3>
                            <small class="text-muted">Last 24 Hours</small>
                        </div>
                        <h5 class="success">-17%</h5>
                        <h3>1100</h3>
                    </div>
                </div>
                <div class="item online">
                    <div class="icon">
                        <span class="material-symbols-outlined">
                            shopping_cart
                            </span>
                    </div>
                    <div class="right">
                        <div class="info">
                            <h3>TOTAL TRIPS</h3>
                            <small class="text-muted">Last 24 Hours</small>
                        </div>
                        <h5 class="success">+39%</h5>
                        <h3>3849</h3>
                    </div>
                </div>
                <div class="item customers">
                    <div class="icon">
                        <span class="material-symbols-outlined">
                            person
                            </span>
                    </div>
                    <div class="right">
                        <div class="info">
                            <h3>NEW USERS</h3>
                            <small class="text-muted">Last 24 Hours</small>
                        </div>
                        <h5 class="success">+25%</h5>
                        <h3>849</h3>
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
 <script src="../Common/Logout_Modal.js"></script>
 <script src="AdminAnalytics.js"></script>
 <script src="AdminAnalytics-lineChart.js"></script>
 <script src="AdminAnalytics-lineChart2.js"></script>

</body>
</html>