<?php
// File: server/api/getUserTrips.php
// Get all trips for the logged in user
include_once('../core/initialize.php');
header('Content-Type: application/json');

session_start();

// Check if user is logged in
if(!isset($_SESSION['username'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit();
}

$username = $_SESSION['username'];

try {
    // Get all trips for this user
    $query = 'SELECT 
                t.tripID, 
                t.bookingID,
                t.date, 
                s1.name as start_station_name, 
                s2.name as end_station_name,
                t.departureTime,
                t.arrivalTime,
                t.total_fare,
                t.ticket_class
              FROM trip t
              LEFT JOIN station s1 ON t.startStation = s1.stationID
              LEFT JOIN station s2 ON t.endStation = s2.stationID
              WHERE t.username = :username AND status = "active"
              ORDER BY t.date DESC';
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    
    $trips = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(['success' => true, 'trips' => $trips]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
