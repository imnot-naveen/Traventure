<?php  
session_start();
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
    <title>Traventure</title>     
    <link rel="stylesheet" href="blogdetails.css">     
    <link rel="stylesheet" href="../Navbar/navbar.css">   
    <link rel="stylesheet" href="../Footer/footer.css"> 
</head>     
<body>         
    <nav id="navbar-placeholder"></nav>
    
    <div class="blog-details-container hidden">
      <div class="blog-post">
       <div id="post-header">
        <div class="user-info">
          <img src="../assets/icons/user.png" alt="Profile" class="profile"/>
          <p class="username"></p>
        </div>
        <p class="date"></p>
        
        <h1 class="title"></h1>
        <p class="intro"></p>
        <div class="image-container">
          <img class="image" alt="Blog image" />
        </div>
        <p class="content"></p>
       </div>
          <!-- Comments Section 
      <div class="comments-section">
            <p class="comment-title">Comments <span class="comment-count">0</span></p>
            <textarea class="comment-box" placeholder="Leave a comment..."></textarea>
            <button class="submit-comment">Submit</button>
            <div class="comment-list"></div>
          </div>-->
      </div>
      
   </div>

  <footer id="footer"></footer>

  <script src="../Navbar/navbar.js"></script>
  <script src="blogdetails.js"></script>
  <script src="../Footer/footer.js"></script>
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