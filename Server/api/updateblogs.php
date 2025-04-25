<?php
ob_start(); // Prevent accidental HTML output

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

ini_set('display_errors', 1);
error_reporting(E_ALL);

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

            $query = "UPDATE blogs 
                      SET title = :title, 
                          intro = :intro, 
                          content = :content, 
                          updatedAt = NOW()";

            $hasImage = isset($_FILES['image']) && is_uploaded_file($_FILES['image']['tmp_name']);

            if ($hasImage) {
                $uploadDir = '../../public/uploads/';
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }

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

            if ($hasImage) {
                $imageURL = '../../public/uploads' . $imageName;
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

// Process the request
$blogAPI = new BlogUpdateAPI($db);
$response = $blogAPI->updateBlog($_POST);

// Clear any buffered output before echo
ob_clean();
echo json_encode($response);
exit;
