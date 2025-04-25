<?php
    include '../Session_check.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Analytics</title>
  <link rel="stylesheet" href="AdminAnalytics.css">
  <link rel="stylesheet" href="../Sidebar/Sidebar.css">
  <link rel="stylesheet" href="../Recent_updates/Recent.css">
  <link rel="stylesheet" href="../LogoutModal/logoutModal.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
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
                            <h3>Total Trips</h3>
                            <h1>4</h1>
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
                            <h3>Total Booking Revenue</h3>
                            <h1 id="revenue">$10,123</h1>
                        </div>
                    </div>
                    <small class="text-muted">
                        Last Month
                    </small>
                </div>

            </div>
            <!-- END OF INSIGHTS -->
             <div class="charts">
                <div class="chart-container">
                    <h2>Yearly Booking Trend</h2>
                    <canvas id="bookingChart" width="600" height="200"></canvas>
                </div>
                <div class="chart-container">
                    <h2>Yearly User Growth</h2>
                    <canvas id="userChart" width="600" height="200"></canvas>
                </div>
             </div> 
             <div class="Downloads">
                <h2>Download Monthly Reports</h2>
                <p>You can download the latest monthly report PDF for bookings, users, and trips.</p>
                <button id="downloadReport">Download Report</button>
              </div>              
        </main>

    <div class="right">
    <?php include '../Recent_updates/Recent.php'; ?>
    </div>

    <?php include '../LogoutModal/logoutModal.php'; ?>

 <script src="AdminAnalytics.js"></script>
 <script src="userGrowth.js"></script>
 <script src="../Recent_updates/Recent.js"></script>
 <script src="DownloadPDF.js"></script>
 <script src="bookingGrowth.js"></script>
 <script src="../LogoutModal/logoutModal.js"></script>
</body>
</html>