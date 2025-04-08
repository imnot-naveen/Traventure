<?php
// Required to read PayHere POST
$merchant_id         = $_POST['merchant_id'];
$order_id            = $_POST['order_id'];
$payment_id          = $_POST['payment_id'];
$payhere_amount      = $_POST['payhere_amount'];
$payhere_currency    = $_POST['payhere_currency'];
$status_code         = $_POST['status_code'];
$md5sig              = $_POST['md5sig'];

// Your merchant secret (from PayHere sandbox settings)
$merchant_secret     = 'ODc5OTg4NzY4NjMzODI5ODI5ODE5MDk2ODc5NDE4NjMyNzA4Mg=='; 

// Generate local signature
$local_md5sig = strtoupper(
  md5(
    $merchant_id . $order_id . $payhere_amount . $payhere_currency . $status_code . strtoupper(md5($merchant_secret))
  )
);

// Compare signature and check status
if ($md5sig === $local_md5sig && $status_code == 2) {
    // ✅ Payment successful
    // Update booking status in your DB
    file_put_contents("payment_log.txt", "Success: Order ID $order_id paid.\n", FILE_APPEND);
} else {
    // ❌ Payment failed or invalid
    file_put_contents("payment_log.txt", "Failed or tampered: Order ID $order_id.\n", FILE_APPEND);
}
?>
