<?php
// Include database and other necessary files
include_once('../core/initialize.php');
header('Content-Type: application/json');

// Retrieve and decode incoming JSON data
$data = json_decode(file_get_contents("php://input"));

// Validate required fields
if (empty($data->postID)) {
    echo json_encode(['success' => false, 'message' => 'Invalid input: postID is required.']);
    exit();
}

try {
    // Start transaction
    $db->beginTransaction();

    // Delete from `blogposts` table
    $query = 'DELETE FROM blogposts WHERE id = :postID';
    $stmt = $db->prepare($query);
    $stmt->bindParam(':postID', $data->postID);

    if (!$stmt->execute()) {
        throw new Exception('Failed to delete blog post.');
    }

    // Commit transaction
    $db->commit();
    echo json_encode(['success' => true, 'message' => 'Blog post deleted successfully.']);
} catch (Exception $e) {
    // Rollback transaction on error
    $db->rollBack();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
