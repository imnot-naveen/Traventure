<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Driver | Requests</title>
  
  <!-- Font Awesome CDN Link -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
  
  <link rel="stylesheet" href="../Dashboard/dashboard.css">
  <link rel="stylesheet" href="RideRequests.css">
</head>
<body>

<div class="sidebar">
    <div class="sidebar-header">
        <i class='bx bxs-car'></i>
        <h1>Driver</h1>
    </div>

    <ul class="nav-menu">
        <li>
            <a href="../RideRequests/RideRequests.php">
                <i class='bx bxs-traffic-barrier'></i>
                Ride Requests
            </a>
        </li>
        <li>
            <a href="../RideHistory/RideHistory.php">
                <i class='bx bxs-time-five'></i>
                Ride History
            </a>
        </li>
    </ul> 

    <a href="#" class="logout-btn" title="Logout">
        <i class="fas fa-sign-out-alt"></i>
        Logout
    </a>
</div>

<div class="main-content">
    <h2 class="dashboard-title">Ride Requests</h2>
    <div id="requests-container" class="requests-list">
        <!-- Ride requests will appear here -->
    </div>
</div>

<script src="RideRequests.js"></script>
</body>
</html>
