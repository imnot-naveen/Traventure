<?php
// Include database and other necessary files
include_once('../core/initialize.php');
header('Content-Type: application/json');

// Retrieve and decode incoming JSON data
$data = json_decode(file_get_contents("php://input"));

// Validate required fields
if (!$data->name || !$data->phone_number || !$data->email || !$data->message) {
    echo json_encode(['success' => false, 'message' => 'Invalid input: All fields are required.']);
    exit();
}

try {
    // Start transaction
    $db->beginTransaction();

    $name = $data->name;
    $phone= $data->phone_number;
    $email = $data->email;
    $message = $data->message;
    
    // Insert into trip table
    $query = 'INSERT INTO contact (name, phone, email, message) 
              VALUES (:name, :phone, :email, :message)';
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':phone', $phone);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':message', $message);

    if (!$stmt->execute()) {
        throw new Exception('Failed to insert contact form.');
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