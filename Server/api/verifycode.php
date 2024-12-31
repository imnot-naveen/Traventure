<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get input from JSON body
    $data = json_decode(file_get_contents('php://input'), true);
    $code = $data['verification_code'] ?? '';

    // Verify the code
    if ($code === $_SESSION['reset_code']) {
        echo json_encode(['status' => 'success', 'message' => 'Code verified.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid code.']);
    }
}
