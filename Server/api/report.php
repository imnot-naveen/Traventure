<?php
// api/get_monthly_report.php

// Set headers to prevent caching and specify JSON response
header('Content-Type: application/json');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

// Database connection
require_once '../core/initialize.php';

try {
    
    // Get first day of last month
    $firstDayLastMonth = date('Y-m-01', strtotime('first day of last month'));
    // Get last day of last month
    $lastDayLastMonth = date('Y-m-t', strtotime('last day of last month'));
    
    // Format report date
    $reportDate = date('F Y', strtotime($firstDayLastMonth));
    
    // Get booking count for last month
    $bookingCountQuery = "SELECT COUNT(*) as count FROM bookings 
                          WHERE bookingDate BETWEEN :firstDay AND :lastDay";
    $stmt = $conn->prepare($bookingCountQuery);
    $stmt->bindParam(':firstDay', $firstDayLastMonth);
    $stmt->bindParam(':lastDay', $lastDayLastMonth);
    $stmt->execute();
    $bookingCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    // Get user count (new registrations last month)
    $userCountQuery = "SELECT COUNT(*) as count FROM registereduser r
          JOIN person p ON p.username = r.username
                       WHERE p.created_at BETWEEN :firstDay AND :lastDay";
    $stmt = $conn->prepare($userCountQuery);
    $stmt->bindParam(':firstDay', $firstDayLastMonth);
    $stmt->bindParam(':lastDay', $lastDayLastMonth);
    $stmt->execute();
    $userCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    // Get trip count for last month
    $tripCountQuery = "SELECT COUNT(*) as count FROM trip
                       WHERE trip_date BETWEEN :firstDay AND :lastDay";
    $stmt = $conn->prepare($tripCountQuery);
    $stmt->bindParam(':firstDay', $firstDayLastMonth);
    $stmt->bindParam(':lastDay', $lastDayLastMonth);
    $stmt->execute();
    $tripCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    // Get total revenue for last month
    $revenueQuery = "SELECT SUM(total_fare) as total FROM bookings 
                     WHERE bookingDate BETWEEN :firstDay AND :lastDay";
    $stmt = $conn->prepare($revenueQuery);
    $stmt->bindParam(':firstDay', $firstDayLastMonth);
    $stmt->bindParam(':lastDay', $lastDayLastMonth);
    $stmt->execute();
    $revenue = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Get booking details
    $bookingDetailsQuery = "SELECT b.id, u.username as user, t.destination, b.bookingDate as date, b.total_fare
                           FROM bookings b
                           JOIN users u ON b.user_id = u.id
                           WHERE b.bookingDate BETWEEN :firstDay AND :lastDay
                           ORDER BY b.bookingDate DESC";
    $stmt = $conn->prepare($bookingDetailsQuery);
    $stmt->bindParam(':firstDay', $firstDayLastMonth);
    $stmt->bindParam(':lastDay', $lastDayLastMonth);
    $stmt->execute();
    $bookingDetails = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Prepare response
    $response = [
        'reportDate' => $reportDate,
        'bookingCount' => $bookingCount,
        'userCount' => $userCount,
        'revenue' => number_format($revenue, 2),
        'bookingDetails' => $bookingDetails
    ];
    
    echo json_encode($response);
    
} catch(PDOException $e) {
    // Return error message
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>