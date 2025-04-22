<?php
// getReviews.php
// Include database and other necessary files
include_once('../core/initialize.php');
header('Content-Type: application/json');

// Validate input
if (empty($_GET['destinationId']) || !is_numeric($_GET['destinationId'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid destination ID',
        'reviews' => [] // Always include an empty array to prevent JS errors
    ]);
    exit();
}

try {
    $destinationId = $_GET['destinationId'];
    
    // Query to get all reviews for a specific destination
    $query = 'SELECT username, rating, description FROM userreviews 
              WHERE destination = :destinationId';
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':destinationId', $destinationId);
    $stmt->execute();
    
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Calculate average rating
    $totalRating = 0;
    $reviewCount = count($reviews);
    
    if ($reviewCount > 0) {
        foreach ($reviews as $review) {
            $totalRating += $review['rating'];
        }
        $averageRating = $totalRating / $reviewCount;
    } else {
        $averageRating = 0;
    }
    
    // Return reviews and average rating
    echo json_encode([
        'success' => true,
        'reviews' => $reviews, // Always return an array, even if empty
        'averageRating' => $averageRating,
        'totalReviews' => $reviewCount
    ]);
    
} catch (Exception $e) {
    // Even in case of error, include an empty reviews array to prevent JS errors
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'reviews' => []
    ]);
}
?>