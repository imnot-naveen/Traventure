<?php
// Include database and other necessary files
include_once('../core/initialize.php');
header('Content-Type: application/json');

// Retrieve and decode incoming JSON data
$data = json_decode(file_get_contents("php://input"));

// Validate required fields
if (empty($data->trainID) || empty($data->name) || empty($data->type) || 
    empty($data->startStation) || empty($data->endStation) || 
    empty($data->departureTime) || empty($data->arrivalTime) || empty($data->date) || empty($data->stops)) {
    echo json_encode(['success' => false, 'message' => 'Invalid input: All fields are required.']);
    exit();
}

try {
    // Start transaction
    $db->beginTransaction();

    // Insert into `train` table
    $query = 'INSERT INTO train (trainID, name, type, startStation, endStation, departureTime, arrivalTime, days) 
          VALUES (:trainID, :name, :type, :startStation, :endStation, :departureTime, :arrivalTime, :days)';
    $stmt = $db->prepare($query);
    $stmt->bindParam(':trainID', $data->trainID);
    $stmt->bindParam(':name', var: $data->name);
    $stmt->bindParam(':type', $data->type);
    $stmt->bindParam(':startStation', $data->startStation);
    $stmt->bindParam(':endStation', $data->endStation);
    $stmt->bindParam(':departureTime', $data->departureTime);
    $stmt->bindParam(':arrivalTime', $data->arrivalTime);
    $stmt->bindParam(':days', $data->date);

    if (!$stmt->execute()) {
        throw new Exception('Failed to insert train details into the train table.');
    }

    // Insert stops into `trainstops` table
    $stopsQuery = 'INSERT INTO trainstops (trainID, stationID, arrivalTime, departureTime) 
                   VALUES (:trainID, :stationID, :arrivalTime, :departureTime)';
    $stopsStmt = $db->prepare($stopsQuery);

    foreach ($data->stops as $stop) {
        if (empty($stop->stationID) || empty($stop->arrivalTime) || empty($stop->departureTime)) {
            throw new Exception('Invalid input: Missing stop details.');
        }
        $stopsStmt->bindParam(':trainID', $data->trainID);
        $stopsStmt->bindParam(':stationID', $stop->stationID);
        $stopsStmt->bindParam(':arrivalTime', $stop->arrivalTime);
        $stopsStmt->bindParam(':departureTime', $stop->departureTime);
        if (!$stopsStmt->execute()) {
            throw new Exception('Failed to insert stop details into the trainstops table.');
        }
    }

    // Commit transaction
    $db->commit();
    echo json_encode(['success' => true, 'message' => 'Train and stops added successfully.']);
} catch (Exception $e) {
    // Rollback transaction on error
    $db->rollBack();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>