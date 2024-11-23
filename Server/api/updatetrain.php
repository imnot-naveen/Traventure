<?php
include_once('../core/initialize.php');
header('Content-Type: application/json');

// Retrieve and decode incoming JSON data
$data = json_decode(file_get_contents("php://input"));

// Validate required fields
if (empty($data->trainID) || empty($data->name) || empty($data->type) || 
    empty($data->startStation) || empty($data->endStation) || 
    empty($data->departureTime) || empty($data->arrivalTime) || empty($data->date)) {
    echo json_encode(['success' => false, 'message' => 'Invalid input: All fields are required.']);
    exit();
}

try {
    // Start transaction
    $db->beginTransaction();

    // Update train table
    $query = 'UPDATE train 
              SET name = :name, 
                  type = :type, 
                  startStation = :startStation, 
                  endStation = :endStation, 
                  departureTime = :departureTime, 
                  arrivalTime = :arrivalTime, 
                  days = :days 
              WHERE trainID = :trainID';
    $stmt = $db->prepare($query);
    $stmt->bindParam(':trainID', $data->trainID);
    $stmt->bindParam(':name', $data->name);
    $stmt->bindParam(':type', $data->type);
    $stmt->bindParam(':startStation', $data->startStation);
    $stmt->bindParam(':endStation', $data->endStation);
    $stmt->bindParam(':departureTime', $data->departureTime);
    $stmt->bindParam(':arrivalTime', $data->arrivalTime);
    $stmt->bindParam(':days', $data->date);

    if (!$stmt->execute()) {
        throw new Exception('Failed to update train details.');
    }

    // Delete existing stops for this train
    $deleteStopsQuery = 'DELETE FROM trainstops WHERE trainID = :trainID';
    $deleteStmt = $db->prepare($deleteStopsQuery);
    $deleteStmt->bindParam(':trainID', $data->trainID);
    $deleteStmt->execute();

    // Insert new stops
    $stopsQuery = 'INSERT INTO trainstops (trainID, stationID, arrivalTime, departureTime) 
                   VALUES (:trainID, :stationID, :arrivalTime, :departureTime)';
    $stopsStmt = $db->prepare($stopsQuery);

    foreach ($data->stops as $stop) {
        $stopsStmt->bindParam(':trainID', $data->trainID);
        $stopsStmt->bindParam(':stationID', $stop->stationID);
        $stopsStmt->bindParam(':arrivalTime', $stop->arrivalTime);
        $stopsStmt->bindParam(':departureTime', $stop->departureTime);
        if (!$stopsStmt->execute()) {
            throw new Exception('Failed to insert stop details.');
        }
    }

    // Commit transaction
    $db->commit();
    echo json_encode(['success' => true, 'message' => 'Train and stops updated successfully.']);
} catch (Exception $e) {
    // Rollback transaction on error
    $db->rollBack();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>