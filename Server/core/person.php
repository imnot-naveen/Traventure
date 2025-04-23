<?php
class Person {
    private $conn;
    private $person_table = 'person';
    private $login_table = 'login';
    private $user_table = 'registereduser';

    // Person properties
    public $username;
    public $first_name;
    public $last_name;
    public $id_number;
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
        $query = 'INSERT INTO ' . $this->person_table . ' SET username = :username, firstName = :first_name, lastName = :last_name, IDNumber = :id_number, email = :email, contactNo = :contact_number, userType = "Traveller"';
        $stmt = $this->conn->prepare($query);

        // Bind parameters
        $stmt->bindParam(':username', $this->username);
        $stmt->bindParam(':first_name', $this->first_name);
        $stmt->bindParam(':last_name', $this->last_name);
        $stmt->bindParam(':id_number', $this->id_number);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':contact_number', $this->contact_number);

        if ($stmt->execute()) {
            // Insert into the login table
            $query = 'INSERT INTO ' . $this->login_table . ' SET username = :username, password = :password, email = :email, userType = "Traveller"';
            $stmt = $this->conn->prepare($query);
        
            $hashed_password = password_hash($this->password, PASSWORD_DEFAULT);
        
            $stmt->bindParam(':username', $this->username);
            $stmt->bindParam(':password', $hashed_password);
            $stmt->bindParam(':email', $this->email);
        
            if ($stmt->execute()) {
                // Insert into registereduser table
                $query = 'INSERT INTO ' . $this->user_table . ' (username) VALUES (:username)';
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':username', $this->username);
        
                if ($stmt->execute()) {
                    return ['success' => true, 'message' => 'User created successfully.'];
                } else {
                    return ['success' => false, 'message' => 'User and login created, but failed to insert into registereduser.'];
                }
            } else {
                return ['success' => false, 'message' => 'Failed to create login entry.'];
            }
        }        

        return ['success' => false, 'message' => 'User could not be created.'];
    }

    // Get user profile
    public function getUserProfile($username) {
        // First query - get basic user info
        $query = "SELECT p.firstName, p.lastName, p.email, p.contactNo
                 FROM person p 
                 WHERE p.username = :username";
                 
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":username", $username);
        $stmt->execute();
        $userInfo = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Second query - get ALL destination types and user preferences
        $destQuery = "SELECT 
                        d.type_id,
                        d.type,
                        CASE WHEN ud.username IS NOT NULL THEN 1 ELSE 0 END as is_preferred
                      FROM destinationTypes d
                      LEFT JOIN userDestination ud ON d.type_id = ud.prefferedDestination 
                        AND ud.username = :username
                      ORDER BY d.type";
                      
        $destStmt = $this->conn->prepare($destQuery);
        $destStmt->bindParam(":username", $username);
        $destStmt->execute();
        $destinations = $destStmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Combine the results
        $userInfo['destinations'] = $destinations;
        
        return $userInfo;
    }

    public function getAllPersons1() {
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
        error_log("Starting updateProfile method");
        
        // Validate input
        if (empty($this->username) || empty($this->first_name) || empty($this->last_name) || 
            empty($this->email) || empty($this->contact_number)) {
            error_log("Validation failed - missing required fields");
            return ['success' => false, 'message' => 'All fields are required'];
        }
    
        try {
            $this->conn->beginTransaction();
            error_log("Transaction started");
    
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
    
            error_log("Executing main update query");
            
            if ($stmt->execute()) {
                error_log("Main update successful");
    
                // Update email in login table
                $login_query = 'UPDATE ' . $this->login_table . ' 
                               SET email = :email 
                               WHERE username = :username';
                $login_stmt = $this->conn->prepare($login_query);
                $login_stmt->bindParam(':email', $this->email);
                $login_stmt->bindParam(':username', $this->username);
                $login_stmt->execute();
                error_log("Login table update successful");
    
                // Handle destination changes
                if (isset($this->destination_changes)) {
                    error_log("Processing destination changes: " . print_r($this->destination_changes, true));
    
                    // Add new destinations
                    if (!empty($this->destination_changes['add'])) {
                        $insert_query = 'INSERT INTO userDestination (username, preferredDestination) 
                                       VALUES (:username, :dest_id)';
                        $insert_stmt = $this->conn->prepare($insert_query);
    
                        foreach ($this->destination_changes['add'] as $dest_id) {
                            error_log("Adding destination ID: " . $dest_id);
                            $insert_stmt->bindParam(':username', $this->username);
                            $insert_stmt->bindParam(':dest_id', $dest_id);
                            $insert_stmt->execute();
                        }
                    }
    
                    // Remove unselected destinations
                    if (!empty($this->destination_changes['remove'])) {
                        $delete_query = 'DELETE FROM userDestination 
                                       WHERE username = :username 
                                       AND prefferedDestination = :dest_id';
                        $delete_stmt = $this->conn->prepare($delete_query);
    
                        foreach ($this->destination_changes['remove'] as $dest_id) {
                            error_log("Removing destination ID: " . $dest_id);
                            $delete_stmt->bindParam(':username', $this->username);
                            $delete_stmt->bindParam(':dest_id', $dest_id);
                            $delete_stmt->execute();
                        }
                    }
                }
    
                $this->conn->commit();
                error_log("Transaction committed");
    
                // Fetch updated destinations for response
                $dest_query = 'SELECT d.type_id, d.type 
                              FROM userDestination ud
                              JOIN destinationTypes d ON ud.prefferedDestination = d.type_id
                              WHERE ud.username = :username';
                $dest_stmt = $this->conn->prepare($dest_query);
                $dest_stmt->bindParam(':username', $this->username);
                $dest_stmt->execute();
                $destinations = $dest_stmt->fetchAll(PDO::FETCH_ASSOC);
                error_log("Fetched updated destinations: " . print_r($destinations, true));
    
                return [
                    'success' => true,
                    'message' => 'Profile updated successfully',
                    'data' => [
                        'firstName' => $this->first_name,
                        'lastName' => $this->last_name,
                        'email' => $this->email,
                        'contactNo' => $this->contact_number,
                        'destinations' => $destinations
                    ]
                ];
            }
    
            error_log("Main update query failed");
            $this->conn->rollBack();
            return ['success' => false, 'message' => 'Failed to update profile'];
        } catch (Exception $e) {
            error_log("Error in updateProfile: " . $e->getMessage());
            $this->conn->rollBack();
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }
    
    // Add this property to your class
    public $destination_changes;
    
    // Add this setter method to your class
    public function setDestinationChanges($changes) {
        $this->destination_changes = $changes;
    }

       // Get all persons
       public function getAllPersons() {
        $query = 'SELECT username, firstName AS first_name, lastName AS last_name, email, contactNo AS contact_number 
                  FROM ' . $this->person_table;
        $stmt = $this->conn->prepare($query);

        if ($stmt->execute()) {
            return $stmt->fetchAll(PDO::FETCH_ASSOC); // Fetch all records as an associative array
        }

        return null; // Return null if the query fails
    }

    // Create User Method
    public function createUser() {
        try {
            $query = "INSERT INTO " . $this->person_table . " 
                      (username, firstName, lastName, email, contactNo) 
                      VALUES (:username, :first_name, :last_name, :email, :contact_number)";
            
            // Prepare the statement
            $stmt = $this->conn->prepare($query);
    
            // Bind data
            $stmt->bindParam(':username', $this->username);
            $stmt->bindParam(':first_name', $this->first_name);
            $stmt->bindParam(':last_name', $this->last_name);
            $stmt->bindParam(':email', $this->email);
            $stmt->bindParam(':contact_number', $this->contact_number);
    
            // Execute the query
            if ($stmt->execute()) {
                return ['success' => true, 'message' => 'User created successfully'];
            }
    
            return ['success' => false, 'message' => 'Failed to create user'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
?>