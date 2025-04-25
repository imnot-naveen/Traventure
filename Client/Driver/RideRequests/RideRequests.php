<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Driver | Requests</title>
  <link rel="stylesheet" href="../Dashboard/dashboard.css">
  <link rel="stylesheet" href="RideRequests.css">
</head>
<body>
<div class="sidebar">
        <div class="sidebar-header">
            <img src="logo.png" alt="Traventure Logo">
            <h1>Driver</h1>
        </div>
        
        <ul class="nav-menu">
            <li>
                <a href="../RideRequests/RideRequests.php">
                    <img src="train-icon.png" alt="Manage Trains">
                    Ride Requests
                </a>
            </li>
            <li>
                <a href="../RideHistory/RideHistory.php">
                    <img src="destination-icon.png" alt="Manage Destinations">
                    Ride History
                </a>
            </li>
        </ul> 

        <<a href="#" class="logout-btn" title="Logout">
    <img src="logout-icon.png" alt="Logout" style="width: 20px; height: 20px;">
    Logout
</a>
    </div>
    <div class="main-content">
        <h2 class="dashboard-title">Ride Requests</h2>
        <div id="requests-container" class="requests-list">
        <!-- Ride requests will appear here -->
        </div>
        </div>
    </div>

  <script src="RideRequests.js"></script>
</body>
</html>