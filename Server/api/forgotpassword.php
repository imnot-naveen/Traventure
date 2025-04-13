<?php
session_start();

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../phpmailer/src/Exception.php';
require '../phpmailer/src/PHPMailer.php';
require '../phpmailer/src/SMTP.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'] ?? null;

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid email address.']);
        exit;
    }

    $_SESSION['email'] = $email;

    // Generate a 6-digit random code
    $reset_code = rand(100000, 999999);
    $_SESSION['reset_code'] = $reset_code;

    // Setup PHPMailer
    $mail = new PHPMailer(true);

    try {
        // SMTP settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'traventurecorp@gmail.com'; 
        $mail->Password = 'jtgg ofoj obwp ftfs'; 
        $mail->SMTPSecure = 'ssl';
        $mail->Port = 465;

        // Email content
        $mail->setFrom('traventure@gmail.com', 'Traventure'); // Sender's email and name
        $mail->addAddress($email); // Recipient's email
        $mail->Subject = 'Password Reset Code';
        $mail->Body = "Your Traventure password reset code is: $reset_code";

        // Send email
        $mail->send();
        echo json_encode(['status' => 'success', 'message' => 'Reset code sent to your email.']);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to send reset code. ' . $mail->ErrorInfo]);
    }
}
?>
