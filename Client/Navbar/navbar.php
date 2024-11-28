<?php 
    if(isset($_SESSION['username']))
    {
       $username = $_SESSION['username'];
    } 
?>
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
            <li><a href="#blog">Blog</a></li>
            <li><a href="../About/About.html">About Us</a></li>
            <li id="login-link"><a href="../login/LoginPage.html" >Login</a></li>
        </ul>
    </div>
  </nav>
  