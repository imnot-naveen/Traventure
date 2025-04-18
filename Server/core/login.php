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
            $query = 'SELECT login.*, registereduser.userId 
                      FROM ' . $this->login_table . ' 
                      JOIN registereduser ON login.username = registereduser.username 
                      WHERE login.username = :username LIMIT 1';
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':username', $this->username);
        } elseif (!empty($this->email)) {
            $query = 'SELECT login.*, registereduser.userId 
                      FROM ' . $this->login_table . ' 
                      JOIN registereduser ON login.username = registereduser.username 
                      WHERE login.email = :email LIMIT 1';
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
                $_SESSION['userId'] = $user['userId'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['email'] = $user['email'];
                $_SESSION['userType'] = trim($user['userType']);
    
                $response = array(
                    'success' => true,
                    'message' => 'Login successful.',
                    'userType' => $user['userType']
                );
    
                if (trim($user['userType']) === 'Traveller') {
                    $response['userId'] = $user['userId'];
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