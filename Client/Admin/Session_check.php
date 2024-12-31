<?php
session_start();
// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    header("Location: ../../Login/LoginPage.html"); 
    exit();
}

if ($_SESSION['userType'] !== "Admin") {
    header("Location: ../../Home/home.html"); 
    exit();
}

// Get the username from the session
$username = $_SESSION['username'];
?>