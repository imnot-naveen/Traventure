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

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Booking Form</title>
  <link rel="stylesheet" href="booking_form.css" />
  <script src="https://js.stripe.com/v3/"></script>
</head>
<body>
  <div class="container">
    <div class="booking-container">
      
      <!-- Train Selection Details -->
      <div id="train-details" class="card-left">
      </div>

      <!-- Booking Form -->
      <form id="booking-form" class="card-right">
        <!-- Passenger Count -->
        <label for="passenger-count">Number of Passengers:</label>
        <input type="number" id="passenger-count" min="1" value="1"/>

        <!-- Kids Count -->
        <label for="kids-count">Number of Kids:</label>
        <input type="number" id="kids-count" min="0" value="0"/>

        <!-- Class Selection -->
        <label for="class">Select Class:</label>
        <select id="class">
          <option value="first">1st Class</option>
          <option value="second">2nd Class</option>
          <option value="third">3rd Class</option>
        </select>

        <!-- Payment Option -->
        <label for="payment-option">Payment Option:</label>
        <select id="payment-option">
          <option value="Card">Card</option>
          <option value="Cash">Cash</option>
        </select>

        <!-- Total Fare -->
        <p><strong>Total Fare:</strong> <span id="total-amount">$0.00</span></p>

        <!-- Submit -->
        <button type="submit">Proceed to Payment</button>
      </form>
    </div>
  </div>

  <script src="booking_form.js"></script>
</body>
</html>
