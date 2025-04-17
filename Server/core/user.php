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


  public function getAllUsers() {
    try {
        $query = "
            SELECT u.userID AS userid, u.username, p.firstName AS first_name, 
                   p.lastName AS last_name, p.email, p.contactNo AS contact_number, 
                   p.created_at
            FROM {$this->user_table} u
            INNER JOIN {$this->person_table} p ON u.username = p.username
            ORDER BY p.created_at DESC
        ";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        error_log("Fetch All Users Error: " . $e->getMessage());
        return [];
    }
  }

  public function getUserById($userid){
    try {
      $query = 'SELECT u.username, p.firstName AS first_name, p.lastName AS last_name, u.status, 
                       p.email, p.contactNo AS contact_number, u.userId AS userid 
                FROM ' . $this->user_table . ' u 
                INNER JOIN ' . $this->person_table . ' p ON u.username = p.username 
                WHERE u.userId = :userid 
                LIMIT 1';
  
      $stmt = $this->conn->prepare($query);
      $stmt->bindParam(':userid', $userid, PDO::PARAM_STR);
  
      if ($stmt->execute() && $stmt->rowCount() > 0) {
        return $stmt->fetch(PDO::FETCH_ASSOC);
      }
    } catch (PDOException $e) {
      return null;
    }
  }
  
  public function countUsers() {
    try {
        $query = "SELECT COUNT(*) AS total_users FROM {$this->user_table}";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['total_users'] ?? 0;
    } catch (PDOException $e) {
        error_log("Count Users Error: " . $e->getMessage());
        return 0;
    }
  }

  public function countUsersLast24Hours() {
    try {
        $query = "
            SELECT COUNT(*) AS recent_users 
            FROM {$this->user_table} u
            INNER JOIN {$this->person_table} p ON u.username = p.username
            WHERE p.created_at >= NOW() - INTERVAL 1 DAY
        ";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['recent_users'] ?? 0;

    } catch (PDOException $e) {
        error_log("Count Users Last 24h Error: " . $e->getMessage());
        return 0;
    }
  }

  public function updateUserById($userid, $newData) {
    try {
        // Begin transaction
        $this->conn->beginTransaction();

        // Fetch username using userID
        $queryUsername = "SELECT username FROM {$this->user_table} WHERE userID = :userid";
        $stmtUsername = $this->conn->prepare($queryUsername);
        $stmtUsername->bindParam(':userid', $userid, PDO::PARAM_INT);
        $stmtUsername->execute();

        if ($stmtUsername->rowCount() === 0) {
            return false; // User not found
        }

        $username = $stmtUsername->fetchColumn();

        // Update person table
        $queryPerson = "UPDATE {$this->person_table}
                        SET firstName = :first_name, lastName = :last_name,
                            email = :email, contactNo = :contact_number
                        WHERE username = :username";

        $stmtPerson = $this->conn->prepare($queryPerson);
        $stmtPerson->bindParam(':first_name', $newData['first_name']);
        $stmtPerson->bindParam(':last_name', $newData['last_name']);
        $stmtPerson->bindParam(':email', $newData['email']);
        $stmtPerson->bindParam(':contact_number', $newData['contact_number']);
        $stmtPerson->bindParam(':username', $username);

        // Execute both updates
        $stmtPerson->execute();

        // Commit transaction
        $this->conn->commit();
        return true;

    } catch (PDOException $e) {
        $this->conn->rollBack();
        error_log("Update User Error: " . $e->getMessage());
        return false;
    }
  }
}
 ?>