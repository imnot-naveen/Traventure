<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once('../core/initialize.php');

session_start();

class GetAllBlogsAPI {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function fetchAll($limit, $offset) {
        try {
            // Default query for regular users
            $query = "
                SELECT
                    id, title, intro, content, imageURL AS image, createdAt, updatedAt
                FROM blogs
                WHERE status='accepted'
                ORDER BY createdAt DESC
                LIMIT :limit OFFSET :offset
            ";
            
            // Query for content writers (showing all blogs)
            $cwquery = "
                SELECT
                    id, title, intro, content, imageURL AS image, createdAt, updatedAt
                FROM blogs
                ORDER BY createdAt DESC
                LIMIT :limit OFFSET :offset
            ";
            
            // Check if session exists and user is CW
            if (isset($_SESSION['userType']) && $_SESSION['userType'] == "CW") {
                $stmt = $this->conn->prepare($cwquery);
            } else {
                $stmt = $this->conn->prepare($query);
            }
            
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            
            // Fetch all rows as associative array
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Return error message if query fails
            return array('error' => 'Database query failed: ' . $e->getMessage());
        }
    }
}

// Get pagination parameters
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

// Initialize API and fetch blogs
$api = new GetAllBlogsAPI($db);
$blogs = $api->fetchAll($limit, $offset);

// Check if any blogs were found, if not, return an empty array
if (empty($blogs)) {
    $blogs = [];
}

echo json_encode($blogs);
?>