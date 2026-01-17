<?php

include_once('../core/initialize.php');
header('Content-Type: application/json');

session_start();

// Check if user is logged in
if(!isset($_SESSION['username'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit();
}

// Check if tripID is provided
if(!isset($_GET['tripID'])) {
    echo json_encode(['success' => false, 'message' => 'Trip ID is required']);
    exit();
}

$tripID = $_GET['tripID'];
$username = $_SESSION['username'];

try {
    // Verify this trip belongs to the user
    $checkQuery = 'SELECT COUNT(*) FROM trip WHERE tripID = :tripID AND username = :username';
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':tripID', $tripID);
    $checkStmt->bindParam(':username', $username);
    $checkStmt->execute();

   
    
    if($checkStmt->fetchColumn() == 0) {
        echo json_encode(['success' => false, 'message' => 'Trip not found or access denied']);
        exit();
    }

    $bookingIDQuery = 'SELECT bookingID FROM trip WHERE tripID = :tripID';
    $bookingIDStmt = $db->prepare($bookingIDQuery);
    $bookingIDStmt->bindParam(':tripID', $tripID);
    $bookingIDStmt->execute();

    $bookingIDRow = $bookingIDStmt->fetch(PDO::FETCH_ASSOC);
    $bookingID = $bookingIDRow['bookingID'];
    

    // Get destination details
    $bookingQuery = 'SELECT bookingID, total_fare as amount, paymentMethod, paymentStatus as status FROM bookings WHERE bookingID = :bookingID';
    $bookingStmt = $db->prepare($bookingQuery);
    $bookingStmt->bindParam(':bookingID', $bookingID);
    $bookingStmt->execute();

    $bookingData = $bookingStmt->fetch(PDO::FETCH_ASSOC);

    // Get trip details
    $tripQuery = 'SELECT * FROM trip WHERE tripID = :tripID';
    $tripStmt = $db->prepare($tripQuery);
    $tripStmt->bindParam(':tripID', $tripID);
    $tripStmt->execute();
    $tripData = $tripStmt->fetch(PDO::FETCH_ASSOC);
    
    // Get station names
    $stationQuery = 'SELECT stationID, name FROM station WHERE stationID IN (:startStation, :endStation)';
    $stationStmt = $db->prepare($stationQuery);
    $stationStmt->bindParam(':startStation', $tripData['startStation']);
    $stationStmt->bindParam(':endStation', $tripData['endStation']);
    $stationStmt->execute();
    $stations = $stationStmt->fetchAll(PDO::FETCH_KEY_PAIR);
    
    // Get trip segments
    $segmentQuery = 'SELECT 
                       ts.trainID,
                       ts.startStation,
                       ts.endStation,
                       ts.departureTime,
                       s1.name as originStationName,
                       s2.name as destinationStationName,
                       t.name as trainName,
                       t.type as trainType
                     FROM tripsegments ts
                     LEFT JOIN station s1 ON ts.startStation = s1.stationID
                     LEFT JOIN station s2 ON ts.endStation = s2.stationID
                     LEFT JOIN train t ON ts.trainID = t.trainID
                     WHERE ts.tripID = :tripID
                     ORDER BY ts.departureTime ASC';
    
    $segmentStmt = $db->prepare($segmentQuery);
    $segmentStmt->bindParam(':tripID', $tripID);
    $segmentStmt->execute();
    $segments = $segmentStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get destinations/stopovers
    $destQuery = 'SELECT 
                    d.destinationID,
                    s.name as destinationName
                  FROM tripdestination d
                  LEFT JOIN station s ON d.destinationID = s.stationID
                  WHERE d.tripID = :tripID';
    
    $destStmt = $db->prepare($destQuery);
    $destStmt->bindParam(':tripID', $tripID);
    $destStmt->execute();
    $destinations = $destStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Combine all data
    $tripDetails = [
        'tripData' => $tripData,
        'stations' => $stations,
        'segments' => $segments,
        'destinations' => $destinations,
        'bookingData' => $bookingData,
    ];
    
    echo json_encode(['success' => true, 'tripDetails' => $tripDetails]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>