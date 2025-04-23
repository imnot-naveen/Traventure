<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once('../core/initialize.php');

class BlogPostAPI {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getBlogPostById($blogId) {
        // Validate blog ID
        if (empty($blogId)) {
            return ['success' => false, 'message' => 'Invalid blog post ID.'];
        }

        try {
            $query = "
                SELECT 
                    blog_id AS id, 
                    title, 
                    city, 
                    intro, 
                    content, 
                    imageURL AS image, 
                    createdAt,
                    updatedAt
                FROM 
                    blogposts 
                WHERE 
                    blog_id = :blog_id
            ";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':blog_id', $blogId, PDO::PARAM_INT);
            $stmt->execute();

            $blogPost = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($blogPost) {
                return [
                    'success' => true, 
                    'post' => $blogPost
                ];
            } else {
                return [
                    'success' => false, 
                    'message' => 'Blog post not found.'
                ];
            }
        } catch (Exception $e) {
            return [
                'success' => false, 
                'message' => $e->getMessage()
            ];
        }
    }
}

// Get blog post ID from query parameters
$blogId = isset($_GET['blog_id']) ? intval($_GET['blog_id']) : null;

// Create API instance and fetch blog post
$blogPostAPI = new BlogPostAPI($db);
$response = $blogPostAPI->getBlogPostById($blogId);

// Send JSON response
echo json_encode($response);
?>