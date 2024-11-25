<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once('../core/initialize.php');

class BlogPostAPI {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Fetch all blog posts with pagination
    public function getAllBlogPosts($limit, $offset) {
        $query = "
            SELECT 
                id, title, city, intro, content, imageURL, created_at
            FROM 
                blogposts
            LIMIT :limit OFFSET :offset
        ";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $blogPosts = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Get total number of blog posts
        $totalQuery = "SELECT COUNT(*) as total FROM blogposts";
        $totalStmt = $this->conn->prepare($totalQuery);
        $totalStmt->execute();
        $totalBlogPosts = $totalStmt->fetch(PDO::FETCH_ASSOC)['total'];

        return [
            'blogPosts' => $blogPosts,
            'totalBlogPosts' => $totalBlogPosts
        ];
    }
}

// Check if limit and offset are provided
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

$blogPostAPI = new BlogPostAPI($db);
$data = $blogPostAPI->getAllBlogPosts($limit, $offset);

echo json_encode($data);
?>
