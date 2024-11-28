<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Include core initialization and database connection
include_once('../core/initialize.php');

try {
    // Query to fetch station details
    $query = 'SELECT StationID, city, name FROM Station';
    $stmt = $db->prepare($query);
    $stmt->execute();

    // Fetch results as an associative array
    $stations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return stations as JSON
    echo json_encode($stations);
} catch (Exception $e) {
    // Return an error message if the query fails
    http_response_code(500); // Internal Server Error
    echo json_encode(['message' => 'Error fetching stations.', 'error' => $e->getMessage()]);
}
?>
