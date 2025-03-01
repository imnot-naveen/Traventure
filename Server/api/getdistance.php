<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Include core initialization and database connection
include_once('../core/initialize.php');

try {
    // Check if both station IDs are provided
    if(isset($_GET['from']) && isset($_GET['to'])) {
        $starting_stationId = $_GET['from'];
        $destination_stationId = $_GET['to'];
        
        // Query to fetch distances for both stations
        $query = 'SELECT stationID, distance_from_start FROM Station WHERE stationID IN (:start, :dest)';
        $stmt = $db->prepare($query);
        $stmt->bindParam(':start', $starting_stationId);
        $stmt->bindParam(':dest', $destination_stationId);
        $stmt->execute();
        
        // Fetch results as an associative array
        $stations = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Check if both stations were found
        if(count($stations) != 2) {
            http_response_code(404); // Not Found
            echo json_encode(['message' => 'One or both stations not found.']);
            exit;
        }
        
        // Extract distances
        $distances = [];
        foreach($stations as $station) {
            $distances[$station['stationID']] = $station['distance_from_start'];
        }
        
        // Calculate the distance between stations
        $distance = abs($distances[$starting_stationId] - $distances[$destination_stationId]);
        
        // Return the result
        echo json_encode([
            'from_station' => $starting_stationId,
            'to_station' => $destination_stationId,
            'distance' => $distance
        ]);
        
    } else {
        http_response_code(400); // Bad Request
        echo json_encode(['message' => 'Missing required parameters. Please provide both "from" and "to" station IDs.']);
    }
} catch (Exception $e) {
    // Return an error message if the query fails
    http_response_code(500); // Internal Server Error
    echo json_encode(['message' => 'Error calculating distance.', 'error' => $e->getMessage()]);
}
?>