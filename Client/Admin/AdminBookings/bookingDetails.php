<!-- bookingDetails.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Booking Details</title>
  <link rel="stylesheet" href="../Sidebar/Sidebar.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
  <link rel="stylesheet" href="../Common/Logout_Modal.css">
  <link rel="stylesheet" href="bookingDetails/bookingDetails.css">
  <link rel="stylesheet" href="../Recent_updates/Recent.css">
</head>
<body>
<div class="container">
<?php include '../Sidebar/Sidebar.php'; ?>
<main>
  <h1>Booking Details</h1>
  <div id="detailsContainer"></div>
</main>
<div class="right">
    <?php include '../Recent_updates/Recent.php'; ?>
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
 <script src="../Recent_updates/Recent.js"></script>
 <script src="DownloadCSV.js"></script>
  <script src="bookingDetails/bookingDetails.js"></script>
  <script src="../Sidebar/Sidebar.js"></script>
</body>
</html>
