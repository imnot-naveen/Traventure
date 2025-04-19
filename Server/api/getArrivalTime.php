<?php
// Include database initialization
include_once('../core/initialize.php');

// Set response header to JSON
header('Content-Type: application/json');

// Check if required parameters are provided
if (!isset($_GET['trainID']) || !isset($_GET['stationID'])) {
    echo json_encode(['error' => 'Train ID and Station ID are required!']);
    exit();
}

$trainID = $_GET['trainID'];
$stationID = $_GET['stationID'];

try {
    // Query to get arrival time for a specific train at a specific station
    $query = "
        SELECT 
            arrivaltime
        FROM 
            trainstops
        WHERE 
            trainid = :trainID 
            AND stationid = :stationID
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':trainID', $trainID, PDO::PARAM_INT);
    $stmt->bindParam(':stationID', $stationID, PDO::PARAM_INT);
    $stmt->execute();
    
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result) {
        echo json_encode(['arrivalTime' => $result['arrivaltime']]);
    } else {
        echo json_encode(['error' => 'No arrival time found for this train at this station.']);
    }
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>