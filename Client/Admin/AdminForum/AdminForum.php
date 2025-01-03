<?php
    // include '../Session_check.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard</title>
  <link rel="stylesheet" href="AdminForum.css">
  <link rel="stylesheet" href="../Common/Logout_Modal.css">
  <link rel="stylesheet" href="../Sidebar/Sidebar.css">
  <link rel="stylesheet" href="../Recent_updates/Recent.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
</head>
<body>
  <div class="container">
  <?php include '../Sidebar/Sidebar.php'; ?>
    <main>
            <h1>Forum</h1>
            <div class="insights">
            </div>
            <!-- END OF INSIGHTS -->
             <div class="recent-orders">
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
  <script src="AdminForum.js"></script>
</body>
</html>