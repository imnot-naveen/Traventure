<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once('../core/initialize.php');

class CommentUpdateAPI {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function updateComment($data) {
        // Ensure that both id and comment are provided
        if (empty($data['id']) || empty($data['comment'])) {
            return ['success' => false, 'message' => 'ID and comment are required.'];
        }

        try {
            // Start a transaction
            $this->conn->beginTransaction();

            // SQL query to update only the comment field
            $query = "UPDATE comments 
                      SET comment = :comment, 
                          updatedAt = NOW() 
                      WHERE id = :id";

            // Prepare and bind parameters
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $data['id']);
            $stmt->bindParam(':comment', $data['comment']);

            // Execute the query
            if (!$stmt->execute()) {
                throw new Exception('Database execution failed.');
            }

            // Commit the transaction
            $this->conn->commit();

            // Return success message
            return ['success' => true, 'message' => 'Comment updated successfully.'];

        } catch (Exception $e) {
            // Rollback if there's an error
            $this->conn->rollBack();
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}

// Instantiate and handle the update request
$commentAPI = new CommentUpdateAPI($db);

// Read POST data
$data = [
    'id' => isset($_POST['id']) ? $_POST['id'] : null,
    'comment' => isset($_POST['comment']) ? $_POST['comment'] : null
];

// Call the update method
$response = $commentAPI->updateComment($data);

// Output the response as JSON
echo json_encode($response);
?>
