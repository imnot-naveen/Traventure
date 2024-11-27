<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once('../core/initialize.php');

class BlogPostUpdateAPI {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function updateBlogPost($data) {
        // Validate required fields
        if (empty($data['id']) || empty($data['title']) || empty($data['content']) || 
            empty($data['city']) || empty($data['intro'])) {
            return ['success' => false, 'message' => 'Invalid input: All fields are required.'];
        }

        try {
            // Start transaction
            $this->conn->beginTransaction();

            // Prepare update query
            $query = 'UPDATE blogposts 
                      SET title = :title, 
                          content = :content, 
                          city = :city, 
                          intro = :intro, 
                          updatedAt = NOW()';

            // Add image update only if a new image is provided
            if (!empty($_FILES['image'])) {
                // Handle file upload
                $uploadDir = '../../uploads/';
                $uploadFile = $uploadDir . basename($_FILES['image']['name']);
                
                if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadFile)) {
                    $query .= ', imageURL = :imageURL';
                } else {
                    return ['success' => false, 'message' => 'Failed to upload image.'];
                }
            }

            $query .= ' WHERE blog_id = :id';

            // Prepare and execute statement
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $data['id']);
            $stmt->bindParam(':title', $data['title']);
            $stmt->bindParam(':content', $data['content']);
            $stmt->bindParam(':city', $data['city']);
            $stmt->bindParam(':intro', $data['intro']);

            // Bind image URL if a new image was uploaded
            if (!empty($_FILES['image'])) {
                $imageURL = 'uploads/' . basename($_FILES['image']['name']);
                $stmt->bindParam(':imageURL', $imageURL);
            }

            if (!$stmt->execute()) {
                throw new Exception('Failed to update blog post details.');
            }

            // Commit transaction
            $this->conn->commit();
            return ['success' => true, 'message' => 'Blog post updated successfully.'];

        } catch (Exception $e) {
            // Rollback transaction on error
            $this->conn->rollBack();
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}

// Process the update request
$blogPostUpdateAPI = new BlogPostUpdateAPI($db);
$response = $blogPostUpdateAPI->updateBlogPost($_POST);
echo json_encode($response);
?>