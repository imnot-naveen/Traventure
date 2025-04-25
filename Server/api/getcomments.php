<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once('../core/initialize.php');

class GetCommentsAPI {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function fetchByBlogID($blogId) {
        try {
            if (empty($blogId)) {
                return ['error' => 'Blog ID is required.'];
            }

            $query = "
                SELECT 
                    id, comment, author, createdAt
                FROM comments
                WHERE blogId = :blogId
                ORDER BY createdAt DESC
            ";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':blogId', $blogId, PDO::PARAM_INT);
            $stmt->execute();

            $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($comments as &$comment) {
                if (isset($comment['author'])) {
                    $comment['author'] = ucfirst(strtolower($comment['author']));
                }
            }

            return $comments;
        } catch (PDOException $e) {
            return ['error' => 'Database query failed: ' . $e->getMessage()];
        }
    }
}

$blogId = isset($_GET['blogId']) ? intval($_GET['blogId']) : 0;

$api = new GetCommentsAPI($db);
$comments = $api->fetchByBlogID($blogId);

// Ensure JSON has 'success' and 'comments'
if (isset($comments['error'])) {
    echo json_encode([
        'success' => false,
        'message' => $comments['error'],
        'comments' => []
    ]);
} else {
    echo json_encode([
        'success' => true,
        'comments' => $comments
    ]);
}
