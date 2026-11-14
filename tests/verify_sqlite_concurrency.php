<?php
declare(strict_types=1);

require_once(__DIR__ . '/../Server/core/SeatReservationService.php');

$db = new PDO('sqlite::memory:');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$db->exec("
    CREATE TABLE seat_reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        train_id INTEGER NOT NULL,
        journey_date TEXT NOT NULL,
        seat_number TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        booking_id INTEGER NULL,
        coach_class TEXT DEFAULT '1st Class',
        status TEXT NOT NULL,
        held_at TEXT DEFAULT CURRENT_TIMESTAMP,
        expires_at TEXT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(train_id, journey_date, seat_number)
    )
");

$service = new SeatReservationService($db);

// Scenario 1: User 1 holds A1
$res1 = $service->holdSeats(1005, '2026-12-01', ['A1'], 101);

// Scenario 2: User 2 simultaneously attempts to hold A1
$res2 = $service->holdSeats(1005, '2026-12-01', ['A1'], 102);

// Scenario 3: Atomic Multi-Seat Contention (User 3 wants A2 and A1; A1 is already held)
$res3 = $service->holdSeats(1005, '2026-12-01', ['A2', 'A1'], 103);

// Verify A2 was cleanly rolled back and never held
$stmt = $db->query("SELECT seat_number FROM seat_reservations WHERE seat_number = 'A2'");
$a2Record = $stmt->fetch(PDO::FETCH_ASSOC);

// Scenario 4: User 1 confirms hold
$confirmOk = $service->confirmSeats(1005, '2026-12-01', ['A1'], 101, 9999);

// Scenario 5: User 4 tries to hold now-confirmed A1
$res4 = $service->holdSeats(1005, '2026-12-01', ['A1'], 104);

echo json_encode([
    'user1_success' => $res1['success'],
    'user2_conflict' => !$res2['success'],
    'user3_atomic_rollback' => (!$res3['success'] && $a2Record === false),
    'confirm_success' => $confirmOk,
    'user4_booked_conflict' => !$res4['success']
]);

