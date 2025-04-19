<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Include core initialization and database connection
include_once('../core/initialize.php');

// Check if required parameters are provided
if (!isset($_GET['stationID'])) {
    echo json_encode(['error' => 'Station ID is required!']);
    exit();
}

$stationID = $_GET['stationID'];

try {
    // Query to fetch station details
    $query = 'SELECT name FROM Station WHERE StationID = :stationid';

    $stmt = $db->prepare($query);
    $stmt->bindParam(':stationid', $stationID, PDO::PARAM_INT);
    $stmt->execute();

    // Fetch results as an associative array
    $name = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return stations as JSON
    echo json_encode($name);
} catch (Exception $e) {
    // Return an error message if the query fails
    http_response_code(500); // Internal Server Error
    echo json_encode(['message' => 'Error fetching station name.', 'error' => $e->getMessage()]);
}
?>
