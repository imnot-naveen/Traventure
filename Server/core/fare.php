<?php
class Fare {
    private $conn;
    private $fare_table = 'fare_rates';

    public function __construct($db) {
        $this->conn = $db;
    }

    // Fetch fare details based on the selected class
    public function getFareRate($class) {
        $query = "SELECT base_fare, per_km_rate FROM " . $this->fare_table . " WHERE class = :class";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':class', $class);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return $stmt->fetch(PDO::FETCH_ASSOC); 
        } else {
            return false; 
        }
    }
}
?>
