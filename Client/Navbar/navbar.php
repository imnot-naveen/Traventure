<?php
session_start();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Navbar</title>
    <link rel="stylesheet" href="path/to/your/styles.css">
</head>
<body>
    <nav>
        <div class="navbar-container">
            <div id="logo">
                <a href="#home"><img src="../assets/logo/logo.png" alt="logo"></a>
            </div>
            <div class="menu-toggle" id="menu-toggle">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
            <ul class="nav-menu" id="nav-menu">
                <li><a href="../Home/home.html">Home</a></li>
                <li><a href="../Destinations/destinations.html">Destinations</a></li>
                <li><a href="../Train Schedule Form/scheduleForm.html">Train Schedule</a></li>
                <li><a href="../About/About.html">About Us</a></li>
                
                <?php if (isset($_SESSION['username'])): ?>
                    <li id="user-greeting">
                        <a href="../Profile/profile.php" id="profile-link">
                            <img src="../assets/icons/user.png" alt="userimg" class="user-icon-img">
                            <span>Hi, <?= htmlspecialchars($_SESSION['username']); ?></span>
                        </a>
                    </li>
                <?php else: ?>
                    <li id="login-link">
                        <a href="../Login/LoginPage.html">Login</a>
                    </li>
                <?php endif; ?>
            </ul>
        </div>
    </nav>

    <script src="path/to/navbar.js"></script>
</body>
</html>