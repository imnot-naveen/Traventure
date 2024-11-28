<?php
class Admin extends Person {
    private $admin_table = 'systemadmin';
    private $conn;
    private $person_table = 'person';

    // TSP-specific properties
    public $adminid;
    public $password; // Only for use in login table
    public $userType;

    // Constructor to initialize db connection and parent class
    public function __construct($db) {
        parent::__construct($db); // Call the parent class constructor
        $this->conn = $db; // Assign the database connection
    }

  public function getAdminDetails($adminid) {
    try {
        $query = 'SELECT a.username, p.firstName AS first_name, p.lastName AS last_name, 
                         p.email, p.contactNo AS contact_number, a.adminID AS adminid
                  FROM ' . $this->admin_table . ' a
                  INNER JOIN ' . $this->person_table . ' p ON a.username = p.username
                  WHERE a.adminID = :adminid LIMIT 1';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':adminid', $adminid, PDO::PARAM_STR);

        if ($stmt->execute() && $stmt->rowCount() > 0) {
            return $stmt->fetch(PDO::FETCH_ASSOC); // Fetch admin details
        }

        return null; 
    } catch (PDOException $e) {
        return null; 
    }
  }
 

}
?>
