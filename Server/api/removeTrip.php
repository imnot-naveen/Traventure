<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Include core initialization and database connection
include_once('../core/initialize.php');

// Get raw posted data
$data = json_decode(file_get_contents("php://input"));

// Check if tripID is provided
if (!isset($data->tripID) || empty($data->tripID)) {
    http_response_code(400); // Bad request
    echo json_encode([
        'success' => false,
        'message' => 'Trip ID is required'
    ]);
    exit();
}

try {
    $query = 'UPDATE Trip SET status = "removed" WHERE tripID = :tripID';
    $stmt = $db->prepare($query);
    
    
    $stmt->bindParam(':tripID', $tripID);
    

    $tripID = $data->tripID;
    
    
    if ($stmt->execute()) {
       
        echo json_encode([
            'success' => true,
            'message' => 'Trip removed successfully'
        ]);
    } else {
        throw new Exception('Failed to update trip status');
    }
} catch (Exception $e) {
    
    http_response_code(500); 
    echo json_encode([
        'success' => false,
        'message' => 'Error updating trip status',
        'error' => $e->getMessage()
    ]);
}
?>