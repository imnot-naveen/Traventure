<?php
require_once '../core/initialize.php'; 

header('Content-Type: application/json');

try {
    $query = 'SELECT contactID, name, phone, email, message FROM contact';
    $stmt = $db->prepare($query); // <-- use $db here

    $stmt->execute();

    $contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!empty($contacts)) {
        echo json_encode([
            'status' => 'success',
            'data' => $contacts
        ]);
    } else {
        echo json_encode([
            'status' => 'success',
            'data' => [],
            'message' => 'No contacts found.'
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}

?>
