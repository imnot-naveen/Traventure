<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Include database and other necessary files
include_once('../core/initialize.php');

class BlogPostAPI {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Fetch blog post details by post ID
    public function getBlogPostDetails($postID) {
        // Prepare the SQL query using a placeholder for the post ID
        $query = "
            SELECT 
                p.postID, 
                p.title, 
                p.content, 
                p.city, 
                p.intro, 
                p.imageURL, 
                p.createdAt, 
                p.updatedAt
            FROM 
                blogpost p  
            WHERE 
                p.postID = :postID
        ";
    
        // Prepare the statement
        $stmt = $this->conn->prepare($query);
        // Bind the parameter
        $stmt->bindParam(':postID', $postID, PDO::PARAM_INT);
        
        try {
            // Execute the statement
            $stmt->execute();
    
            if ($stmt->rowCount() > 0) {
                // Fetch the blog post data
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                return [
                    'postID' => $row['postID'],
                    'title' => $row['title'],
                    'content' => $row['content'],
                    'city' => $row['city'],
                    'intro' => $row['intro'],
                    'imageURL' => $row['imageURL'],
                    'createdAt' => $row['createdAt'],
                    'updatedAt' => $row['updatedAt']
                ];
            } else {
                // No post found
                return null;
            }
        } catch (PDOException $e) {
            return ['error' => 'Database error: ' . $e->getMessage()];
        }
    }
}

// Check if post ID is provided
if (!isset($_GET['postID'])) {
    echo json_encode(['success' => false, 'message' => 'Post ID is required']);
    exit();
}

$blogPostAPI = new BlogPostAPI($db);
$blogPostDetails = $blogPostAPI->getBlogPostDetails($_GET['postID']);

// Check if blog post details were returned or not
if ($blogPostDetails === null) {
    echo json_encode(['success' => false, 'message' => 'No blog post found with the provided post ID']);
} else {
    echo json_encode(['success' => true, 'data' => $blogPostDetails]);
}
?>
