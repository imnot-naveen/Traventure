<?php  
session_start();
// Check if the user is logged in 
if (!isset($_SESSION['username'])) {     
    header("Location: ../login/loginpage.html"); // Redirect to login if not logged in     
    exit(); 
}

if($_SESSION['userType'] !== "CW"){
  header("Location: ../Blogs/blogs.php");

}
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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>     
<body>         
    <nav id="navbar-placeholder"></nav>
    
    <button class="crt-blog" onclick="window.location.href='../CreateBlogs/createblogs.php'">
        <i class="fas fa-plus"></i> Create Blog
    </button>
   
    <div class="blog-wrapper">
        <div class="blog-container"></div> 
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
                    document.getElementById('menu-toggle').addEventListener('click', function() {
                        const navMenu = document.getElementById('nav-menu');
                        navMenu.classList.toggle('active');
                    });
                    updateNavbarState(false);
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