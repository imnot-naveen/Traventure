<?php
class Admin extends Person {
    private string $admin_table = 'systemadmin';
    private string $person_table = 'person';
    private PDO $conn;

    // Admin-specific properties
    public string $adminid;
    public ?string $userType = null;

    // Constructor to initialize db connection and parent class
    public function __construct(PDO $db) {
        parent::__construct($db); // Call the parent class constructor
        $this->conn = $db; // Assign the database connection
    }

    // Fetch admin details based on username
    public function getAdminDetails(string $username): ?array {
        try {
            $query = 'SELECT a.username, p.firstName AS first_name, p.lastName AS last_name, 
                             p.email, p.contactNo AS contact_number, a.adminID AS adminid
                      FROM ' . $this->admin_table . ' a
                      INNER JOIN ' . $this->person_table . ' p ON a.username = p.username
                      WHERE a.username = :username LIMIT 1';

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':username', $username, PDO::PARAM_STR);

            if ($stmt->execute() && $stmt->rowCount() > 0) {
                return $stmt->fetch(PDO::FETCH_ASSOC); 
            }

            return null; 
        } catch (PDOException $e) {
            error_log('Error in getAdminDetails: ' . $e->getMessage());
            return null; 
        }
    }
}
?>
