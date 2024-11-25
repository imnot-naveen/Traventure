<?php
// Include database and necessary initialization files
include_once('../core/initialize.php');
header('Content-Type: application/json');

// Retrieve and decode incoming JSON data
$data = json_decode(file_get_contents("php://input"));

// Validate required fields
if (empty($data->title) || empty($data->city) || empty($data->intro) || empty($data->content) || empty($data->imageURL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid input: All fields are required.']);
    exit();
}

try {
    // Start transaction
    $db->beginTransaction();

    // Insert into `blogposts` table
    $query = 'INSERT INTO blogposts (title, city, intro, content, imageURL, createdAt, updatedAt) 
              VALUES (:title, :city, :intro, :content, :imageURL, NOW(), NOW())';

    $stmt = $db->prepare($query);
    $stmt->bindParam(':title', $data->title);
    $stmt->bindParam(':city', $data->city);
    $stmt->bindParam(':intro', $data->intro);
    $stmt->bindParam(':content', $data->content);
    $stmt->bindParam(':imageURL', $data->imageURL);

    // Execute the query
    if ($stmt->execute()) {
        // Commit transaction
        $db->commit();
        echo json_encode(['success' => true, 'message' => 'Blog post added successfully.']);
    } else {
        throw new Exception('Failed to insert blog post details.');
    }
} catch (Exception $e) {
    // Rollback transaction on error
    $db->rollBack();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
