<?php
session_start();

// Not logged in
if (!isset($_SESSION['username'])) {
    header("Location: ../../Login/LoginPage.html"); 
    exit();
}

// Only allow users with userType = 'User'
if ($_SESSION['userType'] !== "Traveller") {
    header("Location: ../../Unauthorized/unauthorized.php"); 
    exit();
}

?>

<link rel="stylesheet" href="cashpayment.css">

<div id="payment-container">
  <h3>Thank You for Your Booking!</h3>
  <p>Your booking is confirmed. Please show this QR code at the counter to grab your ticket.</p>
  
  <div id="qr-container">
    <div id="qrcode"></div>
  </div>

  <p>Thank you for choosing our service!</p>
</div>

<script src="https://cdn.jsdelivr.net/npm/qrcodejs/qrcode.min.js"></script>
<script src="cashpayment.js"></script>
