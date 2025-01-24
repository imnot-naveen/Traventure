<?php
class Booking {
    private $conn;
    private $booking_table = 'booking';

    public function __construct($db) {
        $this->conn = $db;
    }

    // Booking properties
    public $booking_id;
    public $no_of_passengers;
    public $payment_status;
    public $booking_date;

    // Create a new booking
    public function createBooking($user_id) {
        try {
            $query = 'INSERT INTO ' . $this->booking_table . ' 
                      SET userID = :user_id, 
                          no_of_passengers = :no_of_passengers, 
                          paymentStatus = :payment_status, 
                          bookingDate = :booking_date';
    
            $stmt = $this->conn->prepare($query);
    
            // Bind parameters
            $stmt->bindParam(':user_id', $user_id); // Bind the passed user_id parameter
            $stmt->bindParam(':no_of_passengers', $this->no_of_passengers);
            $stmt->bindParam(':payment_status', $this->payment_status);
    
            // Set the current date for booking_date
            $currentDate = date('Y-m-d');
            $stmt->bindParam(':booking_date', $currentDate);
    
            // Execute the query
            if ($stmt->execute()) {
                return ['success' => true, 'message' => 'Booking created successfully.'];
            } else {
                return ['success' => false, 'message' => 'Failed to create booking.'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }

    //Get All bookings
    public function getAllbookings(){
        try {
            $query = 'SELECT * FROM ' . $this->booking_table;
            $stmt = $this->conn->prepare($query);

            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return ['success' => true, 'data' => $results];
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }

    public function getbookingsbyuserid($user_id){
        try {
            $query = 'SELECT * FROM ' . $this->booking_table . ' WHERE userID = :user_id';
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(':user_id', $user_id);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($results) {
                return ['success' => true, 'data' => $results];
            } else {
                return ['success' => false, 'message' => 'No bookings found for the given user ID.'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }

    public function cancalBooking($booking_id){
        try {
            $query = 'DELETE FROM ' . $this->booking_table . ' WHERE bookingID = :booking_id';
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(':booking_id', $booking_id);

            if ($stmt->execute()) {
                return ['success' => true, 'message' => 'Booking canceled successfully.'];
            } else {
                return ['success' => false, 'message' => 'Failed to cancel booking.'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }

    }
    
}
?>
