<?php
    include '../Session_check.php';
?>

<!-- bookingDetails.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Booking Details</title>
  <link rel="stylesheet" href="../Sidebar/Sidebar.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
  <link rel="stylesheet" href="../LogoutModal/logoutModal.css">
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

    <?php include '../LogoutModal/logoutModal.php'; ?>

 <script src="../LogoutModal/logoutModal.js"></script>
 <script src="../Recent_updates/Recent.js"></script>
 <script src="DownloadCSV.js"></script>
  <script src="bookingDetails/bookingDetails.js"></script>
  <script src="../Sidebar/Sidebar.js"></script>
</body>
</html>
