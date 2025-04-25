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
            JOIN registereduser u ON u.userId = rr.clientID 
            JOIN person p ON u.username = p.username
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
            // Start transaction for data consistency
            $this->conn->beginTransaction();
            
            // 1. Get driverID from the username
            $getDriverQuery = "SELECT d.id, CONCAT(p.firstName, ' ', p.lastName) AS fullName, p.contactNo, p.email, d.vehicleID 
                              FROM driver d
                              JOIN person p ON d.username = p.username
                              WHERE d.username = :username LIMIT 1";
            $stmt = $this->conn->prepare($getDriverQuery);
            $stmt->bindParam(':username', $username);
            $stmt->execute();
    
            if ($stmt->rowCount() === 0) {
                return ['success' => false, 'message' => 'Driver not found.'];
            }
    
            $driver = $stmt->fetch(PDO::FETCH_ASSOC);
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
            
            // 4. Fetch client and ride request details for the email using your schema
            $getDetailsQuery = "SELECT CONCAT(p.firstName, ' ', p.lastName) AS clientName, p.email AS clientEmail, p.contactNo AS clientContact,
                                       r.destination, r.rideDate, r.passengerCount
                                FROM " . $this->riderequests_table . " r
                                JOIN registereduser u ON r.clientID = u.userId
                                JOIN person p ON u.username = p.username
                                WHERE r.id = :requestID";
                                
            $stmt3 = $this->conn->prepare($getDetailsQuery);
            $stmt3->bindParam(':requestID', $requestID);
            $stmt3->execute();
            
            if ($stmt3->rowCount() === 0) {
                // Rollback if we can't find the ride details
                $this->conn->rollBack();
                return ['success' => false, 'message' => 'Ride request details not found.'];
            }
            
            $rideDetails = $stmt3->fetch(PDO::FETCH_ASSOC);
            
            // Commit the database transaction
            $this->conn->commit();
            
            // 5. Send notification email to client
            $emailResult = $this->sendAcceptanceEmail($rideDetails, $driver);
            
            return [
                'success' => true, 
                'message' => 'Request accepted and assigned to driver.',
                'emailSent' => $emailResult['sent'],
                'emailMessage' => $emailResult['message']
            ];
    
        } catch (Exception $e) {
            // Rollback transaction in case of error
            if ($this->conn->inTransaction()) {
                $this->conn->rollBack();
            }
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }
    
    /**
     * Send email notification to client when their ride request is accepted
     * 
     * @param array $rideDetails Array containing ride and client information
     * @param array $driverInfo Array containing driver information
     * @return array Status of the email sending operation
     */
    private function sendAcceptanceEmail($rideDetails, $driverInfo) {
        try {
            // Include PHPMailer
            require_once __DIR__ . '/../../vendor/autoload.php';
            
            // Create a new PHPMailer instance
            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            
            // Server settings
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com'; 
            $mail->SMTPAuth   = true;
            $mail->Username   = 'traventurecorp@gmail.com'; 
            $mail->Password   = 'jtgg ofoj obwp ftfs'; 
            $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;
            
            // Format date for email
            $formattedDate = date('l, F j, Y', strtotime($rideDetails['rideDate']));
            $formattedTime = date('h:i A', strtotime($rideDetails['rideDate']));
            
            // Recipients
            $mail->setFrom('notifications@traventure.com', 'Traventure');
            $mail->addAddress($rideDetails['clientEmail'], $rideDetails['clientName']);
            
            // Content
            $mail->isHTML(true);
            $mail->Subject = 'Your Ride Request Has Been Accepted - Traventure';
            $mail->Body = "
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #4CAF50; color: white; padding: 10px; text-align: center; }
                    .content { padding: 20px; border: 1px solid #ddd; border-top: none; }
                    .details { margin: 20px 0; background-color: #f9f9f9; padding: 15px; border-radius: 5px; }
                    .details div { margin-bottom: 10px; }
                    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; }
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h2>Good News! Your Ride Has Been Accepted</h2>
                    </div>
                    <div class='content'>
                        <p>Hello {$rideDetails['clientName']},</p>
                        <p>We're pleased to inform you that your ride request has been accepted by one of our drivers.</p>
                        
                        <div class='details'>
                            <h3>Ride Details:</h3>
                            <div><strong>Destination:</strong> {$rideDetails['destination']}</div>
                            <div><strong>Date:</strong> {$formattedDate}</div>
                            <div><strong>Time:</strong> {$formattedTime}</div>
                            <div><strong>Passenger Count:</strong> {$rideDetails['passengerCount']}</div>
                        </div>
                        
                        <div class='details'>
                            <h3>Your Driver:</h3>
                            <div><strong>Name:</strong> {$driverInfo['fullName']}</div>
                            <div><strong>Contact Number:</strong> {$driverInfo['contactNo']}</div>
                            <div><strong>Email:</strong> {$driverInfo['email']}</div>
                            <div><strong>Vehicle Number:</strong> {$driverInfo['vehicleID']}</div>
                        </div>
                        
                        <p>Your driver will meet you at the agreed pickup location. If you need to make any changes to your request or have any questions, please contact your driver directly or our support team.</p>
                        
                        <p>Thank you for choosing Traventure for your journey!</p>
                    </div>
                    <div class='footer'>
                        <p>© " . date('Y') . " Traventure. All rights reserved.</p>
                        <p>Please do not reply to this email as it was sent from an automated system.</p>
                    </div>
                </div>
            </body>
            </html>
            ";
            
            // Plain text version for non-HTML mail clients
            $mail->AltBody = "
            Good News! Your Ride Has Been Accepted
            
            Hello {$rideDetails['clientName']},
            
            We're pleased to inform you that your ride request has been accepted by one of our drivers.
            
            Ride Details:
            - Destination: {$rideDetails['destination']}
            - Date: {$formattedDate}
            - Time: {$formattedTime}
            - Passenger Count: {$rideDetails['passengerCount']}
            
            Your Driver:
            - Name: {$driverInfo['fullName']}
            - Contact Number: {$driverInfo['contactNo']}
            - Email: {$driverInfo['email']}
            
            Your driver will meet you at the agreed pickup location. If you need to make any changes to your request or have any questions, please contact your driver directly or our support team.
            
            Thank you for choosing Traventure for your journey!
            
            © " . date('Y') . " Traventure. All rights reserved.
            Please do not reply to this email as it was sent from an automated system.
            ";
            
            $mail->send();
            return ['sent' => true, 'message' => 'Email notification sent successfully.'];
        } catch (Exception $e) {
            error_log("Email could not be sent. Mailer Error: {$mail->ErrorInfo}");
            return ['sent' => false, 'message' => "Email could not be sent. Error: {$e->getMessage()}"];
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