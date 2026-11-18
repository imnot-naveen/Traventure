<?php
declare(strict_types=1);

// Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once('../core/initialize.php');
require_once('../core/SeatReservationService.php');

// Rate limiting: 30 seat reservation requests per minute per IP
RateLimiter::enforce('seat_reservation', 30, 60);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {
    $service = new SeatReservationService($db);
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    // GET: Return coach seat map & availability
    if ($method === 'GET') {
        $trainId = isset($_GET['trainID']) ? (int)$_GET['trainID'] : 0;
        $journeyDate = trim($_GET['date'] ?? date('Y-m-d'));

        if (!$trainId) {
            ApiResponse::badRequest('trainID is required.');
        }

        $seatMap = $service->getSeatMap($trainId, $journeyDate);
        ApiResponse::ok([
            'trainID' => $trainId,
            'journeyDate' => $journeyDate,
            'seats' => $seatMap
        ]);
    }

    // POST: Acquire 5-minute hold or confirm reservation
    if ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        $action = $data['action'] ?? 'hold';
        $trainId = isset($data['trainID']) ? (int)$data['trainID'] : 0;
        $journeyDate = trim($data['journeyDate'] ?? date('Y-m-d'));
        $seats = $data['seats'] ?? [];
        $coachClass = $data['coachClass'] ?? '1st Class';
        $userId = isset($_SESSION['userID']) ? (int)$_SESSION['userID'] : (isset($data['userID']) ? (int)$data['userID'] : 0);

        if (!$trainId || empty($seats) || !$userId) {
            ApiResponse::badRequest('trainID, seats array, and userID are required.');
        }

        if ($action === 'hold') {
            $result = $service->holdSeats($trainId, $journeyDate, $seats, $userId, $coachClass);
            if (!$result['success']) {
                ApiResponse::conflict($result['message'] ?? 'Seat hold conflict.');
            }
            ApiResponse::ok($result);
        }

        if ($action === 'confirm') {
            $bookingId = isset($data['bookingID']) ? (int)$data['bookingID'] : 0;
            if (!$bookingId) {
                ApiResponse::badRequest('bookingID is required to confirm seats.');
            }
            $confirmed = $service->confirmSeats($trainId, $journeyDate, $seats, $userId, $bookingId);
            if (!$confirmed) {
                ApiResponse::conflict('Failed to confirm seats (hold may have expired or belongs to another user).');
            }
            ApiResponse::ok([
                'confirmed' => true,
                'message' => 'Seats confirmed.'
            ]);
        }
    }

    ApiResponse::error('Method not allowed.', 405);

} catch (Throwable $e) {
    ApiResponse::serverError('Reservation error.', $e);
}
