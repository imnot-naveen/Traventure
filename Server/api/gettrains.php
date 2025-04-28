<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Include core initialization and database connection
include_once('../core/initialize.php');

try {
    // Get input data
    $data = json_decode(file_get_contents("php://input"), true);

    $startStation = $data['startStation'] ?? null;
    $endStation = $data['endStation'] ?? null;
    $searchDate = $data['searchDate'] ?? null;

    if (!$startStation || !$endStation || !$searchDate) {
        http_response_code(400); // Bad Request
        echo json_encode(['message' => 'Invalid input. Please provide all required fields.']);
        exit();
    }

    // Check if the selected date falls on a weekend
    $isWeekend = (date('N', strtotime($searchDate)) >= 6);

    // Query to fetch train details
    $query = "
        SELECT 
            t.trainID,
            t.name,
            t.type,
            ts1.departureTime AS departureTime,
            ts2.arrivalTime AS arrivalTime,
            st.name AS endStation, -- End station of the train
            TIMEDIFF(ts2.arrivalTime, ts1.departureTime) AS duration
        FROM trainstops ts1
        JOIN trainstops ts2 ON ts1.trainID = ts2.trainID
        JOIN train t ON t.trainID = ts1.trainID
        JOIN station st ON st.stationID = t.endStation 
        WHERE ts1.stationID = :startStation 
          AND ts2.stationID = :endStation
          AND ts1.arrivalTime < ts2.arrivalTime
          AND (t.days = 'Daily' OR (t.days = 'Weekdays' AND NOT :isWeekend))
          AND t.status = 'Active'
    ";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':startStation', $startStation, PDO::PARAM_STR);
    $stmt->bindParam(':endStation', $endStation, PDO::PARAM_STR);
    $stmt->bindParam(':isWeekend', $isWeekend, PDO::PARAM_BOOL);
    $stmt->execute();

    // Fetch train details
    $trains = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return train details as JSON
    echo json_encode($trains);
} catch (Exception $e) {
    // Return an error message if the query fails
    http_response_code(500); // Internal Server Error
    echo json_encode(['message' => 'Error fetching trains.', 'error' => $e->getMessage()]);
}
