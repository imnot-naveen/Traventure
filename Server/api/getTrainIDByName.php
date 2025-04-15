<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Include database and other necessary files
include_once('../core/initialize.php');

class TrainNameAPI {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Fetch train ID by train name
    public function getTrainIdByName($trainName) {
        // Prepare the SQL query using a placeholder for the train name
        $query = "
            SELECT 
                trainID, 
                name
            FROM 
                Train
            WHERE 
                name LIKE :trainName
            LIMIT 1
        ";

        // Prepare the statement
        $stmt = $this->conn->prepare($query);
        
        // Add wildcards to allow partial matching
        $searchName = "%" . $trainName . "%";
        
        // Bind the parameter
        $stmt->bindParam(':trainName', $searchName);
        
        // Execute the statement
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return [
                'trainID' => $row['trainID'],
                'name' => $row['name']
            ];
        } else {
            return null;
        }
    }
}

// Check if train name is provided
if (!isset($_GET['trainName'])) {
    echo json_encode(['error' => 'Train name is required']);
    exit();
}

$trainAPI = new TrainNameAPI($db);
$trainData = $trainAPI->getTrainIdByName($_GET['trainName']);

if ($trainData === null) {
    echo json_encode(['error' => 'No train found with the provided name']);
} else {
    echo json_encode($trainData);
}
?>