<?php
class Trip {
    private $conn;
    private $trip_table = 'trip';

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getTripCount(){
      try{
        $query = 'SELECT COUNT(*) AS count FROM ' . $this->trip_table ;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return ['success' => true, 'count' => $result['count']];
      }catch(Exception $e) {
        return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
      }
    }
  
}