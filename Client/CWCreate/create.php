<?php

session_start();
// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    header("Location: ../login/loginpage.html"); // Redirect to login if not logged in
    exit();
}

if (trim($_SESSION['userType']) !== "CW") {
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
    <title>Traventure</title>
    <link rel="stylesheet" href="create.css">
    <link rel="stylesheet" href="../Navbar/navbar.css">
  <link rel="stylesheet" href="../Footer/footer.css">
</head>
    <body>
        <nav id="navbar-placeholder"></nav>
        
    <main>
        <section>>
            <h1>Create New Post</h1>
            <form action="addblogpost.php" method="POST" enctype="multipart/form-data">
            <div class="form-group">
            <label for="title">Title:</label>
            <input type="text" id="title" name="title">
            </div>
            <div class="form-group">
              <label for="intro">City</label>
              <input type="text" id="city" name="city">
            </div>
            <div class="form-group">
              <label for="intro">Introduction</label>
              <input type="text" id="intro" name="intro">
            </div>
            <div class="form-group">
            <label for="content">Content:</label>
            <textarea id="content" name="content" rows="6"></textarea>
            </div>
            <div class="form-group">
            <label for="photos">Add Photos:</label>
            <input type="file" id="photos" name="photos" multiple accept="image/*">
            </div>
<button type="submit" class="post-button">Post</button>
            </form>
            
        </section>
    </main>
    <footer id="footer"></footer>

    <script src="../Navbar/navbar.js"></script>
  <script src="create.js"></script>
  <script>
    // Function to load the Navbar
    function loadNavbar() {
      fetch('../Navbar/navbar.php')
        .then(response => response.text())
        .then(data => {
          document.getElementById('navbar-placeholder').innerHTML = data;
          // Initialize the navbar functionalities
          document.getElementById('menu-toggle').addEventListener('click', function() {
            const navMenu = document.getElementById('nav-menu');
            navMenu.classList.toggle('active');
          });

          // Set the initial state
          updateNavbarState(false); // Set initial state (false means not logged in)
        });
    }

    // Function to load the Footer
    function loadFooter() {
      fetch('../Footer/footer.html')
        .then(response => response.text())
        .then(data => {
          document.getElementById('footer').innerHTML = data;
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
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
        document.getElementById('login-link').classList.add('hidden');
        document.getElementById('user-icon').classList.remove('hidden');
      } else {
        document.getElementById('login-link').classList.remove('hidden');
        document.getElementById('user-icon').classList.add('hidden');
      }
    }
  </script>
</body>
</html>