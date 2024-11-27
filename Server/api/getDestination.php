<?php
// getDestinations.php
include_once('../core/initialize.php');
header('Content-Type: application/json');

// Check if destination ID is provided
if (!isset($_GET['id'])) {
    echo json_encode(['error' => 'Destination ID is required!']);
    exit();
}

$destination_id = $_GET['id'];

try {
    $query = "
        SELECT d.destination_id, d.name, t.type, d.description, GROUP_CONCAT(dp.photoName) AS photos 
        FROM Destination d
        LEFT JOIN DestinationPhotos dp ON d.destination_id = dp.destination
        JOIN destinationtypes t ON d.type = t.type_id
        WHERE d.destination_id = :id
        GROUP BY d.destination_id
    ";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $destination_id, PDO::PARAM_INT);
    $stmt->execute();

    $destination = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($destination) {
        $response = [
            "id" => $destination['destination_id'],
            "name" => $destination['name'],
            "type" => $destination['type'],
            "description" => $destination['description'],
            "photos" => $destination['photos'] ? explode(",", $destination['photos']) : [],
        ];
        echo json_encode($response);
    } else {
        echo json_encode(['error' => 'Destination not found!']);
    }
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
