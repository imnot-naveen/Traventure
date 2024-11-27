<?php
include_once('../core/initialize.php');
header('Content-Type: application/json');

try {
    $query = 'SELECT * FROM DestinationTypes';
    $stmt = $db->prepare($query);
    $stmt->execute();

    $types = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'types' => $types]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}