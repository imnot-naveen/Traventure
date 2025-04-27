<?php
// Include database and other necessary files
include_once('../core/initialize.php');
header('Content-Type: application/json');

// Retrieve and decode incoming JSON data
$data = json_decode(file_get_contents("php://input"));

// Validate required fields
if (empty($data->username) || empty($data->startStation) || empty($data->endStation) || 
    empty($data->departureTime) || empty($data->arrivalTime) || 
    empty($data->adults) || empty($data->date) || empty($data->seatClass) ||
    !isset($data->adultFare) || !isset($data->childFare) || !isset($data->totalFare)) {
    echo json_encode(['success' => false, 'message' => 'Invalid input: All fields are required.']);
    exit();
}

try {
    // Start transaction
    $db->beginTransaction();
    
    // Get username from session (if logged in)
    $username = $data->username;
    
    // Use the fare data directly from the client
    $adultFare = $data->adultFare;
    $childFare = $data->childFare;
    $totalFare = $data->totalFare;
    
    // Calculate total members
    $adults = intval($data->adults);
    $children = isset($data->children) ? intval($data->children) : 0;
    $totalMembers = $adults + $children;
    
    // Check if booking ID is provided
    $bookingID = !empty($data->bookingID) ? $data->bookingID : null;
    
    // Insert into trip table
    $query = 'INSERT INTO trip (username, startStation, endStation, departureTime, arrivalTime, 
              no_of_members, number_of_adults, number_of_children, date, ticket_class, adult_fare, child_fare, total_fare, bookingID) 
              VALUES (:username, :startStation, :endStation, :departureTime, :arrivalTime, 
              :no_of_members, :number_of_adults, :number_of_children, :date, :ticket_class, :adult_fare, :child_fare, :total_fare, :bookingID)';
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':startStation', $data->startStation);
    $stmt->bindParam(':endStation', $data->endStation);
    $stmt->bindParam(':departureTime', $data->departureTime);
    $stmt->bindParam(':arrivalTime', $data->arrivalTime);
    $stmt->bindParam(':no_of_members', $totalMembers);
    $stmt->bindParam(':number_of_adults', $adults);
    $stmt->bindParam(':number_of_children', $children);
    $stmt->bindParam(':date', $data->date);
    $stmt->bindParam(':ticket_class', $data->seatClass);
    $stmt->bindParam(':adult_fare', $adultFare);
    $stmt->bindParam(':child_fare', $childFare);
    $stmt->bindParam(':total_fare', $totalFare);
    $stmt->bindParam(':bookingID', $bookingID);

    if (!$stmt->execute()) {
        throw new Exception('Failed to insert trip details.');
    }
    
    // Get the last inserted ID
    $tripID = $db->lastInsertId();
    
    // Insert into tripdestination table if destinations are provided
    if (!empty($data->destinations)) {
        $destQuery = 'INSERT INTO tripdestination (tripID, destinationID) VALUES (:tripID, :destinationID)';
        $destStmt = $db->prepare($destQuery);
        
        foreach ($data->destinations as $destination) {
            $destStmt->bindParam(':tripID', $tripID);
            $destStmt->bindParam(':destinationID', $destination->id);
            if (!$destStmt->execute()) {
                throw new Exception('Failed to insert destination details.');
            }
        }
    }
    
    // Insert trip segments
    if (!empty($data->selectedTrains)) {
        $segmentQuery = 'INSERT INTO tripsegments (tripID, startStation, endStation, trainID, departureTime) 
                        VALUES (:tripID, :startStation, :endStation, :trainID, :departureTime)';
        $segmentStmt = $db->prepare($segmentQuery);
        
        foreach ($data->selectedTrains as $train) {
            $segmentStmt->bindParam(':tripID', $tripID);
            $segmentStmt->bindParam(':startStation', $train->originStationID);
            $segmentStmt->bindParam(':endStation', $train->destinationStationID);
            $segmentStmt->bindParam(':trainID', $train->trainID);
            $segmentStmt->bindParam(':departureTime', $train->departureTime);
            
            if (!$segmentStmt->execute()) {
                throw new Exception('Failed to insert trip segment details.');
            }
        }
    }
    
    // Commit transaction
    $db->commit();
    
    // Return success response with trip ID
    echo json_encode([
        'success' => true, 
        'message' => 'Trip saved successfully!',
        'tripID' => $tripID,
        'redirect' => '../../client/userTrips/userTrips.html'
    ]);
    
} catch (Exception $e) {
    $db->rollBack();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>