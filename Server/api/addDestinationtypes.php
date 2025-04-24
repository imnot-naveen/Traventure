<?php
// Include database and other necessary files
include_once('../core/initialize.php');
header('Content-Type: application/json');
// Validate required fields
if (empty($_POST['name']) || empty($_FILES['photo']['name'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input: All fields are required.']);
    exit();
}

try {
    // Start transaction
    $db->beginTransaction();

    $name = $_POST['name'];
    $photo= $_FILES['photo'];

    $uploadDir = '../../Public/uploads/';
    $fileName = basename($photo['name']);
    $targetFilePath = $uploadDir . $fileName;

    if (!move_uploaded_file($photo['tmp_name'], $targetFilePath)) {
        throw new Exception('Failed to upload photo.');
    }

    // Insert into destinationTypes table
    $query = 'INSERT INTO destinationtypes (type, photo) 
              VALUES (:name, :photo)';
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':photo', $fileName);

    if (!$stmt->execute()) {
        throw new Exception('Failed to insert destination type.');
    }

    // Commit transaction
    $db->commit();

    // Return success response with booking reference
    echo json_encode([
        'success' => true, 
    ]);
    
} catch (Exception $e) {
    // Rollback transaction on error
    $db->rollBack();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>