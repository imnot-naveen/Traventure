<?php
include_once('../core/initialize.php');
header('Content-Type: application/json');

$query = 'SELECT routeName FROM routes';
$stmt = $db->prepare($query);
$stmt->execute();
$routes = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($routes);
?>