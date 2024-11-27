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

    public function getAllBlogPosts($limit, $offset) {
        $query = "
            SELECT 
                blog_id AS id, title, city, intro, content, imageURL AS image, createdAt
            FROM 
                blogposts
            LIMIT :limit OFFSET :offset
        ";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $blogPosts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $blogPosts;
    }
}

$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

$blogPostAPI = new BlogPostAPI($db);
$data = $blogPostAPI->getAllBlogPosts($limit, $offset);

echo json_encode($data);
?>
