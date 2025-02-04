<?php
session_start();
include_once('../core/initialize.php');

$username = $_SESSION['username'];

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->destinations) || !is_array($data->destinations)){
    http_response_code(400);
    echo json_encode(['message' => 'Invalid input']);
    exit();
}

foreach ($data->destinations as $destinationId) {
    $query = "INSERT INTO userDestination VALUES (:username, :preferredDestination)";
    $stmt = $db -> prepare($query);
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(":preferredDestination", $destinationId);
    $stmt->execute();
}

echo json_encode(['message' => 'Preferences saved successfully!']);
?>