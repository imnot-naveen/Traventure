<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, GET');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Include dependencies
include_once('../core/initialize.php');

// Handle GET request for fetching TSP data
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['tspid'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'TSPID is required']);
        exit();
    }

    $tspid = $_GET['tspid'];
    $tsp = new TrainServiceProvider($db);
    $result = $tsp->getTSPDetails($tspid);

    if ($result) {
        echo json_encode(['success' => true, 'data' => $result]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'TSP not found']);
    }
    exit();
}

// Handle PUT request for updating TSP data
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['tspid'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'TSPID is required']);
        exit();
    }

    $tsp = new TrainServiceProvider($db);
    $tsp->tspid = $input['tspid'];
    $tsp->first_name = $input['first_name'] ?? null;
    $tsp->last_name = $input['last_name'] ?? null;
    $tsp->contact_number = $input['contact_number'] ?? null;

    $result = $tsp->updateTsp();

    if ($result['success']) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'TSP updated successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to update TSP']);
    }
    exit();
}

// Default response for unsupported methods
http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Invalid request method']);
exit();
?>
