<?php

class Driver extends Person {
    private $driver = 'driver';
    private $conn;
    private $person_table = 'person';
    private $login_table = 'login';

    // Driver-specific properties
    public $id;
    public $assigned_station;
    public $availability;
    public $vehicleID;
    public $maxPassengers;
    public $license;
    public $password; // Only for use in login table
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
          $query1 = "INSERT INTO person (username, firstName, lastName, email, IDNumber, contactNo,status)
                     VALUES (:username, :first_name, :last_name, :email, :id_number, :contact_number, :status)";
          $stmt1 = $this->conn->prepare($query1);
          $stmt1->execute([
              ':username' => $this->username,
              ':first_name' => $this->first_name,
              ':last_name' => $this->last_name,
              ':email' => $this->email,
              ':id_number' => $this->id_number,
              ':contact_number' => $this->contact_number,
              ':status' => $this->status
          ]);
  
          $user_id = $this->conn->lastInsertId(); // Get the inserted person's ID
  
          // Insert into driver table (remove the `id` field because it's auto-increment)
          $query2 = "INSERT INTO driver (username, maxPassengers ,assigned_station, availability, vehicleID, license)
                     VALUES (:username,:maxPassengers, :assigned_station, :availability, :vehicleID, :license )";
          $stmt2 = $this->conn->prepare($query2);
          $stmt2->execute([
              ':username' => $this->username, // Use username as a foreign key reference
              ':maxPassengers' => $this->maxPassengers,
              ':assigned_station' => $this->assigned_station,
              ':availability' => $this->availability,
              ':vehicleID' => $this->vehicleID,
              ':license' => $this->license
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
            d.maxPassengers
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
                         d.maxPassengers, d.license,
                         p.firstName, p.lastName, p.email, p.contactNo, p.IDNumber, p.status
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

public function updateDriver(){
    try{
        //Initilize query parts
        $setParts = [];
        $params = [];

        //Dynamically build query parts for provided fields
        if(!empty($this->first_name)){
            $setParts[] = 'p.firstName = :first_name';
            $params[':first_name'] = $this->first_name;
        }
        if (!empty($this->last_name)) {
            $setParts[] = 'p.lastName = :last_name';
            $params[':last_name'] = $this->last_name;
        }
        if (!empty($this->contact_number)) {
            $setParts[] = 'p.contactNo = :contact_number';
            $params[':contact_number'] = $this->contact_number;
        }

        //Ensure atleast one field is being updated
        if(empty($setParts)){
            return ['success' => false, 'message' => 'No fields provided for update.'];
        }

        //Finalize query
        $query = 'UPDATE '. $this->driver . ' d INNER JOIN ' . $this->person_table . ' p ON d.username = p.username SET '. implode(', ', $setParts) . ' WHERE d.id = :id';

        $params[':id'] = $this->id;

        //prepare and execute
        $stmt = $this->conn->prepare($query);
        if($stmt->execute($params)){
            return ['success' => true, 'message' => 'Driver updated successfully.'];
        }

        return ['success' => false, 'message' => 'Failed to update Driver.'];

    }catch(PDOException $e){
        return ['success' => false, 'message' => $e->getMessage()];
    }       
  }   

  public function updateStatus($id, $status) {
    try {
        // Corrected query with consistent placeholder naming
        $query = 'UPDATE ' . $this->driver . ' d
        JOIN person p ON d.username = p.username
        SET p.status = :status 
        WHERE d.id = :id';

        $stmt = $this->conn->prepare($query);
  
        // Correct parameter binding
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
  
        // Execute the statement and check success
        if ($stmt->execute()) {
            return true;
        }
        return false;
    } catch (PDOException $e) {
        error_log("Error updating status: " . $e->getMessage());
        return false;
    }
  }

  public function getRowCount() {
    try {
        $query = 'SELECT COUNT(*) AS total FROM ' . $this->driver;
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

  
}