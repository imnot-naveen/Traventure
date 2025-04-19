<?php

// initialize session 
session_start();

// Include database initialization
include_once('../core/initialize.php');

// Set response header to JSON
header('Content-Type: application/json');

// Check if required parameters are provided
if (!isset($_SESSION['username'])) {
    echo json_encode(['error' => 'User is not logged in!']);
    exit();
}

$username = $_SESSION['username'];

try {
    // Query to get arrival time for a specific train at a specific station
    $query = "
        SELECT 
            username,
            CONCAT(firstName, ' ', lastName) AS full_name,
            IDNumber
        FROM 
            person
        WHERE 
            username = :username
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':username', $username, PDO::PARAM_INT);
    $stmt->execute();
    
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result) {
        echo json_encode(['username' => $result['username'],'full_name' => $result['full_name'], 'id_number' => $result['IDNumber']]);
    } else {
        echo json_encode(['error' => 'No data found for this user.']);
    }
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>