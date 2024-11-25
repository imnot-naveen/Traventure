<?php
include_once('../core/initialize.php');
header('Content-Type: application/json');

// Retrieve and decode incoming JSON data
$data = json_decode(file_get_contents("php://input"));

// Validate required fields
if (empty($data->postID) || empty($data->title) || empty($data->content) || 
    empty($data->city) || empty($data->intro) || empty($data->imageURL) || 
    empty($data->createdAt) || empty($data->updatedAt)) {
    echo json_encode(['success' => false, 'message' => 'Invalid input: All fields are required.']);
    exit();
}

try {
    // Start transaction
    $db->beginTransaction();

    // Update blog post table
    $query = 'UPDATE blogposts 
              SET title = :title, 
                  content = :content, 
                  city = :city, 
                  intro = :intro, 
                  imageURL = :imageURL, 
                  createdAt = :createdAt, 
                  updatedAt = NOW() 
              WHERE postID = :postID';
    $stmt = $db->prepare($query);
    $stmt->bindParam(':postID', $data->postID);
    $stmt->bindParam(':title', $data->title);
    $stmt->bindParam(':content', $data->content);
    $stmt->bindParam(':city', $data->city);
    $stmt->bindParam(':intro', $data->intro);
    $stmt->bindParam(':imageURL', $data->imageURL);
    $stmt->bindParam(':createdAt', $data->createdAt);

    if (!$stmt->execute()) {
        throw new Exception('Failed to update blog post details.');
    }

    // Commit transaction
    $db->commit();
    echo json_encode(['success' => true, 'message' => 'Blog post updated successfully.']);
} catch (Exception $e) {
    // Rollback transaction on error
    $db->rollBack();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>