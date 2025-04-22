<?php
// Error Reporting (disable in production)
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL & ~E_DEPRECATED & ~E_STRICT);

// Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');
header('Strict-Transport-Security: max-age=31536000; includeSubDomains');

// Handle OPTIONS request for CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit();
}

// Include dependencies
require_once('../core/initialize.php');

// Validate class existence
if (!class_exists('Destinationtypes')) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Internal Server Error']);
    error_log('DestinationTypes class not found in ' . __FILE__);
    exit();
}

try {
    $destinationType = new DestinationTypes($db);

    // Get and validate input
    $json = file_get_contents('php://input');
    if (empty($json)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Empty request body']);
        exit();
    }

    $data = json_decode($json);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON format']);
        exit();
    }

    if (!isset($data->type) || !is_string($data->type)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Type must be a valid string']);
        exit();
    }

    // Process request
    $result = $destinationType->addDestinationtypes($data);

    // Handle response
    if ($result['success']) {
        http_response_code(201);
    } else {
        http_response_code(400);
    }

    echo json_encode($result, JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    error_log('Database error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database operation failed']);
} catch (Exception $e) {
    http_response_code(500);
    error_log('Server error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Internal Server Error']);
}