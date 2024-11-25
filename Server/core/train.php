<?php
class Train {
    private $conn;
    private $train_table = 'train';
    private $routes_table = 'routes';
    private $stations_table = 'station';
    private $trainstops_table = 'trainstops';

    public function __construct($db) {
        $this->conn = $db;
    }

    // Fetch all routes
    public function getRoutes() {
        $query = 'SELECT routeName, startStation, endStation FROM ' . $this->routes_table;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Fetch stations for a given route
    public function getStationsForRoute($routeName) {
        $query = 'SELECT orderedStations FROM ' . $this->routes_table . ' WHERE routeName = :routeName LIMIT 1';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':routeName', $routeName);
        $stmt->execute();
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($result) {
            $stationIDs = explode(',', $result['orderedStations']);
            $inQuery = implode(',', array_fill(0, count($stationIDs), '?'));

            $stationsQuery = 'SELECT stationID, name FROM ' . $this->stations_table . ' WHERE stationID IN (' . $inQuery . ') ORDER BY FIELD(stationID, ' . $inQuery . ')';
            $stationsStmt = $this->conn->prepare($stationsQuery);
            $stationsStmt->execute(array_merge($stationIDs, $stationIDs));
            return $stationsStmt->fetchAll(PDO::FETCH_ASSOC);
        }

        return [];
    }

    // Add a new train with stops
    public function addTrain($data) {
        try {
            // Insert into train table
            $query = 'INSERT INTO ' . $this->train_table . ' 
                      SET trainID = :trainID, name = :name, type = :type, 
                          startStation = :startStation, endStation = :endStation, 
                          departureTime = :departureTime, arrivalTime = :arrivalTime';
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':trainID', $data->trainID);
            $stmt->bindParam(':name', $data->name);
            $stmt->bindParam(':type', $data->type);
            $stmt->bindParam(':startStation', $data->startStation);
            $stmt->bindParam(':endStation', $data->endStation);
            $stmt->bindParam(':departureTime', $data->departureTime);
            $stmt->bindParam(':arrivalTime', $data->arrivalTime);
            $stmt->bindParam(':days', $data->date);

            if ($stmt->execute()) {
                // Insert stops into trainstops table
                foreach ($data->stops as $stop) {
                    $stopsQuery = 'INSERT INTO ' . $this->trainstops_table . ' 
                                   SET trainID = :trainID, stationID = :stationID, 
                                       arrivalTime = :arrivalTime, departureTime = :departureTime';
                    $stopsStmt = $this->conn->prepare($stopsQuery);
                    $stopsStmt->bindParam(':trainID', $data->trainID);
                    $stopsStmt->bindParam(':stationID', $stop->stationID);
                    $stopsStmt->bindParam(':arrivalTime', $stop->arrivalTime);
                    $stopsStmt->bindParam(':departureTime', $stop->departureTime);
                    $stopsStmt->execute();
                }
                return ['success' => true, 'message' => 'Train added successfully.'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }
}
?>
