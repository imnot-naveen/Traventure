<?php
class Login {
    private $conn;
    private $login_table = 'login';

    public $username;
    public $email;
    public $password;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function loginUser() {
        session_start();
    
        // Check if either username or email is provided
        if (!empty($this->username)) {
            $query = 'SELECT * FROM ' . $this->login_table . ' WHERE username = :username LIMIT 1';
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':username', $this->username);
        } elseif (!empty($this->email)) {
            $query = 'SELECT * FROM ' . $this->login_table . ' WHERE email = :email LIMIT 1';
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':email', $this->email);
        } else {
            return array(
                'success' => false,
                'message' => 'Username or email is required.'
            );
        }
    
        // Execute the query
        $stmt->execute();
    
        // If a user is found
        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
            // Verify the entered password against the stored hashed password
            if (password_verify($this->password, $user['password'])) {
                // Store only required data in session
                $_SESSION['username'] = $user['username'];
                $_SESSION['email'] = $user['email'];
                $_SESSION['userType'] = $user['userType'];
    
                return array(
                    'success' => true,
                    'message' => 'Login successful.'
                );
            } else {
                return array(
                    'success' => false,
                    'message' => 'Invalid password.'
                );
            }
        } else {
            return array(
                'success' => false,
                'message' => 'User not found.'
            );
        }
    }
    
}
?>