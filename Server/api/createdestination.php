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
    $query = 'INSERT INTO Destination (name, description, type, nearestStation) VALUES (:name, :description, :type, :nearestStation)';
    $stmt = $db->prepare($query);
    $stmt->bindParam(':name', $_POST['name']);
    $stmt->bindParam(':description', $_POST['description']);
    $stmt->bindParam(':type', $_POST['type']);
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

        echo json_encode(['success' => true, 'message' => 'Destination created successfully!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add destination.']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}