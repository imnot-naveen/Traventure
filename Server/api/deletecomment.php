<?php
session_start(); // Start session to access logged-in username

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

    public function deleteComment($id, $currentUser) {
        if (empty($id)) {
            return ['success' => false, 'message' => 'Comment ID is required.'];
        }

        try {
            $this->conn->beginTransaction();

            // Get comment and check author
            $stmtCheck = $this->conn->prepare("SELECT author FROM comments WHERE id = :id");
            $stmtCheck->bindParam(':id', $id);
            $stmtCheck->execute();
            $comment = $stmtCheck->fetch(PDO::FETCH_ASSOC);

            if (!$comment) {
                $this->conn->rollBack();
                return ['success' => false, 'message' => 'Comment not found.'];
            }

            if ($comment['author'] !== $currentUser) {
                $this->conn->rollBack();
                return ['success' => false, 'message' => 'Unauthorized: You can only delete your own comment.'];
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
    // Ensure user is logged in
    if (!isset($_SESSION['username'])) {
        echo json_encode(['success' => false, 'message' => 'Unauthorized: User not logged in.']);
        exit();
    }

    $data = json_decode(file_get_contents("php://input"));
    if (!isset($data->id)) {
        echo json_encode(['success' => false, 'message' => 'Comment ID is missing.']);
        exit();
    }

    $currentUser = $_SESSION['username'];
    $api = new DeleteCommentAPI($db);
    echo json_encode($api->deleteComment($data->id, $currentUser));
}
?>