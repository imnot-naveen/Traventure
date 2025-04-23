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

    public function getFare() {
        $query = "SELECT * FROM " . $this->fare_table;
    
        $stmt = $this->conn->prepare($query);
        $stmt->execute(); 
    
        if ($stmt->rowCount() > 0) {
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            return false;
        }
    }

    public function updateFare($class, $base, $rate) {
        // Check if fare class already exists
        $checkQuery = "SELECT COUNT(*) FROM " . $this->fare_table . " WHERE class = :class";
        $checkStmt = $this->conn->prepare($checkQuery);
        $checkStmt->bindParam(':class', $class);
        $checkStmt->execute();
        
        if ($checkStmt->fetchColumn() > 0) {
            // Update existing fare
            $query = "UPDATE " . $this->fare_table . " 
                      SET base_fare = :base_fare, per_km_rate = :per_km_rate 
                      WHERE class = :class";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':class', $class);
            $stmt->bindParam(':base_fare', $base);
            $stmt->bindParam(':per_km_rate', $rate);
            
            if ($stmt->execute()) {
                return array(
                    'success' => true,
                    'message' => 'Fare rate updated successfully'
                );
            } else {
                return array(
                    'success' => false,
                    'message' => 'Failed to update fare rate'
                );
            }
        } else {
            // Insert new fare class
            $query = "INSERT INTO " . $this->fare_table . " (class, base_fare, per_km_rate) 
                      VALUES (:class, :base_fare, :per_km_rate)";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':class', $class);
            $stmt->bindParam(':base_fare', $base);
            $stmt->bindParam(':per_km_rate', $rate);
            
            if ($stmt->execute()) {
                return array(
                    'success' => true,
                    'message' => 'New fare class added successfully'
                );
            } else {
                return array(
                    'success' => false,
                    'message' => 'Failed to add new fare class'
                );
            }
        }
    }
}
?>
