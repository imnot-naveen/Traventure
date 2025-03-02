<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Include core initialization and database connection
include_once('../core/initialize.php');

try {
    // Check if all required parameters are provided
    if(isset($_GET['from']) && isset($_GET['to']) && isset($_GET['class'])) {
        $starting_stationId = $_GET['from'];
        $destination_stationId = $_GET['to'];
        $class = $_GET['class'];
        
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

        // Fetch fare details for selected class
        $fareQuery = 'SELECT base_fare, per_km_rate FROM fare_rates WHERE class = :class';
        $fareStmt = $db->prepare($fareQuery);
        $fareStmt->bindParam(':class', $class);
        $fareStmt->execute();
        
        $fareDetails = $fareStmt->fetch(PDO::FETCH_ASSOC);

        if (!$fareDetails) {
            http_response_code(404);
            echo json_encode(['message' => 'Fare details not found for selected class.']);
            exit;
        }

        // Calculate exact fare
        $base_fare = $fareDetails['base_fare'];
        $per_km_rate = $fareDetails['per_km_rate'];
        $total_fare = $base_fare + ($distance * $per_km_rate);

        // Return fare calculation result
        echo json_encode([
            'from_station' => $starting_stationId,
            'to_station' => $destination_stationId,
            'class' => $class,
            'distance' => $distance,
            'base_fare' => $base_fare,
            'per_km_rate' => $per_km_rate,
            'total_fare' => round($total_fare, 2) // Rounded to 2 decimal places
        ]);
        
    } else {
        http_response_code(400); 
        echo json_encode(['message' => 'Missing required parameters. Please provide "from", "to", and "class".']);
    }
} catch (Exception $e) {
    http_response_code(500); 
    echo json_encode(['message' => 'Error calculating fare.', 'error' => $e->getMessage()]);
}
?>
