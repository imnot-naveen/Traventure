<?php
class Person {
    private $conn;
    private $person_table = 'person';
    private $login_table = 'login';

    // Person properties
    public $username;
    public $first_name;
    public $last_name;
    public $email;
    public $contact_number;
    public $password; // Only for use in login table

    // Constructor to initialize db connection
    public function __construct($db) {
        $this->conn = $db;
    }

    // Sign up a new user
    public function signup() {
        // Check if the user already exists in the person table
        $query = 'SELECT * FROM ' . $this->person_table . ' WHERE email = :email OR username = :username LIMIT 1';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':username', $this->username);
        $stmt->execute();
    
        if ($stmt->rowCount() > 0) {
            return ['success' => false, 'message' => 'User  already exists.'];
        }
    
        // Insert into the person table
        $query = 'INSERT INTO ' . $this->person_table . ' SET username = :username, firstName = :first_name, lastName = :last_name, email = :email, contactNo = :contact_number';
        $stmt = $this->conn->prepare($query);
    
        // Bind parameters
        $stmt->bindParam(':username', $this->username);
        $stmt->bindParam(':first_name', $this->first_name);
        $stmt->bindParam(':last_name', $this->last_name);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':contact_number', $this->contact_number);
    
        if ($stmt->execute()) {
            // Insert into the login table
            $query = 'INSERT INTO ' . $this->login_table . ' SET username = :username, password = :password, email = :email';
            $stmt = $this->conn->prepare($query);
    
            // Hash the password
            $hashed_password = password_hash($this->password, PASSWORD_DEFAULT);
    
            // Bind parameters
            $stmt->bindParam(':username', $this->username);
            $stmt->bindParam(':password', $hashed_password);
            $stmt->bindParam(':email', $this->email);
    
            if ($stmt->execute()) {
                return ['success' => true, 'message' => 'User  created successfully.'];
            } else {
                return ['success' => false, 'message' => 'Failed to create login entry.'];
            }
        }
    
        return ['success' => false, 'message' => 'User  could not be created.'];
    }
}
?>