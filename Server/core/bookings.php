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
    public $trainID;

    // Create a new booking
    public function createBooking($userID, $start_station, $destination_station, $class, $no_of_passengers, $total_fare, $paymentMethod, $trainID) {
        try {
            $query = "INSERT INTO " . $this->booking_table . " 
                    (userID, start_station, destination_station, class, no_of_passengers, total_fare, paymentMethod, trainID)
                    VALUES (:userID, :start_station, :destination_station, :class, :no_of_passengers, :total_fare, :paymentMethod, :trainID)";
    
            $stmt = $this->conn->prepare($query);
    
            // Bind parameters
            $stmt->bindParam(':userID', $userID);
            $stmt->bindParam(':start_station', $start_station);
            $stmt->bindParam(':destination_station', $destination_station);
            $stmt->bindParam(':class', $class);
            $stmt->bindParam(':no_of_passengers', $no_of_passengers);
            $stmt->bindParam(':total_fare', $total_fare);
            $stmt->bindParam(':paymentMethod', $paymentMethod);
            $stmt->bindParam(':trainID', $trainID);
    
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
                u.username AS user_name,
                t.name AS train_name
                FROM ' . $this->booking_table . ' b
                JOIN registereduser u ON b.userID = u.userID
                JOIN train t ON b.trainID = t.trainID
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
            $query = 'SELECT b.*, t.name,
            s1.name as start_station_name, 
            s2.name as destination_station_name
     FROM ' . $this->booking_table . ' b
     JOIN station s1 ON b.start_station = s1.stationID
     JOIN station s2 ON b.destination_station = s2.stationID
     JOIN train t ON t.trainID = b.trainID
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
            $query = 'SELECT b.*, CONCAT(p.firstName, \' \', p.lastName) AS fullName,
          s1.name as start_station_name, 
          s2.name as destination_station_name
          FROM ' . $this->booking_table . ' b
          JOIN registereduser r ON r.userID = b.userID
          JOIN person p ON p.username = r.username
          JOIN station s1 ON b.start_station = s1.stationID
          JOIN station s2 ON b.destination_station = s2.stationID
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


    // Get recent bookings
    public function getRecentBookings() {
        try {
            $query = "SELECT CONCAT(p.firstName, ' ', p.lastName) AS FullName, 
                        s1.name AS startStation, 
                        s2.name AS endStation, 
                        b.bookingDate 
                    FROM bookings b
                    JOIN registereduser r ON r.userID = b.userID
                    JOIN station s1 ON b.start_station = s1.stationID
                    JOIN station s2 ON b.destination_station = s2.stationID
                    JOIN person p ON p.username = r.username 
                    ORDER BY b.bookingDate DESC 
                    LIMIT 3";

            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if ($results) {
                $recentBookings = [];
                foreach ($results as $row) {
                    // Add the booking to the result array with timeAgo formatting
                    $recentBookings[] = [
                        'userName' => $row['FullName'],
                        'startStation' => $row['startStation'],
                        'endStation' => $row['endStation'],
                        'timeAgo' => $this->timeAgo($row['bookingDate']),
                    ];
                }
                return ['success' => true, 'data' => $recentBookings];
            } else {
                return ['success' => false, 'message' => 'No recent bookings found.'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }

    // Helper function to calculate time ago
    public function timeAgo($timestamp) {
        $time = strtotime($timestamp);
        $timeDiff = time() - $time;
        
        if ($timeDiff < 60) {
            return "$timeDiff seconds ago";
        } elseif ($timeDiff < 3600) {
            return floor($timeDiff / 60) . " minutes ago";
        } elseif ($timeDiff < 86400) {
            return floor($timeDiff / 3600) . " hours ago";
        } else {
            return floor($timeDiff / 86400) . " days ago";
        }
    }

    public function getBookingCountByMonth() {
        try {
            // Query to get booking count grouped by month and year
            $query = "SELECT YEAR(bookingDate) AS year, MONTH(bookingDate) AS month, COUNT(*) AS booking_count
                      FROM " . $this->booking_table . "
                      GROUP BY YEAR(bookingDate), MONTH(bookingDate)
                      ORDER BY year DESC, month DESC";
    
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
            if ($results) {
                return ['success' => true, 'data' => $results];
            } else {
                return ['success' => false, 'message' => 'No bookings found.'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    } 
    
    public function getBookingsByMonth($year, $month) {
        try {
            $query = "SELECT b.*, 
                             u.username AS user_name,
                             t.name AS train_name
                      FROM " . $this->booking_table . " b
                      JOIN registereduser u ON b.userID = u.userID
                      JOIN train t ON b.trainID = t.trainID
                      WHERE YEAR(b.bookingDate) = :year AND MONTH(b.bookingDate) = :month
                      ORDER BY b.bookingDate DESC";
    
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':year', $year);
            $stmt->bindParam(':month', $month);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
            return ['success' => true, 'data' => $results];
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    } 
    
    public function getBookingCountforDay(){
        try {
            $query = 'SELECT COUNT(*) as count FROM bookings WHERE bookingDate >= NOW() - INTERVAL 1 DAY';
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
    
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return ['success' => true, 'count' => $result['count']];
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error: '. $e->getMessage()];
        }
    }

    public function getBookingRevenueforMonth(){
        try {
            $query = 'SELECT SUM(total_fare) as revenue 
                      FROM bookings 
                      WHERE MONTH(bookingDate) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH) 
                      AND YEAR(bookingDate) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)';
    
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
    
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return ['success' => true, 'revenue' => $result['revenue'] ?? 0];
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }

  public function getMonthlyBookingCounts() {
    try {
        $query = "
        SELECT 
            MONTH(b.bookingDate) AS month,
            COUNT(*) AS booking_count
        FROM 
            {$this->booking_table} b
        WHERE 
            YEAR(b.bookingDate) = YEAR(CURDATE())
        GROUP BY 
            MONTH(b.bookingDate)
        ORDER BY 
            month
    ";    

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Optional: convert month numbers to names
        foreach ($result as &$row) {
            $row['month_name'] = date("F", mktime(0, 0, 0, $row['month'], 1));
        }

        return $result;

    } catch (PDOException $e) {
        error_log("Monthly User Count Error: " . $e->getMessage());
        return [];
    }
}

public function bookingCountlastmonth() {
    try {
        // Query to count the bookings from the last month
        $query = 'SELECT COUNT(*) as count 
                  FROM bookings 
                  WHERE YEAR(bookingDate) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH) 
                  AND MONTH(bookingDate) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)';
        
        // Prepare and execute the query
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        // Fetch the result
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Return the count
        return ['success' => true, 'count' => $result['count']];
    } catch (Exception $e) {
        // Catch and return error message if any exception occurs
        return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
    }
}

public function revenueLastMonth(){
    try {
        $query = 'SELECT SUM(total_fare) AS total_revenue
                  FROM bookings
                  WHERE DATE(bookingDate) >= CURDATE() - INTERVAL 1 MONTH';
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['total_revenue'] ? $result['total_revenue'] : 0;
    } catch (PDOException $e) {
        error_log("Last month revenue Error: " . $e->getMessage());
        return [];
    }
}


public function bookingDetailsLastMonth() {
    try {
        $query = "
            SELECT b.bookingID,p.username,CONCAT(p.firstName, ' ', p.lastName) as fullName, s1.name AS Start_Station_name, s2.name AS End_station_name, t.name AS train_name , b.no_of_passengers, b.total_fare,b.paymentMethod,b.paymentStatus, b.bookingDate ,b.kidsCount
            FROM bookings b
            JOIN registereduser r ON b.userId = r.userId
            JOIN person p ON r.username = p.username
            JOIN station s1 ON b.start_station = s1.stationID
            JOIN station s2 ON b.destination_station = s2.stationID
            JOIN train t ON b.trainID = t.trainID
            WHERE bookingDate >= DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01') AND bookingDate <= LAST_DAY(CURDATE())";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!empty($results)) {
            return [
                'success' => true,
                'data' => $results
            ];
        } else {
            return [
                'success' => false,
                'message' => 'No bookings found in the last month.'
            ];
        }
    } catch (PDOException $e) {
        error_log("Last month booking details Error: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Database error: ' . $e->getMessage()
        ];
    }
}
    
}
?>