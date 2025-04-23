<?php
session_start();
include_once('../core/initialize.php');
header('Content-Type: application/json');

// Read and decode JSON input
$data = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $new_password = $data->new_password ?? '';
    $confirm_password = $data->confirm_password ?? '';

    // Validate matching passwords
    if ($new_password !== $confirm_password) {
        echo json_encode(['status' => 'error', 'message' => 'Passwords do not match.']);
        exit;
    }

    // Check session email
    if (!isset($_SESSION['email'])) {
        echo json_encode(['status' => 'error', 'message' => 'User email not found in session.']);
        exit;
    }

    $email = $_SESSION['email'];
    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

    try {
        $query = "UPDATE login SET password = :password WHERE email = :email";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':password', $hashed_password);
        $stmt->bindParam(':email', $email);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Password reset successfully.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to reset password.']);
        }
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => 'Error: ' . $e->getMessage()]);
    }
}
?>
