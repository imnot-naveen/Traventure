<?php
// Include database initialization
include_once('../core/initialize.php');

// Set response header to JSON
header('Content-Type: application/json');

// Check if required parameters are provided
if (!isset($_GET['startStationID']) || !isset($_GET['endStationID']) || !isset($_GET['departureTime'])) {
    echo json_encode(['error' => 'Start station, end station, and departure time are required!']);
    exit();
}

// Sanitize inputs
$startStationID = filter_var($_GET['startStationID'], FILTER_SANITIZE_NUMBER_INT);
$endStationID = filter_var($_GET['endStationID'], FILTER_SANITIZE_NUMBER_INT);
$departureTime = filter_var($_GET['departureTime'], FILTER_SANITIZE_STRING);
$departureDate = isset($_GET['departureDate']) ? filter_var($_GET['departureDate'], FILTER_SANITIZE_STRING) : date('Y-m-d');

// Validate inputs
if (!$startStationID || !$endStationID || !preg_match('/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/', $departureTime)) {
    echo json_encode(['error' => 'Invalid input parameters']);
    exit();
}

// Determine if the day is weekday or weekend
$dayOfWeek = date('l', strtotime($departureDate));
$dayCondition = ($dayOfWeek === 'Saturday' || $dayOfWeek === 'Sunday') 
    ? "t.days = 'daily'" 
    : "t.days IN ('daily', 'weekday')";

try {
    // Main query for the given day
    $query = "
        SELECT 
            t.trainID,
            t.name,
            t.type,
            ts1.departuretime AS departureTime,
            ts2.arrivaltime AS arrivalTime,
            TIMEDIFF(ts2.arrivaltime, ts1.departuretime) AS duration,
            t.endStation
        FROM 
            train t
        INNER JOIN 
            trainstops ts1 ON t.trainID = ts1.trainID AND ts1.stationid = :startStationID
        INNER JOIN 
            trainstops ts2 ON t.trainID = ts2.trainID AND ts2.stationid = :endStationID
        WHERE 
            ts1.departuretime < ts2.arrivaltime
            AND TIME(ts1.departuretime) >= :departureTime
            AND $dayCondition
        ORDER BY 
            ts1.departuretime
    ";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':startStationID', $startStationID, PDO::PARAM_INT);
    $stmt->bindParam(':endStationID', $endStationID, PDO::PARAM_INT);
    $stmt->bindParam(':departureTime', $departureTime);
    $stmt->execute();

    $trains = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($trains && count($trains) > 0) {
        echo json_encode(['success' => true, 'trains' => $trains]);
    } else {
        // Try for the next day
        $nextDayDate = date('Y-m-d', strtotime($departureDate . ' +1 day'));
        $nextDayOfWeek = date('l', strtotime($nextDayDate));
        $nextDayCondition = ($nextDayOfWeek === 'Saturday' || $nextDayOfWeek === 'Sunday') 
            ? "t.days = 'daily'" 
            : "t.days IN ('daily', 'weekday')";

        $nextDayQuery = "
            SELECT 
                t.trainID,
                t.name,
                t.type,
                ts1.departuretime AS departureTime,
                ts2.arrivaltime AS arrivalTime,
                TIMEDIFF(ts2.arrivaltime, ts1.departuretime) AS duration,
                t.endStation
            FROM 
                train t
            INNER JOIN 
                trainstops ts1 ON t.trainID = ts1.trainID AND ts1.stationid = :startStationID
            INNER JOIN 
                trainstops ts2 ON t.trainID = ts2.trainID AND ts2.stationid = :endStationID
            WHERE 
                ts1.departuretime < ts2.arrivaltime
                AND $nextDayCondition
            ORDER BY 
                ts1.departuretime
            LIMIT 10
        ";

        $nextDayStmt = $db->prepare($nextDayQuery);
        $nextDayStmt->bindParam(':startStationID', $startStationID, PDO::PARAM_INT);
        $nextDayStmt->bindParam(':endStationID', $endStationID, PDO::PARAM_INT);
        $nextDayStmt->execute();

        $nextDayTrains = $nextDayStmt->fetchAll(PDO::FETCH_ASSOC);

        if ($nextDayTrains && count($nextDayTrains) > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'No trains available today, showing options for tomorrow.',
                'trains' => $nextDayTrains
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'No available trains found for this route.']);
        }
    }
} catch (PDOException $e) {
    error_log('Database error in train API: ' . $e->getMessage(), 0);
    echo json_encode(['success' => false, 'error' => 'Database error occurred. Please try again later.']);
} catch (Exception $e) {
    error_log('General error in train API: ' . $e->getMessage(), 0);
    echo json_encode(['success' => false, 'error' => 'An unexpected error occurred. Please try again later.']);
}
?>
