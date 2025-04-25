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
        if (empty($userid)) {
            return null;
        }

        $query = 'SELECT u.username, p.firstName AS first_name, p.lastName AS last_name, 
                         p.email, p.contactNo AS contact_number, u.userID AS userid, status
                  FROM ' . $this->user_table . ' AS u
                  INNER JOIN ' . $this->person_table . ' AS p ON u.username = p.username
                  WHERE u.userID = :userid
                  LIMIT 1';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':userid', $userid, PDO::PARAM_INT);

        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ?: null;

    } catch (PDOException $e) {
        error_log("Database Error: " . $e->getMessage());
        return null;
    }
}

  // Get monthly user registration counts
  public function getMonthlyUserCounts() {
    try {
        $query = "
            SELECT 
                MONTH(p.created_at) AS month,
                COUNT(*) AS user_count
            FROM 
                {$this->user_table} u
            JOIN 
                {$this->person_table} p ON u.username = p.username
            WHERE 
                YEAR(p.created_at) = YEAR(CURDATE())
            GROUP BY 
                MONTH(p.created_at)
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

  public function countUsersLastMonth() {
    try {
        $query = "
        SELECT COUNT(*) AS recent_users 
        FROM {$this->user_table} u
        INNER JOIN {$this->person_table} p ON u.username = p.username
        WHERE p.created_at >= NOW() - INTERVAL 1 MONTH
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

  public function updateRegisteredUser() {
    try {
        // Initialize query parts
        $setParts = [];
        $params = [];

        // Dynamically build query parts for provided fields
        if (!empty($this->first_name)) {
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

        // Ensure at least one field is being updated
        if (empty($setParts)) {
            return ['success' => false, 'message' => 'No fields provided for update.'];
        }

        // Finalize query
        $query = 'UPDATE ' . $this->user_table . ' r 
                  INNER JOIN ' . $this->person_table . ' p 
                  ON r.username = p.username 
                  SET ' . implode(', ', $setParts) . ' 
                  WHERE r.userId = :userId';

        $params[':userId'] = $this->userid;

        // Prepare and execute
        $stmt = $this->conn->prepare($query);
        if ($stmt->execute($params)) {
            return ['success' => true, 'message' => 'Registered user updated successfully.'];
        }

        return ['success' => false, 'message' => 'Failed to update registered user.'];
    } catch (PDOException $e) {
        return ['success' => false, 'message' => $e->getMessage()];
    }
}

public function updateStatus($userid, $status) {
  try {
      // Corrected query with consistent placeholder naming
      $query = 'UPDATE ' . $this->user_table . ' SET status = :status WHERE userId = :userid';
      $stmt = $this->conn->prepare($query);

      // Correct parameter binding
      $stmt->bindParam(':status', $status, PDO::PARAM_STR);
      $stmt->bindParam(':userid', $userid, PDO::PARAM_STR);

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

}
 ?>