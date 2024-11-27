<?php
session_start(); // Always start the session

// Check if session variables are set
if (isset($_SESSION['username'], $_SESSION['email'], $_SESSION['userType'])) {
    echo 'Session variables are set.<br>';
    echo 'Username: ' . $_SESSION['username'] . '<br>';
    echo 'Email: ' . $_SESSION['email'] . '<br>';
    echo 'User Type: ' . $_SESSION['userType'] . '<br>';
} else {
    echo 'Session variables are not set.';
}
?>
