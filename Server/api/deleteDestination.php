<?php
header('Content-Type: application/json');
include_once('../core/initialize.php');

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $destinationId = intval($_GET['id'] ?? 0);

    if (empty($destinationId)) {
        echo json_encode(["success" => false, "error" => "Invalid destination ID"]);
        exit;
    }

    try {
        $db->beginTransaction();

        // First, delete associated photos
        $photoStmt = $db->prepare("DELETE FROM destinationphotos WHERE destination = ?");
        $photoStmt->execute([$destinationId]);

        //next, delete the types 
        $typeStmt = $db->prepare("DELETE FROM desttypes WHERE destination = ?");
        $typeStmt->execute([$destinationId]); 

        // Then, delete the destination itself
        $destinationStmt = $db->prepare("DELETE FROM destination WHERE destination_id = ?");
        $destinationStmt->execute([$destinationId]);

        $db->commit();
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        echo json_encode([
            "success" => false, 
            "error" => "Failed to delete destination: " . $e->getMessage()
        ]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Invalid request method"]);
}