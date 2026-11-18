<?php
declare(strict_types=1);

// Include database and other necessary files
include_once('../core/initialize.php');

// Rate limiting: 20 rating submissions per minute per IP
RateLimiter::enforce('save_rating', 20, 60);

// Check if user session exists
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (!isset($_SESSION['username'])) {
    ApiResponse::unauthorized('You must be logged in to rate destinations.');
}

// Get JSON input
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validate input
if (empty($data['destinationId']) || empty($data['rating']) || !is_numeric($data['rating']) || $data['rating'] < 1 || $data['rating'] > 5) {
    ApiResponse::badRequest('Invalid input: Destination ID and rating (1-5) are required.');
}

try {
    // Start transaction
    $db->beginTransaction();
    
    $username = $_SESSION['username']; // Get username from session for security
    $destinationId = $data['destinationId'];
    $rating = $data['rating'];
    $description = isset($data['description']) ? $data['description'] : '';
    
    // Check if user has already rated this destination
    $checkQuery = 'SELECT rating FROM userreviews WHERE username = :username AND destination = :destination';
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':username', $username);
    $checkStmt->bindParam(':destination', $destinationId);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() > 0) {
        // Update existing review
        $query = 'UPDATE userreviews 
                 SET rating = :rating, description = :description 
                 WHERE username = :username AND destination = :destination';
    } else {
        // Insert new review
        $query = 'INSERT INTO userreviews (username, destination, rating, description) 
                 VALUES (:username, :destination, :rating, :description)';
    }
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':destination', $destinationId);
    $stmt->bindParam(':rating', $rating);
    $stmt->bindParam(':description', $description);
    
    if (!$stmt->execute()) {
        throw new Exception('Failed to save rating.');
    }
    
    // Commit transaction
    $db->commit();
    
    // Return success response
    ApiResponse::ok([
        'message' => 'Your rating has been saved successfully!'
    ]);
    
} catch (Throwable $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    ApiResponse::serverError('Failed to save rating: ' . $e->getMessage(), $e);
}