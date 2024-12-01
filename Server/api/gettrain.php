<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Include database and other necessary files
include_once('../core/initialize.php');

class TrainAPI {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Fetch train details by train number
    public function getTrainDetails($trainNo) {
        // Prepare the SQL query using a placeholder for the train number
        $query = "
            SELECT 
                t.trainID, 
                t.name, 
                t.type, 
                ts1.stationID AS startStationID, 
                ts2.stationID AS endStationID, 
                ts1.name AS startStationName,
                ts2.name AS endStationName,
                t.departureTime, 
                t.arrivalTime, 
                t.days,
                ts.stationID,
                s.name AS stationName,
                ts.arrivalTime AS stopArrivalTime,
                ts.departureTime AS stopDepartureTime
            FROM 
                Train t
            LEFT JOIN 
                Trainstops ts ON t.trainID = ts.trainID
            LEFT JOIN 
                Station s ON ts.stationID = s.stationID
            LEFT JOIN 
                Station ts1 ON t.startStation = ts1.stationID
            LEFT JOIN 
                Station ts2 ON t.endStation = ts2.stationID
            WHERE 
                t.trainID = :trainNo
        ";

        // Prepare the statement
        $stmt = $this->conn->prepare($query);
        // Bind the parameter
        $stmt->bindParam(':trainNo', $trainNo);
        // Execute the statement
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $trainData = null;
            $stops = [];

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                // Basic train details (only set once)
                if ($trainData === null) {
                    $trainData = [
                        'trainID' => $row['trainID'],
                        'name' => $row['name'],
                        'type' => $row['type'],
                        'startStation' => $row['startStationName'], // Set startStation name
                        'endStation' => $row['endStationName'], // Set endStation name
                        'departureTime' => $row['departureTime'],
                        'arrivalTime' => $row['arrivalTime'],
                        'days' => $row['days']
                    ];
                }

                // Add stops if station exists
                if ($row['stationID']) {
                    $stops[] = [
                        'stationID' => $row['stationID'],
                        'name' => $row['stationName'],
                        'arrivalTime' => $row['stopArrivalTime'],
                        'departureTime' => $row['stopDepartureTime']
                    ];
                }
            }

            $trainData['stops'] = $stops;
            return $trainData;
        } else {
            return null;
        }
    }
}

// Check if train number is provided
if (!isset($_GET['trainNo'])) {
    echo json_encode(['error' => 'Train number is required']);
    exit();
}

$trainAPI = new TrainAPI($db);
$trainDetails = $trainAPI->getTrainDetails($_GET['trainNo']);

if ($trainDetails === null) {
    echo json_encode(['error' => 'No train found with the provided train number']);
} else {
    echo json_encode($trainDetails); // Remove `value:` and directly return the array
}
?>
