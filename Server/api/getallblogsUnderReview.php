<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once('../core/initialize.php');

class GetAllBlogsAPI {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function fetchAll($limit, $offset) {
        try {
            $query = "
                SELECT 
                    id, title, intro, content, imageURL AS image, createdAt, updatedAt
                FROM blogs
                WHERE status='under review'
                ORDER BY createdAt DESC
                LIMIT :limit OFFSET :offset
            ";

            $stmt = $this->conn->prepare($query);
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

$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

$api = new GetAllBlogsAPI($db);
$blogs = $api->fetchAll($limit, $offset);

// Check if any blogs were found, if not, return an empty array
if (empty($blogs)) {
    $blogs = [];
}

echo json_encode($blogs);
?>
