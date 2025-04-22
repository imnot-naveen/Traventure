<?php
// saveRating.php
// Include database and other necessary files
include_once('../core/initialize.php');
header('Content-Type: application/json');

// Get JSON input
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Check if user is logged in
session_start();
if (!isset($_SESSION['username'])) {
    echo json_encode(['success' => false, 'message' => 'You must be logged in to rate destinations.']);
    exit();
}

// Validate input
if (empty($data['destinationId']) || empty($data['rating']) || !is_numeric($data['rating']) || $data['rating'] < 1 || $data['rating'] > 5) {
    echo json_encode(['success' => false, 'message' => 'Invalid input: Destination ID and rating (1-5) are required.']);
    exit();
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
    echo json_encode([
        'success' => true,
        'message' => 'Your rating has been saved successfully!'
    ]);
    
} catch (Exception $e) {
    // Rollback transaction on error
    $db->rollBack();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>