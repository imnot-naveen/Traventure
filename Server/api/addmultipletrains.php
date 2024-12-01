<?php
// Include database and other necessary files
include_once('../core/initialize.php');
header('Content-Type: application/json');

// Retrieve and decode incoming JSON data
$data = json_decode(file_get_contents("php://input"));

// Validate the input to ensure it contains train records
if (empty($data) || !is_array($data)) {
    echo json_encode(['success' => false, 'message' => 'Invalid input: An array of train records is required.']);
    exit();
}

try {
    // Start transaction
    $db->beginTransaction();

    foreach ($data as $train) {
        // Validate required fields for each train record
        if (empty($train->trainID) || empty($train->name) || empty($train->type) ||
            empty($train->startStation) || empty($train->endStation) ||
            empty($train->departureTime) || empty($train->arrivalTime) || empty($train->date) || empty($train->stops)) {
            throw new Exception('Invalid input: All train fields are required.');
        }

        // Insert into `train` table
        $query = 'INSERT INTO train (trainID, name, type, startStation, endStation, departureTime, arrivalTime, days) 
                  VALUES (:trainID, :name, :type, :startStation, :endStation, :departureTime, :arrivalTime, :days)';
        $stmt = $db->prepare($query);
        $stmt->bindParam(':trainID', $train->trainID);
        $stmt->bindParam(':name', $train->name);
        $stmt->bindParam(':type', $train->type);
        $stmt->bindParam(':startStation', $train->startStation);
        $stmt->bindParam(':endStation', $train->endStation);
        $stmt->bindParam(':departureTime', $train->departureTime);
        $stmt->bindParam(':arrivalTime', $train->arrivalTime);
        $stmt->bindParam(':days', $train->date);

        if (!$stmt->execute()) {
            throw new Exception('Failed to insert train details into the train table.');
        }

        // Insert stops into `trainstops` table
        $stopsQuery = 'INSERT INTO trainstops (trainID, stationID, arrivalTime, departureTime) 
                       VALUES (:trainID, :stationID, :arrivalTime, :departureTime)';
        $stopsStmt = $db->prepare($stopsQuery);

        foreach ($train->stops as $stop) {
            if (empty($stop->stationID) || empty($stop->arrivalTime) || empty($stop->departureTime)) {
                throw new Exception('Invalid input: Missing stop details for trainID ' . $train->trainID);
            }
            $stopsStmt->bindParam(':trainID', $train->trainID);
            $stopsStmt->bindParam(':stationID', $stop->stationID);
            $stopsStmt->bindParam(':arrivalTime', $stop->arrivalTime);
            $stopsStmt->bindParam(':departureTime', $stop->departureTime);
            if (!$stopsStmt->execute()) {
                throw new Exception('Failed to insert stop details into the trainstops table for trainID ' . $train->trainID);
            }
        }
    }

    // Commit transaction
    $db->commit();
    echo json_encode(['success' => true, 'message' => 'Trains and their stops added successfully.']);
} catch (Exception $e) {
    // Rollback transaction on error
    $db->rollBack();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
