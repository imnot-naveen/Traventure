<?php
// Include database and necessary initialization files
include_once('../core/initialize.php');
header('Content-Type: application/json');

// Ensure the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit();
}

// Validate required fields
if (empty($_POST['title']) || empty($_POST['intro']) || empty($_POST['content'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input: All fields are required.']);
    exit();
}

try {
    // Process uploaded file if available
    $imageURL = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../../Public/Uploads/';
        $uploadFile = $uploadDir . basename($_FILES['image']['name']);
        if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadFile)) {
            $imageURL = $uploadFile; // Store the file path
        } else {
            throw new Exception('Failed to upload image.');
        }
    }

    // Prepare query to insert blog post
    $query = 'INSERT INTO blogs (title, intro, content, imageURL, createdAt, updatedAt) 
              VALUES (:title, :intro, :content, :imageURL, NOW(), NOW())';
    $stmt = $db->prepare($query);

    // Bind parameters
    $stmt->bindParam(':title', $_POST['title']);
    $stmt->bindParam(':intro', $_POST['intro']);
    $stmt->bindParam(':content', $_POST['content']);
    $stmt->bindParam(':imageURL', $imageURL);

    // Execute the query
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Blog post added successfully.']);
    } else {
        throw new Exception('Failed to insert blog post details.');
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}