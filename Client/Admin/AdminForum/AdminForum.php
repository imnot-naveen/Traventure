<?php
    include '../Session_check.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard</title>
  <link rel="stylesheet" href="AdminForum.css">
  <link rel="stylesheet" href="../LogoutModal/logoutModal.css">
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
 
  <?php include '../LogoutModal/logoutModal.php'; ?>

  <script src="../LogoutModal/logoutModal.js"></script>
  <script src="AdminForum.js"></script>
  <script src="../Recent_updates/Recent.js"></script>
</body>
</html>