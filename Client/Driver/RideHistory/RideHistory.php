<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Driver | Requests</title>
  <link rel="stylesheet" href="../Dashboard/dashboard.css">
  <link rel="stylesheet" href="RideHistory.css">
  <!-- Boxicons CDN -->
  <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
</head>
<body>
<div class="sidebar">
    <div class="sidebar-header">
        <i class='bx bxs-car' style="font-size: 40px;"></i>
        <h1>Driver</h1>
    </div>
    
    <ul class="nav-menu">
        <li>
            <a href="../RideRequests/RideRequests.php">
                <i class='bx bxs-traffic-barrier' style="font-size: 24px;"></i>
                Ride Requests
            </a>
        </li>
        <li>
            <a href="../RideHistory/RideHistory.php">
                <i class='bx bxs-time-five' style="font-size: 24px;"></i>
                Ride History
            </a>
        </li>
    </ul>

    <a href="#" class="logout-btn" title="Logout">
        <i class='bx bx-log-out' style="font-size: 20px;"></i>
        Logout
    </a>
</div>

<div class="main-content">
    <h2 class="dashboard-title">Ride History</h2>
    <div id="history-container" class="history-list">
        <!-- Ride requests will appear here -->
    </div>
</div>

<script src="RideHistory.js"></script>
</body>
</html>
