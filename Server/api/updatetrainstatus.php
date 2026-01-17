<?php
// Include database connection
include_once('../core/initialize.php');
header('Content-Type: application/json');

// Get JSON input
$data = json_decode(file_get_contents("php://input"));

// Validate input
if (empty($data->trainID) || empty($data->status)) {
    echo json_encode(['success' => false, 'message' => 'Invalid input: trainID and status are required.']);
    exit();
}

try {
    // Start transaction
    $db->beginTransaction();

    // Update train status
    $query = 'UPDATE train SET status = :status WHERE trainID = :trainID';
    $stmt = $db->prepare($query);
    $stmt->bindParam(':status', $data->status);
    $stmt->bindParam(':trainID', $data->trainID);

    if (!$stmt->execute()) {
        throw new Exception('Failed to update train status.');
    }

    // Commit transaction
    $db->commit();
    echo json_encode(['success' => true, 'message' => 'Train status updated successfully.']);
} catch (Exception $e) {
    // Rollback on error
    $db->rollBack();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
