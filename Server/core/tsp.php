<?php

class TrainServiceProvider extends Person {
    private $tsp_table = 'trainserviceprovider';
    private $conn;
    private $person_table = 'person';

    // TSP-specific properties
    public $tspid;

    // Constructor to initialize db connection and parent class
    public function __construct($db) {
        parent::__construct($db); // Call the parent class constructor
        $this->conn = $db; // Assign the database connection
    }

    // Method to register a TSP
    public function registerTSP() {
        try {
            // Check if the TSP exists
            $query = 'SELECT * FROM ' . $this->tsp_table . ' WHERE TSPID = :tspid LIMIT 1';
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':tspid', $this->tspid);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                return ['success' => false, 'message' => 'Train Service Provider already exists.'];
            }

            // Insert into the trainserviceprovider table
            $query = 'INSERT INTO ' . $this->tsp_table . ' SET TSPID = :tspid, username = :username';
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(':tspid', $this->tspid);
            $stmt->bindParam(':username', $this->username);

            if ($stmt->execute()) {
                return ['success' => true, 'message' => 'Train Service Provider registered successfully.'];
            }

            return ['success' => false, 'message' => 'Failed to register Train Service Provider.'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    // GET all train service providers
    public function getAllTSPs() {
        $query = 'SELECT t.username, p.firstName AS first_name, p.lastName AS last_name, p.email, p.contactNo AS contact_number, 
                         t.TSPID AS tspid 
                  FROM ' . $this->tsp_table . ' t
                  INNER JOIN ' . $this->person_table . ' p ON t.username = p.username';

        $stmt = $this->conn->prepare($query);

        if ($stmt->execute()) {
            return $stmt->fetchAll(PDO::FETCH_ASSOC); // Fetch all records as an associative array
        }

        return null; // Return null if the query fails
    }

    public function getRowCount() {
      try {
          $query = 'SELECT COUNT(*) AS total FROM ' . $this->tsp_table;
          $stmt = $this->conn->prepare($query);
  
          if ($stmt->execute()) {
              $result = $stmt->fetch(PDO::FETCH_ASSOC); // Fetch the result as an associative array
              return $result['total']; // Return the count
          }
  
          return 0; // If query execution fails, return 0
      } catch (PDOException $e) {
          return 0; // Handle exception and return 0 as a fallback
      }
  }

  public function getTSPDetails($tspid) {
    try {
        $query = 'SELECT t.username, p.firstName AS first_name, p.lastName AS last_name, 
                         p.email, p.contactNo AS contact_number, t.TSPID AS tspid
                  FROM ' . $this->tsp_table . ' t
                  INNER JOIN ' . $this->person_table . ' p ON t.username = p.username
                  WHERE t.TSPID = :tspid LIMIT 1';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':tspid', $tspid, PDO::PARAM_STR);

        if ($stmt->execute() && $stmt->rowCount() > 0) {
            return $stmt->fetch(PDO::FETCH_ASSOC); // Fetch TSP details
        }

        return null; // Return null if no record is found
    } catch (PDOException $e) {
        return null; // Handle any errors (optionally log them)
    }
  }
  
}
?>
