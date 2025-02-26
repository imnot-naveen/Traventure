<?php
class Bookings {
    private $conn;
    private $booking_table = 'bookings';

    public function __construct($db) {
        $this->conn = $db;
    }

    // Booking properties
    public $bookingID;
    public $userID;
    public $start_station;
    public $destination_station;
    public $class;
    public $no_of_passengers;
    public $total_fare;
    public $paymentMethod;
    public $paymentStatus;
    public $bookingDate;

    // Create a new booking
    public function createBooking($userID, $start_station, $destination_station, $class, $no_of_passengers, $total_fare, $paymentMethod) {
        try {
            $query = "INSERT INTO " . $this->booking_table . " 
                    (userID, routeID, start_station, destination_station, class, no_of_passengers, total_fare, paymentMethod)
                    VALUES (:userID, :routeID, :start_station, :destination_station, :class, :no_of_passengers, :total_fare, :paymentMethod)";
    
            $stmt = $this->conn->prepare($query);
    
            // Bind parameters
            $stmt->bindParam(':userID', $userID);
            $stmt->bindParam(':start_station', $start_station);
            $stmt->bindParam(':destination_station', $destination_station);
            $stmt->bindParam(':class', $class);
            $stmt->bindParam(':no_of_passengers', $no_of_passengers);
            $stmt->bindParam(':total_fare', $total_fare);
            $stmt->bindParam(':paymentMethod', $paymentMethod);
    
            // Execute the query
            if ($stmt->execute()) {
                $this->bookingID = $this->conn->lastInsertId();
                return ['success' => true, 'message' => 'Booking created successfully.', 'bookingID' => $this->bookingID];
            } else {
                return ['success' => false, 'message' => 'Failed to create booking.'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }

    // Get All bookings
    public function getAllBookings() {
        try {
            $query = 'SELECT b.*, 
                        s1.station_name as start_station_name, 
                        s2.station_name as destination_station_name,
                        tr.route_name
                     FROM ' . $this->booking_table . ' b
                     JOIN stations s1 ON b.start_station = s1.stationID
                     JOIN stations s2 ON b.destination_station = s2.stationID
                     LEFT JOIN train_routes tr ON b.routeID = tr.routeID
                     ORDER BY b.bookingDate DESC';
            
            $stmt = $this->conn->prepare($query);

            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return ['success' => true, 'data' => $results];
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }

    // Get bookings by user ID
    public function getBookingsByUserID($userID) {
        try {
            $query = 'SELECT b.*, 
                        s1.station_name as start_station_name, 
                        s2.station_name as destination_station_name,
                        tr.route_name
                     FROM ' . $this->booking_table . ' b
                     JOIN stations s1 ON b.start_station = s1.stationID
                     JOIN stations s2 ON b.destination_station = s2.stationID
                     LEFT JOIN train_routes tr ON b.routeID = tr.routeID
                     WHERE b.userID = :userID
                     ORDER BY b.bookingDate DESC';
            
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(':userID', $userID);
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

    // Get booking by ID
    public function getBookingByID($bookingID) {
        try {
            $query = 'SELECT b.*, 
                        s1.station_name as start_station_name, 
                        s2.station_name as destination_station_name,
                        tr.route_name
                     FROM ' . $this->booking_table . ' b
                     JOIN stations s1 ON b.start_station = s1.stationID
                     JOIN stations s2 ON b.destination_station = s2.stationID
                     LEFT JOIN train_routes tr ON b.routeID = tr.routeID
                     WHERE b.bookingID = :bookingID';
            
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(':bookingID', $bookingID);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($result) {
                return ['success' => true, 'data' => $result];
            } else {
                return ['success' => false, 'message' => 'Booking not found.'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }

    // Update payment status
    public function updatePaymentStatus($bookingID, $paymentStatus) {
        try {
            $query = 'UPDATE ' . $this->booking_table . ' 
                     SET paymentStatus = :paymentStatus 
                     WHERE bookingID = :bookingID';
            
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(':bookingID', $bookingID);
            $stmt->bindParam(':paymentStatus', $paymentStatus);

            if ($stmt->execute()) {
                return ['success' => true, 'message' => 'Payment status updated successfully.'];
            } else {
                return ['success' => false, 'message' => 'Failed to update payment status.'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }

    // Cancel booking
    public function cancelBooking($bookingID) {
        try {
            $query = 'DELETE FROM ' . $this->booking_table . ' WHERE bookingID = :bookingID';
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(':bookingID', $bookingID);

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