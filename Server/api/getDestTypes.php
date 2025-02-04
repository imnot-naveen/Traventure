<?php
include_once('../core/initialize.php');

$query = "SELECT type_id AS id, type FROM destinationtypes";
$stmt = $db -> prepare($query);
$stmt->execute();

$destinations = $stmt -> fetchAll(PDO::FETCH_ASSOC);

echo json_encode($destinations);        
?>


