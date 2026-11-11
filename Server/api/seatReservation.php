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
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'trainID is required.']);
            exit();
        }

        $seatMap = $service->getSeatMap($trainId, $journeyDate);
        echo json_encode([
            'success' => true,
            'trainID' => $trainId,
            'journeyDate' => $journeyDate,
            'seats' => $seatMap
        ]);
        exit();
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
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'trainID, seats array, and userID are required.']);
            exit();
        }

        if ($action === 'hold') {
            $result = $service->holdSeats($trainId, $journeyDate, $seats, $userId, $coachClass);
            if (!$result['success']) {
                http_response_code(409); // Conflict
            }
            echo json_encode($result);
            exit();
        }

        if ($action === 'confirm') {
            $bookingId = isset($data['bookingID']) ? (int)$data['bookingID'] : 0;
            if (!$bookingId) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'bookingID is required to confirm seats.']);
                exit();
            }
            $confirmed = $service->confirmSeats($trainId, $journeyDate, $seats, $userId, $bookingId);
            echo json_encode([
                'success' => $confirmed,
                'message' => $confirmed ? 'Seats confirmed.' : 'Failed to confirm seats (hold may have expired).'
            ]);
            exit();
        }
    }

    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Reservation error.', 'error' => $e->getMessage()]);
}
