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
    public $user_type;

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
            return ['success' => false, 'message' => 'User already exists.'];
        }

        // Insert into the person table
        $query = 'INSERT INTO ' . $this->person_table . ' SET username = :username, firstName = :first_name, lastName = :last_name, email = :email, contactNo = :contact_number, userType = "Traveller"';
        $stmt = $this->conn->prepare($query);

        // Bind parameters
        $stmt->bindParam(':username', $this->username);
        $stmt->bindParam(':first_name', $this->first_name);
        $stmt->bindParam(':last_name', $this->last_name);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':contact_number', $this->contact_number);

        if ($stmt->execute()) {
            // Insert into the login table
            $query = 'INSERT INTO ' . $this->login_table . ' SET username = :username, password = :password, email = :email, userType = "Traveller"';
            $stmt = $this->conn->prepare($query);

            // Hash the password
            $hashed_password = password_hash($this->password, PASSWORD_DEFAULT);

            // Bind parameters
            $stmt->bindParam(':username', $this->username);
            $stmt->bindParam(':password', $hashed_password);
            $stmt->bindParam(':email', $this->email);

            if ($stmt->execute()) {
                return ['success' => true, 'message' => 'User created successfully.'];
            } else {
                return ['success' => false, 'message' => 'Failed to create login entry.'];
            }
        }

        return ['success' => false, 'message' => 'User could not be created.'];
    }

    // Get user profile
    public function getUserProfile($username) {
        $query = 'SELECT * FROM ' . $this->person_table . ' WHERE username = :username LIMIT 1';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':username', $username);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            return null;
        }
    }

    public function getAllPersons() {
        $query = 'SELECT username, firstName AS first_name, lastName AS last_name, email, contactNo AS contact_number 
                  FROM ' . $this->person_table;
        $stmt = $this->conn->prepare($query);

        if ($stmt->execute()) {
            return $stmt->fetchAll(PDO::FETCH_ASSOC); // Fetch all records as an associative array
        }

        return null; // Return null if the query fails
    }

    // Update user profile
    public function updateProfile() {
        // Validate input
        if (empty($this->username) || empty($this->first_name) || empty($this->last_name) || empty($this->email) || empty($this->contact_number)) {
            return ['success' => false, 'message' => 'All fields are required'];
        }

        try {
            // Update person table
            $query = 'UPDATE ' . $this->person_table . ' 
                      SET firstName = :first_name, 
                          lastName = :last_name, 
                          email = :email, 
                          contactNo = :contact_number 
                      WHERE username = :username';
            
            $stmt = $this->conn->prepare($query);
            
            $stmt->bindParam(':first_name', $this->first_name);
            $stmt->bindParam(':last_name', $this->last_name);
            $stmt->bindParam(':email', $this->email);
            $stmt->bindParam(':contact_number', $this->contact_number);
            $stmt->bindParam(':username', $this->username);
            
            if ($stmt->execute()) {
                // Optionally update email in login table
                $login_query = 'UPDATE ' . $this->login_table . ' SET email = :email WHERE username = :username';
                $login_stmt = $this->conn->prepare($login_query);
                $login_stmt->bindParam(':email', $this->email);
                $login_stmt->bindParam(':username', $this->username);
                $login_stmt->execute();

                return [
                    'success' => true, 
                    'message' => 'Profile updated successfully',
                    'data' => [
                        'firstName' => $this->first_name,
                        'lastName' => $this->last_name,
                        'email' => $this->email,
                        'contactNo' => $this->contact_number
                    ]
                ];
            }

            return ['success' => false, 'message' => 'Failed to update profile'];
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }
}
?>