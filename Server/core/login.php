<?php
class Login {
    private $conn;
    private $login_table = 'login';
    public $username;
    public $email;
    public $password;
    public $userType;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function loginUser() {
        session_start();
        
        if (!empty($this->username)) {
            $query = 'SELECT login.* FROM ' . $this->login_table . ' WHERE login.username = :username OR login.email = :email LIMIT 1';
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':username', $this->username);
        } elseif (!empty($this->email)) {
            $query = 'SELECT login.* FROM ' . $this->login_table . ' WHERE login.email = :email LIMIT 1';
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':email', $this->email);
        } else {
            return array(
                'success' => false,
                'message' => 'Username or email is required.'
            );
        }

        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (password_verify($this->password, $user['password'])) {
                // Store basic user info in session
                $_SESSION['username'] = $user['username'];
                $_SESSION['email'] = $user['email'];
                $_SESSION['userType'] = trim($user['userType']);
                
                $response = array(
                    'success' => true,
                    'message' => 'Login successful.',
                    'userType' => $user['userType']
                );
                
                // Only get userId for Traveller users
                if (trim($user['userType']) === 'Traveller') {
                    // Get the userId from registereduser table
                    $userQuery = 'SELECT userId FROM registereduser WHERE username = :username LIMIT 1';
                    $userStmt = $this->conn->prepare($userQuery);
                    $userStmt->bindParam(':username', $user['username']);
                    $userStmt->execute();
                    
                    if ($userStmt->rowCount() > 0) {
                        $userData = $userStmt->fetch(PDO::FETCH_ASSOC);
                        $_SESSION['userId'] = $userData['userId'];
                        $response['userId'] = $userData['userId'];
                    }
                }
                
                return $response;
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