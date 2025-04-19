<?php
// Include database initialization
include_once('../core/initialize.php');

// Set response header to JSON
header('Content-Type: application/json');

// Check if trainID is provided in the request
if (!isset($_GET['trainID'])) {
    echo json_encode(['error' => 'Train ID is required!']);
    exit();
}

$trainID = $_GET['trainID'];

try {
    // Query to get destinations along the train's route
    $query = "
        SELECT 
            d.destination_id, 
            d.name AS destinationName, 
            d.description, 
            t.type AS destinationType,
            GROUP_CONCAT(dp.photoName) AS photos,
            d.nearestStation
        FROM destination d
        INNER JOIN trainstops ts ON ts.stationid = d.nearestStation
        LEFT JOIN destinationphotos dp ON d.destination_id = dp.destination
        JOIN destinationtypes t ON d.type = t.type_id
        WHERE ts.trainid = :trainID
        GROUP BY d.destination_id
        ORDER BY d.nearestStation
    ";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':trainID', $trainID, PDO::PARAM_INT);
    $stmt->execute();

    $destinations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($destinations) {
        $response = array_map(function ($destination) {
            return [
                "id" => $destination['destination_id'],
                "name" => $destination['destinationName'],
                "type" => $destination['destinationType'],
                "description" => $destination['description'],
                "photos" => $destination['photos'] ? explode(",", $destination['photos']) : [],
                "nearestStation" => $destination['nearestStation']
            ];
        }, $destinations);

        echo json_encode($response);
    } else {
        echo json_encode(['message' => 'No destinations found for this train.']);
    }
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
