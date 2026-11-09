<?php
declare(strict_types=1);

// Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once('../core/initialize.php');
require_once('../core/AccommodationService.php');

try {
    $station = trim($_GET['station'] ?? 'Colombo Fort');
    $checkin = trim($_GET['checkin'] ?? date('Y-m-d'));
    $checkout = isset($_GET['checkout']) ? trim($_GET['checkout']) : date('Y-m-d', strtotime('+1 day', strtotime($checkin)));

    $service = new AccommodationService($db);
    $result = $service->getHotelsForLayover($station, $checkin, $checkout);

    echo json_encode([
        'success' => true,
        'source' => $result['source'],
        'station' => $result['station'],
        'dates' => $result['dates'],
        'bookingDeepLink' => $result['links']['bookingDeepLink'],
        'airbnbDeepLink' => $result['links']['airbnbDeepLink'],
        'hotels' => $result['hotels']
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error querying layover accommodation.',
        'error' => $e->getMessage()
    ]);
}
