<?php

class Driver extends Person {
    private $driver = 'driver';
    private $conn;
    private $person_table = 'person';
    private $login_table = 'login';

    // Driver-specific properties
    public $assigned_station;
    public $availability;
    public $vehicleID;
    public $maxPassengers;
    public $license;
    public $password; // Only for use in login table
    public $status;
    public $userType;
    
    // Constructor to initialize db connection and parent class
    public function __construct($db) {
      parent::__construct($db); 
      $this->conn = $db; 
    }

    public function registerDriver() {
      try {
          $this->conn->beginTransaction(); 
  
          // Insert into person table
          $query1 = "INSERT INTO person (username, firstName, lastName, email, IDNumber, contactNo)
                     VALUES (:username, :first_name, :last_name, :email, :id_number, :contact_number)";
          $stmt1 = $this->conn->prepare($query1);
          $stmt1->execute([
              ':username' => $this->username,
              ':first_name' => $this->first_name,
              ':last_name' => $this->last_name,
              ':email' => $this->email,
              ':id_number' => $this->id_number,
              ':contact_number' => $this->contact_number
          ]);
  
          $user_id = $this->conn->lastInsertId(); // Get the inserted person's ID
  
          // Insert into driver table (remove the `id` field because it's auto-increment)
          $query2 = "INSERT INTO driver (username, maxPassengers ,assigned_station, availability, vehicleID, license, status)
                     VALUES (:username,:maxPassengers, :assigned_station, :availability, :vehicleID, :license, :status)";
          $stmt2 = $this->conn->prepare($query2);
          $stmt2->execute([
              ':username' => $this->username, // Use username as a foreign key reference
              ':maxPassengers' => $this->maxPassengers,
              ':assigned_station' => $this->assigned_station,
              ':availability' => $this->availability,
              ':vehicleID' => $this->vehicleID,
              ':license' => $this->license,
              ':status' => $this->status
          ]);
  
          // Insert into login table
          $query3 = "INSERT INTO login (username, email, password, userType) 
                     VALUES (:username, :email, :password, :userType)";
          $stmt3 = $this->conn->prepare($query3);
          $stmt3->execute([
              ':username' => $this->username,
              ':email' => $this->email,
              ':password' => password_hash($this->password, PASSWORD_DEFAULT),
              ':userType' => $this->userType
          ]);
  
          $this->conn->commit(); 
          return ['success' => true, 'message' => 'Driver registered successfully.'];
  
      } catch (PDOException $e) {
          if ($this->conn->inTransaction()) {
              $this->conn->rollBack(); 
          }
          return ['success' => false, 'message' => 'Registration failed: ' . $e->getMessage()];
      }
  }

  public function getAllDrivers() {
    try {
        // Join driver with person to get full details
        $query = "SELECT 
                    d.id AS driverID,
                    d.username,
                    p.firstName,
                    p.lastName,
                    p.email,
                    p.IDNumber,
                    p.contactNo,
                    d.assigned_station,
                    d.availability,
                    d.vehicleID,
                    d.license,
                    d.maxPassengers,
                    d.status
                  FROM driver d
                  INNER JOIN person p ON d.username = p.username";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        $drivers = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return [
            'success' => true,
            'data' => $drivers
        ];

    } catch (PDOException $e) {
        return [
            'success' => false,
            'message' => 'Error fetching drivers: ' . $e->getMessage()
        ];
    }
}

public function getDriverDetailsByID($driverID) {
    try {
        $query = "SELECT d.id, d.username, d.assigned_station, d.availability, d.vehicleID, 
                         d.maxPassengers, d.license, d.status,
                         p.firstName, p.lastName, p.email, p.contactNo, p.IDNumber
                  FROM driver d
                  INNER JOIN person p ON d.username = p.username
                  WHERE d.id = :driverID";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':driverID', $driverID, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $driverData = $stmt->fetch(PDO::FETCH_ASSOC);
            return ['success' => true, 'data' => $driverData];
        } else {
            return ['success' => false, 'message' => 'Driver not found.'];
        }
    } catch (PDOException $e) {
        return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
    }
}


  
}