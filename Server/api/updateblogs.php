<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once('../core/initialize.php');

class BlogUpdateAPI {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function updateBlog($data) {
        if (empty($data['id']) || empty($data['title']) || empty($data['intro']) || empty($data['content'])) {
            return ['success' => false, 'message' => 'All fields are required (id, title, intro, content).'];
        }

        try {
            $this->conn->beginTransaction();

            // Base update query
            $query = "UPDATE blogs 
                      SET title = :title, 
                          intro = :intro, 
                          content = :content, 
                          updatedAt = NOW()";

            // Handle image upload if present
            if (!empty($_FILES['image']['tmp_name'])) {
                $uploadDir = '../../uploads/';
                $imageName = basename($_FILES['image']['name']);
                $uploadPath = $uploadDir . $imageName;

                if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadPath)) {
                    $query .= ", imageURL = :imageURL";
                } else {
                    return ['success' => false, 'message' => 'Image upload failed.'];
                }
            }

            $query .= " WHERE id = :id";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $data['id']);
            $stmt->bindParam(':title', $data['title']);
            $stmt->bindParam(':intro', $data['intro']);
            $stmt->bindParam(':content', $data['content']);

            if (!empty($_FILES['image']['tmp_name'])) {
                $imageURL = 'uploads/' . $imageName;
                $stmt->bindParam(':imageURL', $imageURL);
            }

            if (!$stmt->execute()) {
                throw new Exception('Database execution failed.');
            }

            $this->conn->commit();
            return ['success' => true, 'message' => 'Blog updated successfully.'];

        } catch (Exception $e) {
            $this->conn->rollBack();
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}

// Instantiate and handle the update request
$blogAPI = new BlogUpdateAPI($db);
$response = $blogAPI->updateBlog($_POST);
echo json_encode($response);
?>
