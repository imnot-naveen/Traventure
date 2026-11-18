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

// Rate limiting: 60 layover accommodation requests per minute per IP
RateLimiter::enforce('layover_hotels', 60, 60);

try {
    $station = trim($_GET['station'] ?? 'Colombo Fort');
    $checkin = trim($_GET['checkin'] ?? date('Y-m-d'));
    $checkout = isset($_GET['checkout']) ? trim($_GET['checkout']) : date('Y-m-d', strtotime('+1 day', strtotime($checkin)));

    $service = new AccommodationService($db);
    $result = $service->getHotelsForLayover($station, $checkin, $checkout);

    ApiResponse::ok([
        'source' => $result['source'],
        'station' => $result['station'],
        'dates' => $result['dates'],
        'bookingDeepLink' => $result['links']['bookingDeepLink'],
        'airbnbDeepLink' => $result['links']['airbnbDeepLink'],
        'hotels' => $result['hotels']
    ]);
} catch (Throwable $e) {
    ApiResponse::serverError('Error querying layover accommodation.', $e);
}
