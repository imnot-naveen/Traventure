<?php
header('Content-Type: application/json');
include_once('../core/initialize.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = intval($_POST['id'] ?? 0);
    $name = $_POST['name'] ?? '';
    $nearestStation = intval($_POST['nearestStation'] ?? 0);
    $description = $_POST['description'] ?? '';
    $deletePhotos = json_decode($_POST['deletePhotos'] ?? '[]', true);
    $types = $_POST['types'] ?? [];
    
    if (empty($id) || empty($name) || empty($nearestStation) || empty($types)) {
        echo json_encode(["success" => false, "error" => "Invalid input data"]);
        exit;
    }
    
    try {
        $db->beginTransaction();
        
        // Update destination details (removed type field)
        $stmt = $db->prepare(
            "UPDATE destination SET name = ?, description = ?, nearestStation = ? WHERE destination_id = ?"
        );
        $stmt->execute([$name, $description, $nearestStation, $id]);
        
        // Handle destination types
        // First, delete all existing types for this destination
        $deleteTypesStmt = $db->prepare("DELETE FROM desttypes WHERE destination = ?");
        $deleteTypesStmt->execute([$id]);
        
        // Then insert all selected types
        $insertTypeStmt = $db->prepare("INSERT INTO desttypes (destination, type) VALUES (?, ?)");
        foreach ($types as $type) {
            $insertTypeStmt->execute([$id, $type]);
        }

        // Delete marked photos
        if (!empty($deletePhotos)) {
            $placeholders = rtrim(str_repeat('?,', count($deletePhotos)), ',');
            $query = "DELETE FROM destinationphotos WHERE destination = ? AND photoName IN ($placeholders)";
            $stmt = $db->prepare($query);
            $stmt->execute(array_merge([$id], $deletePhotos));
        }

        // Add new photos
        if (!empty($_FILES['newPhotos']['tmp_name'][0])) {
            $photoStmt = $db->prepare(
                "INSERT INTO destinationphotos (destination, photoName) VALUES (?, ?)"
            );
            
            foreach ($_FILES['newPhotos']['tmp_name'] as $key => $tmpName) {
                $fileName = basename($_FILES['newPhotos']['name'][$key]);
                $targetFilePath = "../../Public/uploads/" . $fileName;
                
                if (move_uploaded_file($tmpName, $targetFilePath)) {
                    $photoStmt->execute([$id, $fileName]);
                } else {
                    throw new Exception("Failed to upload photo: $fileName");
                }
            }
        }

        $db->commit();
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Invalid request method"]);
}