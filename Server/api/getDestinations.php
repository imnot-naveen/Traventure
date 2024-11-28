<?php
// getDestinations.php
include_once('../core/initialize.php');
header('Content-Type: application/json');

try {
    $query = "
        SELECT d.destination_id, d.name, d.description, s.name AS station,
        COALESCE(GROUP_CONCAT(dp.photoName), '') AS photos 
        FROM Destination d
        LEFT JOIN DestinationPhotos dp ON d.destination_id = dp.destination
        JOIN station s ON d.nearestStation = s.stationID
        GROUP BY d.destination_id
    ";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $destinations = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $destinations[] = [
            "id" => $row['destination_id'],
            "name" => $row['name'],
            "description" => $row['description'],
            "nearestStation" => $row['station'],
            "photos" => $row['photos'] ? explode(",", $row['photos']) : [], // Ensure photos is always an array
        ];
    }

    echo json_encode($destinations);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
