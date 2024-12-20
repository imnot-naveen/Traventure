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
    <link rel="stylesheet" href="manageposts.css">     
    <link rel="stylesheet" href="../Navbar/navbar.css">   
    <link rel="stylesheet" href="../Footer/footer.css"> 
</head>     
<body>         
    <nav id="navbar-placeholder"></nav>             
    <main>     
        <section>
            <div class="create-post-container">
                <a id="create-post-btn" class="pill-link" href="../CWCreate/create.php">Create</a>
            </div>
            <div class="posts-wrapper">
                <div class="post-card-container">
                    <img src="../assets/ninearch.jpg" alt="Nine Arch Bridge">
                    <div class="post-content">
                        <a href="../CWBlog/blog.php"><h2>Nine Arch Bridge</h2></a>
                        <p>One of the worth seeing highlights in the Mountain village of Ella!</p>
                        <div class="post-actions">
                            <span class="edit-icon">&#9998;</span>
                            <span class="delete-icon">&#128465;</span>
                        </div>
                    </div>
                </div>
                <!-- Add more post cards here -->
            </div> 
        </section>     
    </main>      
    <footer id="footer"></footer>      
    <script src="../Navbar/navbar.js"></script>   
    <script src="manageposts.js"></script>   
</body> 
</html>