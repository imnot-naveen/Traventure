<?php
class User extends Person{
  private $user_table = 'registereduser';
  private $conn;
  private $person_table = 'person';

  // User-specific properties
  public $userid;
  public $password; // Only for use in login table
  public $userType;

  // Constructor to initialize db connection and parent class
  public function __construct($db) {
    parent::__construct($db); // Call the parent class constructor
    $this->conn = $db; // Assign the database connection
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

}
 ?>