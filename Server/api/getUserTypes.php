<?php
// Initialize session
session_start();

// Include database initialization
include_once('../core/initialize.php');

// Set response header to JSON
header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['username'])) {
    echo json_encode(['error' => 'User is not logged in!']);
    exit();
}

$username = $_SESSION['username'];

try {
    // Query to get user's preferred destination types
    $query = "
        SELECT 
            prefferedDestination AS type_id
        FROM 
            userdestination 
        WHERE 
            username = :username
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':username', $username, PDO::PARAM_STR);
    $stmt->execute();
    
    $preferredTypes = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $preferredTypes[] = $row['type_id'];
    }
    
    echo json_encode(['preferred_types' => $preferredTypes]);
    
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>