<?php
session_start();

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../../vendor/autoload.php';

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
        $mail->Host = 'smtp.gmail.com'; // Use Gmail SMTP
        $mail->SMTPAuth = true;
        $mail->Username = 'your_email@gmail.com'; // Your Gmail address
        $mail->Password = 'your_app_password'; // Your Gmail App Password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Email content
        $mail->setFrom('your_email@gmail.com', 'Traventure'); // Sender's email and name
        $mail->addAddress($email); // Recipient's email
        $mail->Subject = 'Password Reset Code';
        $mail->Body = "Your password reset code is: $reset_code";

        // Send email
        $mail->send();
        echo json_encode(['status' => 'success', 'message' => 'Reset code sent to your email.']);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to send reset code. ' . $mail->ErrorInfo]);
    }
}
?>
