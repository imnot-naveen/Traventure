<?php
session_start(); // Start the session
// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    header("Location: ../login/loginpage.html"); // Redirect to login if not logged in
    exit();
}
// Get the username from the session
$username = $_SESSION['username'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile Page</title>
    <link rel="stylesheet" href="profile.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css">
    <link rel="stylesheet" href="../Navbar/navbar.css" />
    <link rel="stylesheet" href="../Footer/footer.css" />
    <script>
        // Pass the username from PHP to JavaScript
        const username = "<?php echo htmlspecialchars($_SESSION['username']); ?>"; // Use htmlspecialchars to prevent XSS
    </script>
</head>
<body>
<nav id="navbar-placeholder"></nav>
    <div class="container">
        <div class="header">
            <div class="user-info">
                <h1 class="name">User Name</h1>
                <span class="username">@<?php echo htmlspecialchars($username); ?></span>
            </div>
            <button class="logout-btn"><i class="fas fa-sign-out-alt"></i> Log out</button>
        </div>
        
        <div class="card-container">
            <div class="profile-card">
                <div class="card-header">
                    <h2>Personal Information</h2>
                    <a href="#" class="edit-profile"><i class="fas fa-pen"></i> Edit</a>
                </div>
                
                <form class="profile-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="first-name">First Name</label>
                            <input type="text" id="first-name" placeholder="First Name" disabled>
                        </div>
                        <div class="form-group">
                            <label for="last-name">Last Name</label>
                            <input type="text" id="last-name" placeholder="Last Name" disabled>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="email"><i class="fas fa-envelope"></i> Email</label>
                            <input type="email" id="email" placeholder="Email" disabled>
                        </div>
                        <div class="form-group">
                            <label for="contact-number"><i class="fas fa-phone"></i> Contact Number</label>
                            <input type="text" id="contact-number" placeholder="Contact Number" disabled>
                        </div>
                    </div>
                    
                    <div class="form-group destinations-group">
                        <label><i class="fas fa-map-marker-alt"></i> Preferred Destinations</label>
                        <div class="destinations-container">
                            <!-- Destinations will be populated here dynamically -->
                        </div>
                    </div>
                    
                    <button type="button" class="save-btn">Save Changes</button>
                </form>
            </div>
            
            <div class="action-links">
                <a href="../userTrips/userTrips.html" class="action-link">
                    <i class="fas fa-suitcase"></i>
                    <span>Trip History</span>
                </a>
                <a href="../Bookinghistory/bookingHistory.php" id="booking-history" class="action-link">
                    <i class="fas fa-history"></i>
                    <span>Booking History</span>
                </a>
            </div>
        </div>
    </div>
    <footer id="footer"></footer>
    <script src="profile.js"></script>
    <script src="../Navbar/navbar.js"></script>
    <script>
      // Function to load the Navbar
      function loadNavbar() {
        fetch("../Navbar/navbar.php")
          .then((response) => response.text())
          .then((data) => {
            document.getElementById("navbar-placeholder").innerHTML = data;
            // Initialize the navbar functionalities
            document
              .getElementById("menu-toggle")
              .addEventListener("click", function () {
                const navMenu = document.getElementById("nav-menu");
                navMenu.classList.toggle("active");
              });

            // Set the initial state
            updateNavbarState(false); // Set initial state (false means not logged in)
          });
      }

      // Function to load the Footer
      function loadFooter() {
        fetch("../Footer/footer.html")
          .then((response) => response.text())
          .then((data) => {
            document.getElementById("footer").innerHTML = data;
          });
      }

      document.addEventListener("DOMContentLoaded", function () {
        loadNavbar();
        loadFooter();
      });

      // Handle login state (optional)
      function handleLogin(event) {
        event.preventDefault();
        // Simulate login action
        updateNavbarState(true); // Set state to logged in
      }

      function handleLogout(event) {
        event.preventDefault();
        // Simulate logout action
        updateNavbarState(false); // Set state to logged out
      }

      function updateNavbarState(isLoggedIn) {
        if (isLoggedIn) {
          document.getElementById("login-link").classList.add("hidden");
          document.getElementById("user-icon").classList.remove("hidden");
        } else {
          document.getElementById("login-link").classList.remove("hidden");
          document.getElementById("user-icon").classList.add("hidden");
        }
      }
    </script>
</body>
</html>