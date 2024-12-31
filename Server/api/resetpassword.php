<?php
session_start();

// resetpassword.php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $new_password = $_POST['new_password'];
    $confirm_password = $_POST['confirm_password'];

    if ($new_password !== $confirm_password) {
        echo json_encode(['status' => 'error', 'message' => 'Passwords do not match.']);
        exit;
    }

    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

    $email = $_SESSION['email'];

    // Update password in the database
    $conn = new mysqli("localhost", "username", "password", "database");

    if ($conn->connect_error) {
        die(json_encode(['status' => 'error', 'message' => 'Database connection failed.']));
    }

    $stmt = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
    $stmt->bind_param("ss", $hashed_password, $email);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Password reset successfully.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to reset password.']);
    }

    $stmt->close();
    $conn->close();
}
