<?php

session_start();
// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    header("Location: ../login/loginpage.html"); // Redirect to login if not logged in
    exit();
}

if (trim($_SESSION['userType']) !== "Traveller") {
    header(header: "Location: ../Home/home.html"); // If not authorized, redirect to homepage
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
    <title>Plan Your Journey</title>
    <link rel="stylesheet" href="createTrip.css">
    <link rel="stylesheet" href="../Navbar/navbar.css" />
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>

</head>
<body>
  <nav id="navbar-placeholder"></nav>
    <div class="middle-section">
        <div class="form-container">
            <div class="left-panel">
            <h2><span class="highlight">Plan</span> Your Journey</h2>

            </div>
            
            <div class="right-panel">
            <form>
                <h3><i class='bx bx-train'></i> Select Train Details</h3>

                <div class="form-group">
                    <label for="start-station">Start Station</label>
                    <select id="start-station" name="start-station">
                        <option value="">Select</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="end-station">End Station</label>
                    <select id="end-station" name="end-station">
                        <option value="">Select</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="search-date">Date</label>
                    <input type="date" id="search-date" name="search-date">
                </div>
                <div class="form-group">
                    <label for="train-class">Train Seat Class</label>
                    <select id="train-class" name="train-class">
                        <option value="">Select class</option>
                        <option value="first">1st Class</option>
                        <option value="second">2nd Class</option>
                        <option value="third">3rd Class</option>
                    </select>
                </div>
                <h3><i class='bx bx-user'></i> Fill Passenger Details</h3>
                <div class="form-group">
                    <label for="total-passengers">Total No. of Passengers</label>
                    <input type="number" id="total-passengers" name="total-passengers" min="1" max="10" placeholder="Enter total passengers">
                </div>
                <div class="form-group">
                    <label for="children">No. of Children</label>
                    <input type="number" id="children" name="children" min="0" max="10" placeholder="Enter no. of children">
                </div>
                <div class="form-group">
                    <label for="adults">No. of Adults</label>
                    <input type="number" id="adults" name="adults" readonly placeholder="Will be auto-filled">
                </div>
                <div class="buttons">
                    <button type="button">Search</button>
                    <button type="reset" class="reset">Reset</button>
                </div>
            </form>

            </div>
        </div>
    </div>
    <div class="bottom-section"></div>
    <script src="createTrip.js"></script>
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
