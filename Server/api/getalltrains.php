<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once('../core/initialize.php');

class TrainAPI {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Fetch all trains with pagination
    public function getAllTrains($limit, $offset) {
        $query = "
            SELECT 
                trainID, name, type, startStation, endStation, departureTime, arrivalTime
            FROM 
                Train
            LIMIT :limit OFFSET :offset
        ";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $trains = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $totalQuery = "SELECT COUNT(*) as total FROM Train";
        $totalStmt = $this->conn->prepare($totalQuery);
        $totalStmt->execute();
        $totalTrains = $totalStmt->fetch(PDO::FETCH_ASSOC)['total'];

        return [
            'trains' => $trains,
            'totalTrains' => $totalTrains
        ];
    }
}

// Check if limit and offset are provided
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

$trainAPI = new TrainAPI($db);
$data = $trainAPI->getAllTrains($limit, $offset);

echo json_encode($data);