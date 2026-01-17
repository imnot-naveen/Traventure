<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

include_once('../core/initialize.php');

// Read incoming data
$data = json_decode(file_get_contents("php://input"), true);

// Debugging: Log the incoming data
error_log("Received data: " . json_encode($data));

if (!isset($data['id']) || !isset($data['status'])) {
    echo json_encode(["success" => false, "message" => "Missing required parameters"]);
    exit();
}

$id = $data['id'];
$status = $data['status'];

// Validate status
if (!in_array($status, ['accepted', 'declined'])) {
    echo json_encode(["success" => false, "message" => "Invalid status value"]);
    exit();
}

try {

    if($status == 'accepted'){
        $query = "UPDATE blogs SET status = :status WHERE id = :id";
        $stmt = $db->prepare($query);
        
        // Debugging: Log query execution before executing it
        error_log("Executing query: " . $query . " with id: " . $id . " and status: " . $status);
        
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo json_encode(["success" => true, "message" => "Status updated successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "No record updated. The blog may already have the same status"]);
        }
    }
    else{
        $query = "DELETE FROM blogs WHERE id = :id";
        $stmt = $db->prepare($query);
        
        // Debugging: Log query execution before executing it
        error_log("Executing query: " . $query . " with id: " . $id . " and status: " . $status);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo json_encode(["success" => true, "message" => "Status updated successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "No record updated. The blog may already have the same status"]);
        }
    }
    
} catch (PDOException $e) {
    error_log("Database query failed: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Database query failed: " . $e->getMessage()]);
}
?>
