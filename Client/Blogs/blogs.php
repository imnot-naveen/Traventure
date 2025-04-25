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
    <link rel="stylesheet" href="blogs.css">     
    <link rel="stylesheet" href="../Navbar/navbar.css">   
    <link rel="stylesheet" href="../Footer/footer.css"> 
</head>     
<body>         
    <nav id="navbar-placeholder"></nav>
    
    
    
    <button class="crt-blog" readonly onclick="window.location.href='../CreateBlogs/createblogs.php'">Create Blog</button>
   

  <div class="blog-wrapper hidden">
  <div class="blog-container"> 

    
    <!--<div class="blog-header">
      <div class="post-options">
        <button class="options-btn">⋮</button>
        <div class="dropdown-menu hidden">
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </div>
      </div>

      <div class="user-info">
        <img src="../assets/icons/user.png" alt="Profile" class="profile"/>
        <p class="username" id="blog-author"></p>
      </div>
      <p class="date" id="blog-date"></p>
    </div>

    
    <img id="blog-image" class="main-image" alt="Blog image" />
    <p id="blog-intro"></p>

   
    <p class="comment-title">Comments <span class="comment-count">0</span></p>

    <div class="comments-section">
      <h3>Conversation</h3>
      <textarea class="comment-box" placeholder="Leave a comment..."></textarea>
      <button class="submit-comment">Submit</button>
      <div class="comment-list"></div>
    </div>-->

  </div> 
</div>



  <footer id="footer"></footer>

  <script src="../CW Navbar/navbar.js"></script>
  <script src="blogs.js"></script>
  <script src="../Footer/footer.js"></script>
  <script>
    // Function to load the Navbar
    function loadNavbar() {
      fetch('../CW Navbar/navbar.php')
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
  