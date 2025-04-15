<?php
class User extends Person{
  private $user_table = 'registereduser';
  private $conn;
  private $person_table = 'person';

  // User-specific properties
  public $userid;
  public $password; // Only for use in login table
  public $userType;


  public function __construct($db) {
    parent::__construct($db); 
    $this->conn = $db; 
  }

  public function getUserDetails($userid) {
    try {
        $query = 'SELECT u.username, p.firstName AS first_name, p.lastName AS last_name, 
                         p.email, p.contactNo AS contact_number, u.userID AS userid
                  FROM ' . $this->user_table . ' u
                  INNER JOIN ' . $this->person_table . ' p ON u.username = p.username
                  WHERE u.userID = :userid LIMIT 1';  

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':userid', $userid, PDO::PARAM_INT); 

        if ($stmt->execute() && $stmt->rowCount() > 0) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }

        return null;
    } catch (PDOException $e) {
        error_log("Database Error: " . $e->getMessage()); 
        return null;
    }
  }

  // Get monthly user registration counts
  public function getUserGrowthByMonth() {
    try {
        $query = "
        SELECT DATE_FORMAT(p.created_at, '%Y-%m') AS month, COUNT(*) AS user_count
        FROM {$this->user_table} u
        INNER JOIN {$this->person_table} p ON u.username = p.username
        GROUP BY month
        ORDER BY month ASC
    ";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        error_log("User Growth Fetch Error: " . $e->getMessage());
        return [];
    }
  }
}
 ?>