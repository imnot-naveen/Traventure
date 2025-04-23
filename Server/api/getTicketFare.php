<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Include DB config
include_once('../core/initialize.php');

// Get parameters
$difference = isset($_GET['difference']) ? intval($_GET['difference']) : null;
$class = isset($_GET['class']) ? strtolower(trim($_GET['class'])) : null;

// Validate input
if ($difference === null || $class === null) {
    echo json_encode(['error' => 'Missing required parameters: difference or class']);
    exit;
}

// Map class to column
$class_column = '';
switch ($class) {
    case 'first':
        $class_column = 'FirstClass';
        break;
    case 'second':
        $class_column = 'SecondClass';
        break;
    case 'third':
        $class_column = 'ThirdClass';
        break;
    default:
        echo json_encode(['error' => 'Invalid class type. Use first, second, or third.']);
        exit;
}

// Prepare and execute query
$query = "SELECT $class_column AS fare FROM trainfares WHERE difference = :difference LIMIT 1";
$stmt = $db->prepare($query);
$stmt->bindParam(':difference', $difference, PDO::PARAM_INT);
$stmt->execute();

// Fetch result
if ($stmt->rowCount() > 0) {
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode([
        'difference' => $difference,
        'class' => $class,
        'fare' => $row['fare']
    ]);
} else {
    echo json_encode(['error' => 'Fare not found for given difference']);
}
?>
