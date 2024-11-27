<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once('../core/initialize.php');

class BlogPostDeleteAPI {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function deleteBlogPost($postID) {
        // Validate post ID
        if (empty($postID)) {
            return ['success' => false, 'message' => 'Invalid input: postID is required.'];
        }

        try {
            // Start transaction
            $this->conn->beginTransaction();

            // Delete associated image file (if exists)
            $queryGetImage = 'SELECT imageURL FROM blogposts WHERE blog_id = :postID';
            $stmtGetImage = $this->conn->prepare($queryGetImage);
            $stmtGetImage->bindParam(':postID', $postID);
            $stmtGetImage->execute();
            $imageResult = $stmtGetImage->fetch(PDO::FETCH_ASSOC);

            // Delete from blogposts table
            $queryDelete = 'DELETE FROM blogposts WHERE blog_id = :postID';
            $stmtDelete = $this->conn->prepare($queryDelete);
            $stmtDelete->bindParam(':postID', $postID);

            if (!$stmtDelete->execute()) {
                throw new Exception('Failed to delete blog post.');
            }

            // If an image exists, attempt to delete the physical file
            if ($imageResult && !empty($imageResult['imageURL'])) {
                $imagePath = '../../Public/' . $imageResult['imageURL'];
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }

            // Commit transaction
            $this->conn->commit();
            return ['success' => true, 'message' => 'Blog post deleted successfully.'];

        } catch (Exception $e) {
            // Rollback transaction on error
            $this->conn->rollBack();
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}

// Handle DELETE request
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Parse incoming JSON data
    $data = json_decode(file_get_contents("php://input"));

    // Validate input
    if (!isset($data->postID)) {
        echo json_encode(['success' => false, 'message' => 'Invalid input: postID is required.']);
        exit();
    }

    // Process deletion
    $blogPostDeleteAPI = new BlogPostDeleteAPI($db);
    $response = $blogPostDeleteAPI->deleteBlogPost($data->postID);
    echo json_encode($response);
}
?>