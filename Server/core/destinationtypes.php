<?php
class DestinationTypes {
    private $conn;
    private $destinationtypes_table = 'destinationtypes';

    public function __construct($db) {
      $this->conn = $db;
    }

    public function getAllDestinationtypes(){
      $query = "SELECT * FROM".$this->destinationtypes_table;

      $stmt = $this->conn->prepare($query);
      $stmt->execute();

      if($stmt->rowCount()> 0){
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
      }else{
        return false;
      }
    }

  //   public function addDestinationtypes($data) {
  //     try {
  //         // Validate input - more robust check
  //         if (!isset($data->type) || !is_string($data->type)) {
  //             return ['success' => false, 'message' => 'Type must be a valid string'];
  //         }
  
  //         // Trim and validate type
  //         $type = trim($data->type);
  //         if (empty($type)) {
  //             return ['success' => false, 'message' => 'Type cannot be empty'];
  //         }
  
  //         // Additional length validation (example: max 50 chars)
  //         if (strlen($type) > 50) {
  //             return ['success' => false, 'message' => 'Type cannot exceed 50 characters'];
  //         }
  
  //         // Check for duplicates (case-insensitive)
  //         $checkQuery = "SELECT id FROM " . $this->destinationtypes_table . 
  //                      " WHERE LOWER(type) = LOWER(:type) LIMIT 1";
  //         $checkStmt = $this->conn->prepare($checkQuery);
  //         $checkStmt->bindParam(':type', $type);
  //         $checkStmt->execute();
  
  //         if ($checkStmt->fetch()) {
  //             return ['success' => false, 'message' => 'Destination type already exists'];
  //         }
  
  //         // Insert new type
  //         $query = "INSERT INTO " . $this->destinationtypes_table . " (type, photo) VALUES (:type, :photo)";
  //         $stmt = $this->conn->prepare($query);
  //         $stmt->bindParam(':type', $type, PDO::PARAM_STR);
  //         $stmt->bindParam(':photo', $photo, PDO::PARAM_STR);
  
  //         if ($stmt->execute()) {
  //             return [
  //                 'success' => true,
  //                 'message' => 'Destination type added successfully',
  //                 'id' => $this->conn->lastInsertId(),
  //                 'type' => $type 
  //             ];
  //         }
          
  //         return ['success' => false, 'message' => 'Failed to add destination type'];
          
  //     } catch (PDOException $e) {
  //         error_log("Database error in addDestinationtypes: " . $e->getMessage());
  //         return [
  //             'success' => false, 
  //             'message' => 'Failed to add destination type. Please try again.'
  //         ];
  //     }
  // }
}
    