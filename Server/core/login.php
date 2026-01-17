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
            $query = 'SELECT login.*, person.status FROM ' . $this->login_table . ' 
                      JOIN person ON login.username = person.username 
                      WHERE login.username = :username OR login.email = :email 
                      LIMIT 1';
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':username', $this->username);
            $stmt->bindParam(':email', $this->username);
        } elseif (!empty($this->email)) {
            $query = 'SELECT login.*, person.status FROM ' . $this->login_table . ' 
                      JOIN person ON login.username = person.username 
                      WHERE login.email = :email 
                      LIMIT 1';
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

            // Check if user status is Active
            if (trim($user['status']) !== 'Active') {
                return array(
                    'success' => false,
                    'message' => 'Account is inactive. Please contact support.'
                );
            }

            if (password_verify($this->password, $user['password'])) {
                // Get userId from registereduser table
                $idquery = 'SELECT userid FROM registereduser WHERE username = :username LIMIT 1';
                $idstmt = $this->conn->prepare($idquery);
                $idstmt->bindParam(':username', $user['username']);
                $idstmt->execute();

                $userID = null;
                if ($idstmt->rowCount() > 0) {
                    $userIDRow = $idstmt->fetch(PDO::FETCH_ASSOC);
                    $userID = $userIDRow['userid'];
                }

                // Store basic user info in session
                $_SESSION['username'] = $user['username'];
                $_SESSION['email'] = $user['email'];
                $_SESSION['userType'] = trim($user['userType']);
                $_SESSION['userID'] = $userID;

                $response = array(
                    'success' => true,
                    'message' => 'Login successful.',
                    'userType' => $user['userType'],
                    'userID' => $userID
                );

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
