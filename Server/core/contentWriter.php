<?php 
class contentWriter extends person{
  private $cw_table = 'contentwriter';
  private $conn;
  private $person_table = 'person';
  private $login_table = 'login';

  // TSP-specific properties
    public $cwid;
    public $Active_status;
    public $password; // Only for use in login table
    public $userType;

    // Constructor to initialize db connection and parent class
    public function __construct($db) {
      parent::__construct($db); // Call the parent class constructor
      $this->conn = $db; // Assign the database connection
    }

    public function registerCW() {
      try {
          // Step 1: Check if the CWID or email already exists
          $query = 'SELECT * FROM contentwriter cw
                    INNER JOIN person p ON cw.username = p.username
                    WHERE cw.CWID = :cwid OR p.email = :email LIMIT 1';
    
          $stmt = $this->conn->prepare($query);
          $stmt->bindParam(':cwid', $this->cwid);
          $stmt->bindParam(':email', $this->email);
          $stmt->execute();
    
          if ($stmt->rowCount() > 0) {
              return ['success' => false, 'message' => 'Content Writer CWID or email already exists.'];
          }
    
          // Step 2: Begin transaction
          $this->conn->beginTransaction();
    
          // Step 3: Insert into the person table
          $query = 'INSERT INTO person (username, firstName, lastName, email, contactNo, userType) 
                    VALUES (:username, :first_name, :last_name, :email, :contact_no, :userType)';
          $stmt = $this->conn->prepare($query);
          $stmt->bindParam(':username', $this->username);
          $stmt->bindParam(':first_name', $this->first_name);
          $stmt->bindParam(':last_name', $this->last_name);
          $stmt->bindParam(':email', $this->email);
          $stmt->bindParam(':contact_no', $this->contact_number);
          $stmt->bindParam(':userType', $this->userType); // Corrected to userType
    
          if (!$stmt->execute()) {
              $this->conn->rollBack();
              return ['success' => false, 'message' => 'Failed to register person details.'];
          }
    
          // Step 4: Insert into the contentwriter table
          $query = 'INSERT INTO contentwriter (CWID, username) 
                    VALUES (:cwid, :username)';
          $stmt = $this->conn->prepare($query);
          $stmt->bindParam(':cwid', $this->cwid);
          $stmt->bindParam(':username', $this->username);
    
          if (!$stmt->execute()) {
              $this->conn->rollBack();
              return ['success' => false, 'message' => 'Failed to register Content Writer.'];
          }
    
          // Step 5: Insert into the login table
          $query = 'INSERT INTO login (username, email, password, userType) 
                    VALUES (:username, :email, :password, :userType)';
          $stmt = $this->conn->prepare($query);
    
          // Hash the password before storing
          $hashedPassword = password_hash($this->password, PASSWORD_DEFAULT);
          $stmt->bindParam(':username', $this->username);
          $stmt->bindParam(':email', $this->email);
          $stmt->bindParam(':password', $hashedPassword);
          $stmt->bindParam(':userType', $this->userType);
    
          if (!$stmt->execute()) {
              $this->conn->rollBack();
              return ['success' => false, 'message' => 'Failed to register login details.'];
          }
    
          // Step 6: Commit the transaction
          $this->conn->commit();
    
          return ['success' => true, 'message' => 'Content Writer registered successfully.'];
    
      } catch (PDOException $e) {
          // Rollback the transaction on error
          $this->conn->rollBack();
          return ['success' => false, 'message' => 'Database error: ' . $e->getMessage()];
      }
    }

    // GET all ContentWriters
    public function getAllCWs() {
      $query = 'SELECT c.username, p.firstName AS first_name, p.lastName AS last_name, p.email, p.contactNo AS contact_number, c.status AS Active_status,
                       c.CWID AS cwid 
                FROM ' . $this->cw_table . ' c
                INNER JOIN ' . $this->person_table . ' p ON c.username = p.username';

      $stmt = $this->conn->prepare($query);

      if ($stmt->execute()) {
          return $stmt->fetchAll(PDO::FETCH_ASSOC); 
      }
      return null; 
  }
    
  public function getRowCount() {
    try {
        $query = 'SELECT COUNT(*) AS total FROM ' . $this->cw_table;
        $stmt = $this->conn->prepare($query);

        if ($stmt->execute()) {
            $result = $stmt->fetch(PDO::FETCH_ASSOC); 
            return $result['total']; // Return the count
        }

        return 0; // If query execution fails, return 0
    } catch (PDOException $e) {
        return 0; // Handle exception and return 0 as a fallback
    }
  }
  
}
?>