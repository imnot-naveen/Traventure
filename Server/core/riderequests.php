<?php
class RideRequests {
    private $conn;
    private $riderequests_table = 'riderequests';
    private $driver_requests_table = 'driverrequests';

    public function __construct($db) {
        $this->conn = $db;
    }

    public $id;
    public $clientID;
    public $passengerCount;
    public $destination;
    public $stationID;
    public $status;
    public $tripID;
    public $rideDate;

    public function createRideRequest($clientID,$passengerCount,$destination,$stationID,$tripID,$rideDate){ 
        try{
            $query = "INSERT INTO ". $this->riderequests_table . "(clientID,passengerCount,destination,stationID,tripID,rideDate) VALUES (:clientID,:passengerCount, :destination, :stationID, :tripID, :rideDate)";

            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(':clientID', $clientID);
            $stmt->bindParam(':passengerCount', $passengerCount);
            $stmt->bindParam(':destination', $destination );
            $stmt->bindParam(':stationID', $stationID);
            $stmt->bindParam(':tripID', $tripID);
            $stmt->bindParam(':rideDate',$rideDate);

            if($stmt->execute()){
                $this->id = $this->conn->lastInsertId();
                return ['success' => true, 'message' => 'Request Successfull'];
            }else{
                return ['success' => false, 'message' => 'Failed to create Request.'];
            }

        }catch(Exception $e){
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }

    public function getRideRequestByDriver($username){
        try{
            $query = "SELECT rr.* , CONCAT(p.firstName, ' ', p.lastName) AS client_fullName, p.contactNo, p.email FROM " . $this->riderequests_table . " rr
            JOIN driver d ON d.assigned_station = rr.stationID 
            JOIN person p ON d.username = p.username
            WHERE d.username = :username 
            AND DATE(rr.rideDate) > CURRENT_DATE 
            AND d.maxPassengers >= rr.passengerCount
            AND rr.status = 'Pending'
            ORDER BY rr.rideDate ASC";

            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(':username', $username);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($results) {
                return ['success' => true, 'data' => $results];
            } else {
                return ['success' => false, 'message' => 'No Request found for the given driver ID.'];
            }

        }catch(Exception $e){
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }

    public function updateRequestStatus($username, $requestID) {
        try {
            // 1. Get driverID using the username
            $driverQuery = "SELECT d.id
                            FROM driver d 
                            JOIN person p ON d.username = p.username 
                            WHERE p.username = :username";
    
            $stmt = $this->conn->prepare($driverQuery);
            $stmt->bindParam(':username', $username);
            $stmt->execute();
            $driver = $stmt->fetch(PDO::FETCH_ASSOC);
    
            if (!$driver) {
                return ['success' => false, 'message' => 'Driver not found for the given username.'];
            }
    
            $driverID = $driver['id'];
    
            // 2. Update the ride request status to 'Accepted'
            $updateQuery = "UPDATE " . $this->riderequests_table . " 
                            SET status = 'Accepted' 
                            WHERE id = :requestID";
    
            $stmt1 = $this->conn->prepare($updateQuery);
            $stmt1->bindParam(':requestID', $requestID);
            $stmt1->execute();
    
            // 3. Insert into driverrequests table
            $insertQuery = "INSERT INTO " . $this->driver_requests_table . " (driverID, requestID) 
                            VALUES (:driverID, :requestID)";
    
            $stmt2 = $this->conn->prepare($insertQuery);
            $stmt2->bindParam(':driverID', $driverID);
            $stmt2->bindParam(':requestID', $requestID);
            $stmt2->execute();
    
            return ['success' => true, 'message' => 'Request accepted and assigned to driver.'];
    
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }

    public function getRidehistorybyDriver($username){
        try {
            // First, fetch the driver's ID using the username
            $driverQuery = "SELECT id FROM driver WHERE username = :username";
            $stmt = $this->conn->prepare($driverQuery);
            $stmt->bindParam(':username', $username);
            $stmt->execute();
            $driver = $stmt->fetch(PDO::FETCH_ASSOC);
    
            if (!$driver) {
                return ['success' => false, 'message' => 'Driver not found for the given username.'];
            }
    
            $driverID = $driver['id'];
    
            // Now fetch the ride history using the driver ID
            $rideQuery = "SELECT rr.* 
                          FROM " . $this->riderequests_table . " rr
                          JOIN driverrequests dr ON rr.id = dr.requestID
                          WHERE dr.driverID = :driverID AND rr.rideDate <= CURRENT_DATE
                          ORDER BY rr.rideDate DESC";
    
            $stmt = $this->conn->prepare($rideQuery);
            $stmt->bindParam(':driverID', $driverID);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
            if ($results) {
                return ['success' => true, 'data' => $results];
            } else {
                return ['success' => false, 'message' => 'No past rides found for this driver.'];
            }
    
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }
    
    
  }