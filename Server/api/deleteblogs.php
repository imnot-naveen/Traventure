<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once('../core/initialize.php');

class DeleteBlogAPI {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function deleteBlog($id) {
        if (empty($id)) {
            return ['success' => false, 'message' => 'Blog ID is required.'];
        }

        try {
            $this->conn->beginTransaction();

            // Get image path before deletion
            $stmtGet = $this->conn->prepare("SELECT imageURL FROM blogs WHERE id = :id");
            $stmtGet->bindParam(':id', $id);
            $stmtGet->execute();
            $image = $stmtGet->fetch(PDO::FETCH_ASSOC);

            // Delete blog
            $stmtDelete = $this->conn->prepare("DELETE FROM blogs WHERE id = :id");
            $stmtDelete->bindParam(':id', $id);
            $stmtDelete->execute();

            // Delete image file if exists
            if ($image && !empty($image['imageURL'])) {
                $imagePath = '../../Public/' . $image['imageURL'];
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }

            $this->conn->commit();
            return ['success' => true, 'message' => 'Blog deleted successfully.'];
        } catch (Exception $e) {
            $this->conn->rollBack();
            return ['success' => false, 'message' => 'Deletion failed: ' . $e->getMessage()];
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"));
    if (!isset($data->id)) {
        echo json_encode(['success' => false, 'message' => 'Blog ID is missing.']);
        exit();
    }

    $api = new DeleteBlogAPI($db);
    echo json_encode($api->deleteBlog($data->id));
}
?>
