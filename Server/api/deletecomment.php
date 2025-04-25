<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once('../core/initialize.php');

class DeleteCommentAPI {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function deleteComment($id) {
        if (empty($id)) {
            return ['success' => false, 'message' => 'Comment ID is required.'];
        }

        try {
            $this->conn->beginTransaction();

            // Check if the comment exists before attempting to delete
            $stmtCheck = $this->conn->prepare("SELECT id FROM comments WHERE id = :id");
            $stmtCheck->bindParam(':id', $id);
            $stmtCheck->execute();

            if ($stmtCheck->rowCount() === 0) {
                $this->conn->rollBack();
                return ['success' => false, 'message' => 'Comment not found.'];
            }

            // Proceed with deletion
            $stmtDelete = $this->conn->prepare("DELETE FROM comments WHERE id = :id");
            $stmtDelete->bindParam(':id', $id);
            $stmtDelete->execute();

            if ($stmtDelete->rowCount() === 0) {
                $this->conn->rollBack();
                return ['success' => false, 'message' => 'Failed to delete the comment.'];
            }

            $this->conn->commit();
            return ['success' => true, 'message' => 'Comment deleted successfully.'];
        } catch (Exception $e) {
            $this->conn->rollBack();
            return ['success' => false, 'message' => 'Deletion failed: ' . $e->getMessage()];
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Get the raw input and decode JSON data
    $data = json_decode(file_get_contents("php://input"));

    // Ensure 'id' is provided in the request body
    if (!isset($data->id)) {
        echo json_encode(['success' => false, 'message' => 'Comment ID is missing.']);
        exit();
    }

    $api = new DeleteCommentAPI($db);
    // Perform the delete operation and return the result
    echo json_encode($api->deleteComment($data->id));
}
?>
