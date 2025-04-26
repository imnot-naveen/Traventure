<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once('../core/initialize.php');

class BlogAPI {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getBlogById($id) {
        if (empty($id)) {
            return ['success' => false, 'message' => 'Invalid blog ID.'];
        }
    
        try {
            // Fetch blog
            $query = "SELECT id, title, intro, content, imageURL AS image, author, createdAt, updatedAt FROM blogs WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $blog = $stmt->fetch(PDO::FETCH_ASSOC);
    
            if ($blog) {
                $blog['author'] = ucwords(strtolower($blog['author']));  // Ensure the name is properly capitalized

                // Fetch comments
                $commentQuery = "SELECT id, comment, createdAt FROM comments WHERE blogId = :id ORDER BY createdAt DESC";
                $commentStmt = $this->conn->prepare($commentQuery);
                $commentStmt->bindParam(':id', $id, PDO::PARAM_INT);
                $commentStmt->execute();
                $comments = $commentStmt->fetchAll(PDO::FETCH_ASSOC);
    
                $blog['comments'] = $comments;
    
                return ['success' => true, 'post' => $blog];
            } else {
                return ['success' => false, 'message' => 'Blog not found.'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
    
}

$id = isset($_GET['id']) ? intval($_GET['id']) : null;

$blogAPI = new BlogAPI($db);
$response = $blogAPI->getBlogById($id);

echo json_encode($response);
?>