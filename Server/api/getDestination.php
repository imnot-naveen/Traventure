<?php
// getDestination.php
include_once('../core/initialize.php');
header('Content-Type: application/json');

// Check if destination ID is provided
if (!isset($_GET['id'])) {
    echo json_encode(['error' => 'Destination ID is required!']);
    exit();
}

$destination_id = $_GET['id'];

try {
    // Get main destination info
    $query = "
        SELECT d.destination_id, d.name, d.description, d.nearestStation, 
               GROUP_CONCAT(DISTINCT dp.photoName) AS photos
        FROM Destination d
        LEFT JOIN DestinationPhotos dp ON d.destination_id = dp.destination
        WHERE d.destination_id = :id
        GROUP BY d.destination_id
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $destination_id, PDO::PARAM_INT);
    $stmt->execute();
    
    $destination = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($destination) {
        // Get destination types associated with this destination
        $typesQuery = "
            SELECT dt.type AS type_id, t.type 
            FROM desttypes dt
            JOIN destinationtypes t ON dt.type = t.type_id
            WHERE dt.destination = :destination_id
        ";
        
        $typesStmt = $db->prepare($typesQuery);
        $typesStmt->bindParam(':destination_id', $destination_id, PDO::PARAM_INT);
        $typesStmt->execute();
        
        $types = $typesStmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Prepare response with destination data and its types
        $response = [
            "id" => $destination['destination_id'],
            "name" => $destination['name'],
            "description" => $destination['description'],
            "nearestStation" => (int)$destination['nearestStation'],
            "photos" => $destination['photos'] ? explode(",", $destination['photos']) : [],
            "types" => $types
        ];
        
        echo json_encode($response);
    } else {
        echo json_encode(['error' => 'Destination not found!']);
    }
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}