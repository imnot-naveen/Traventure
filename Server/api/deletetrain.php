<?php
// Include database and other necessary files
include_once('../core/initialize.php');
header('Content-Type: application/json');

// Retrieve and decode incoming JSON data
$data = json_decode(file_get_contents("php://input"));

// Validate required fields
if (empty($data->trainID)) {
    echo json_encode(['success' => false, 'message' => 'Invalid input: trainID is required.']);
    exit();
}

try {
    // Start transaction
    $db->beginTransaction();

    // Delete from `train` table
    $query = 'DELETE FROM train WHERE trainID = :trainID';
    $stmt = $db->prepare($query);
    $stmt->bindParam(':trainID', $data->trainID);

    if (!$stmt->execute()) {
        throw new Exception('Failed to delete train details from the train table.');
    }

    // Commit transaction
    $db->commit();
    echo json_encode(['success' => true, 'message' => 'Train deleted successfully.']);
} catch (Exception $e) {
    // Rollback transaction on error
    $db->rollBack();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>