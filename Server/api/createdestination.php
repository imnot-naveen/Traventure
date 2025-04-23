<?php
include_once('../core/initialize.php');
header('Content-Type: application/json');

try {
    // Handle uploaded photos
    $photoNames = [];
    if (!empty($_FILES['photos']['name'][0])) {
        foreach ($_FILES['photos']['name'] as $index => $photoName) {
            $targetPath = '../../public/uploads/' . basename($photoName);
            if (move_uploaded_file($_FILES['photos']['tmp_name'][$index], $targetPath)) {
                $photoNames[] = $photoName;
            }
        }
    }

    // Insert destination details
    $query = 'INSERT INTO Destination (name, description, nearestStation) VALUES (:name, :description, :nearestStation)';
    $stmt = $db->prepare($query);
    $stmt->bindParam(':name', $_POST['name']);
    $stmt->bindParam(':description', $_POST['description']);
    $stmt->bindParam(':nearestStation', $_POST['nearestStation']);
    
    if ($stmt->execute()) {
        $destinationId = $db->lastInsertId();

        // Insert photos
        foreach ($photoNames as $photoName) {
            $photoQuery = 'INSERT INTO DestinationPhotos (destination, photoName) VALUES (:destination, :photoName)';
            $photoStmt = $db->prepare($photoQuery);
            $photoStmt->bindParam(':destination', $destinationId);
            $photoStmt->bindParam(':photoName', $photoName);
            $photoStmt->execute();
        }

        // Handle multiple destination types
        if (isset($_POST['types']) && is_array($_POST['types'])) {
            foreach ($_POST['types'] as $type) {
                $typeQuery = 'INSERT INTO desttypes (destination, type) VALUES (:destination_id, :type)';
                $typeStmt = $db->prepare($typeQuery);
                $typeStmt->bindParam(':destination_id', $destinationId);
                $typeStmt->bindParam(':type', $type);
                $typeStmt->execute();
            }
        } else if (isset($_POST['types']) && !empty($_POST['types'])) {
            // Handle case where types might be a comma-separated string
            $types = explode(',', $_POST['types']);
            foreach ($types as $type) {
                $type = trim($type);
                if (!empty($type)) {
                    $typeQuery = 'INSERT INTO desttypes (destination_id, type) VALUES (:destination_id, :type)';
                    $typeStmt = $db->prepare($typeQuery);
                    $typeStmt->bindParam(':destination_id', $destinationId);
                    $typeStmt->bindParam(':type', $type);
                    $typeStmt->execute();
                }
            }
        }

        echo json_encode(['success' => true, 'message' => 'Destination created successfully!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add destination.']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}