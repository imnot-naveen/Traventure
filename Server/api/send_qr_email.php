<?php
// Set error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Modern PHPMailer requires these includes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Include the PHPMailer files - adjust path if needed
require '../PHPMailer/src/Exception.php';
require '../PHPMailer/src/PHPMailer.php';
require '../PHPMailer/src/SMTP.php';

// Include database and person class
include_once('../core/initialize.php');

// Get and validate input data
$inputData = file_get_contents("php://input");
if (!$inputData) {
    echo json_encode(["status" => "error", "message" => "No input data received"]);
    exit;
}

$data = json_decode($inputData, true);
if (!$data) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON data"]);
    exit;
}

// Check for required fields
if (!isset($data["bookingDetails"]) || !isset($data["qrText"])) {
    echo json_encode(["status" => "error", "message" => "Missing required data fields"]);
    exit;
}

$booking = $data["bookingDetails"];
$qrText = $data["qrText"];

// Check if userId is provided in the booking details
if (!isset($booking["userId"])) {
    echo json_encode(["status" => "error", "message" => "User ID is missing in booking details"]);
    exit;
}

$userId = $booking["userId"];

try {
    // Get user email from database - Fixed the JOIN condition
    $stmt = $conn->prepare("SELECT p.email FROM person p JOIN registereduser u ON p.username = u.username WHERE u.id = :userId");
    $stmt->bindParam(':userId', $userId);
    $stmt->execute();
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user || !isset($user['email'])) {
        echo json_encode(["status" => "error", "message" => "User not found or email not available"]);
        exit;
    }
    
    $userEmail = $user['email'];
    
} catch(PDOException $e) {
    echo json_encode([
        "status" => "error", 
        "message" => "Database query failed", 
        "details" => $e->getMessage()
    ]);
    exit;
}

// Generate QR code URL
$qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" . urlencode($qrText);

// Create a new PHPMailer instance with exceptions enabled
$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->SMTPDebug = 2;                      // Enable verbose debug output
    $mail->isSMTP();                           // Send using SMTP
    $mail->Host       = 'smtp.gmail.com';      // SMTP server
    $mail->SMTPAuth   = true;                  // Enable SMTP authentication
    $mail->Username   = 'dimuthuharshamal@gmail.com'; // SMTP username
    $mail->Password   = 'abcd efgh ijkl mnop';    // Replace with your actual App Password (16 chars with spaces)
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;  // Enable TLS encryption
    $mail->Port       = 587;                   // TCP port to connect to
    
    // Recipients
    $mail->setFrom('dimuthuharshamal@gmail.com', 'Traventure');
    $mail->addAddress($userEmail);
    
    // Content
    $mail->isHTML(true);
    $mail->Subject = 'Your Train Booking QR Code';
    
    // Create email body with booking details
    $emailBody = "
    <html>
    <head>
        <title>Train Booking Confirmation</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            h2 { color: #0066cc; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .qrcode { text-align: center; margin: 20px 0; }
            ul { padding-left: 20px; }
            .footer { margin-top: 30px; font-size: 0.9em; color: #666; }
        </style>
    </head>
    <body>
        <div class='container'>
            <h2>Train Booking Confirmation</h2>
            <p>Thank you for booking with Traventure!</p>
            <p>Below is your QR code for your train booking:</p>
            <div class='qrcode'><img src='$qrUrl' alt='Booking QR Code'/></div>
    ";
    
    // Add booking details if available
    if (is_array($booking)) {
        $emailBody .= "<h3>Booking Details:</h3><ul>";
        foreach ($booking as $key => $value) {
            if ($key !== 'userId') { 
                $emailBody .= "<li><strong>" . htmlspecialchars(ucfirst($key)) . ":</strong> " . htmlspecialchars($value) . "</li>";
            }
        }
        $emailBody .= "</ul>";
    }
    
    $emailBody .= "
            <div class='footer'>
                <p>If you have any questions, please contact our support team.</p>
                <p>Best regards,<br>Traventure Team</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $mail->Body = $emailBody;
    $mail->AltBody = "Train Booking Confirmation - Please view this email in an HTML-compatible email client to see your QR code.";
    
    // Send the email
    $mail->send();
    echo json_encode([
        "status" => "success", 
        "message" => "QR code sent successfully to $userEmail",
        "email" => $userEmail
    ]);
} catch (Exception $e) {
    echo json_encode([
        "status" => "error", 
        "message" => "Email could not be sent",
        "details" => $mail->ErrorInfo ?? $e->getMessage()
    ]);
}
?>