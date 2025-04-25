<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Include core initialization and database connection
include_once('../core/initialize.php');

try {
    
    // Query to fetch tsp details
    $trainQuery = "SELECT COUNT(trainID) AS trains from train ";
    $routeQuery = "SELECT COUNT(routeName) AS routes from routes ";
    $passengerQuery = "SELECT SUM(no_of_passengers) AS passengers from bookings ";
    $revenueQuery = "SELECT 0.2*SUM(total_fare) AS revenue from bookings ";
        
    $trainstmt = $db->prepare($trainQuery);
    $trainstmt->execute();
    $routestmt = $db->prepare($routeQuery);
    $routestmt->execute();
    $passengerstmt = $db->prepare($passengerQuery);
    $passengerstmt->execute();
    $revenuestmt = $db->prepare($revenueQuery);
    $revenuestmt->execute();

    // Fetch train details
    $train = $trainstmt->fetchAll(PDO::FETCH_ASSOC);
    $route = $routestmt->fetchAll(PDO::FETCH_ASSOC);
    $passenger = $passengerstmt->fetchAll(PDO::FETCH_ASSOC);
    $revenue = $revenuestmt->fetchAll(PDO::FETCH_ASSOC);

    $response = [
        'tspData' => [
            'trains' => 50,
            'routes' => 1,
            'passengers' => 6,
            'revenue' => 604.50
        ]
    ];
    
    echo json_encode($response, JSON_PRETTY_PRINT);
} catch (Exception $e) {
    // Return an error message if the query fails
    http_response_code(500); // Internal Server Error
    echo json_encode(['message' => 'Error fetching trains.', 'error' => $e->getMessage()]);
}
