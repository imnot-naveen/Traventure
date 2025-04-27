<?php
header('Content-Type: application/json');
include_once('../core/initialize.php');

// Add debugging
error_log("Processing destination update request");
error_log("POST data: " . print_r($_POST, true));
error_log("FILES data: " . print_r($_FILES, true));

// Check upload directory
$uploadDir = "../../Public/uploads/";
if (!is_dir($uploadDir)) {
    error_log("Upload directory doesn't exist: " . $uploadDir);
    mkdir($uploadDir, 0755, true); // Try to create it
}
if (!is_writable($uploadDir)) {
    error_log("Upload directory is not writable: " . $uploadDir);
}

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

        // Add new photos - IMPROVED VERSION
        if (isset($_FILES['newPhotos']) && is_array($_FILES['newPhotos']['name'])) {
            error_log("Processing " . count($_FILES['newPhotos']['name']) . " new photos");
            
            $photoStmt = $db->prepare(
                "INSERT INTO destinationphotos (destination, photoName) VALUES (?, ?)"
            );
            
            foreach ($_FILES['newPhotos']['tmp_name'] as $key => $tmpName) {
                // Check if the file was actually uploaded
                if (!empty($tmpName) && $_FILES['newPhotos']['error'][$key] === UPLOAD_ERR_OK) {
                    // Add timestamp prefix to avoid filename collisions
                    $fileName = time() . '_' . basename($_FILES['newPhotos']['name'][$key]);
                    $targetFilePath = $uploadDir . $fileName;
                    
                    error_log("Moving uploaded file from {$tmpName} to {$targetFilePath}");
                    
                    if (move_uploaded_file($tmpName, $targetFilePath)) {
                        error_log("Successfully moved file, inserting into database");
                        $photoStmt->execute([$id, $fileName]);
                    } else {
                        error_log("Failed to move uploaded file: " . $tmpName . " to " . $targetFilePath);
                        error_log("PHP upload error: " . error_get_last()['message']);
                        throw new Exception("Failed to upload photo: " . $_FILES['newPhotos']['name'][$key]);
                    }
                } else if ($_FILES['newPhotos']['error'][$key] !== UPLOAD_ERR_OK) {
                    $errorMessage = "";
                    switch($_FILES['newPhotos']['error'][$key]) {
                        case UPLOAD_ERR_INI_SIZE:
                            $errorMessage = "The uploaded file exceeds the upload_max_filesize directive in php.ini";
                            break;
                        case UPLOAD_ERR_FORM_SIZE:
                            $errorMessage = "The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form";
                            break;
                        case UPLOAD_ERR_PARTIAL:
                            $errorMessage = "The uploaded file was only partially uploaded";
                            break;
                        case UPLOAD_ERR_NO_FILE:
                            $errorMessage = "No file was uploaded";
                            break;
                        case UPLOAD_ERR_NO_TMP_DIR:
                            $errorMessage = "Missing a temporary folder";
                            break;
                        case UPLOAD_ERR_CANT_WRITE:
                            $errorMessage = "Failed to write file to disk";
                            break;
                        case UPLOAD_ERR_EXTENSION:
                            $errorMessage = "File upload stopped by extension";
                            break;
                        default:
                            $errorMessage = "Unknown upload error";
                            break;
                    }
                    error_log("File upload error for file {$key}: {$errorMessage}");
                }
            }
        } else {
            error_log("No files detected in request or incorrectly formatted");
        }

        $db->commit();
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        error_log("Exception in destination update: " . $e->getMessage());
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Invalid request method"]);
}
?>