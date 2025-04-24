<?php
// Include database and necessary initialization files
include_once('../core/initialize.php');
session_start();
header('Content-Type: application/json');

// Ensure the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit();
}

$author = $_SESSION['username']; // logged-in username

// Validate required fields
if (empty($_POST['blogId']) || empty($_POST['comment'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input: blogId and comment are required.']);
    exit();
}

try {
    $blogId = $_POST['blogId'];
    $comment = $_POST['comment'];

    // Prepare query to insert comment
    $query = 'INSERT INTO comments (blogId, author, comment)
              VALUES (:blogId, :author, :comment)';
    $stmt = $db->prepare($query);

    // Bind parameters
    $stmt->bindParam(':blogId', $blogId, PDO::PARAM_INT);
    $stmt->bindParam(':author', $author);
    $stmt->bindParam(':comment', $comment);

    // Execute the query
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Comment added successfully.']);
    } else {
        throw new Exception('Failed to insert comment.');
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
