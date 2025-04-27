<?php
require_once '../core/initialize.php'; 

header('Content-Type: application/json');

try {
    // Check if contactID is sent
    if (!isset($_GET['contactID']) || empty($_GET['contactID'])) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Contact ID is required.'
        ]);
        exit;
    }

    $contactID = intval($_GET['contactID']); // make sure it's integer

    // Prepare the query
    $query = 'SELECT contactID, name, phone, email, message FROM contact WHERE contactID = :contactID LIMIT 1';
    $stmt = $db->prepare($query); // <-- use $db instead of $pdo

    $stmt->bindParam(':contactID', $contactID, PDO::PARAM_INT);
    $stmt->execute();

    $contact = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($contact) {
        echo json_encode([
            'status' => 'success',
            'data' => $contact
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Contact not found.'
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
