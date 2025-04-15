<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers
header('Access-Control-Allow-Origin: *'); // Allow CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST'); // Allow only POST method
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// Include database and class files
include_once('../core/initialize.php');


$bookings = new Bookings($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Make sure data is not empty
if (
    !empty($data->userID) &&
    !empty($data->start_station) &&
    !empty($data->destination_station) &&
    !empty($data->class) &&
    !empty($data->no_of_passengers) &&
    !empty($data->total_fare) &&
    !empty($data->paymentMethod)
) {
    // Validate input data
    $userID = htmlspecialchars(strip_tags($data->userID));
    $routeID = !empty($data->routeID) ? htmlspecialchars(strip_tags($data->routeID)) : null;
    $start_station = htmlspecialchars(strip_tags($data->start_station));
    $destination_station = htmlspecialchars(strip_tags($data->destination_station));
    $class = htmlspecialchars(strip_tags($data->class));
    $no_of_passengers = htmlspecialchars(strip_tags($data->no_of_passengers));
    $total_fare = htmlspecialchars(strip_tags($data->total_fare));
    $paymentMethod = htmlspecialchars(strip_tags($data->paymentMethod));

    // Check if start and destination stations are different
    if ($start_station == $destination_station) {
        echo json_encode(array('success' => false, 'message' => 'Start station and destination station cannot be the same.'));
        exit;
    }

    // Check if number of passengers is valid
    if (!is_numeric($no_of_passengers) || $no_of_passengers <= 0) {
        echo json_encode(array('success' => false, 'message' => 'Number of passengers must be a positive number.'));
        exit;
    }

    // Check if total fare is valid
    if (!is_numeric($total_fare) || $total_fare <= 0) {
        echo json_encode(array('success' => false, 'message' => 'Total fare must be a positive number.'));
        exit;
    }

    // Validate class
    $validClasses = array('1st Class', '2nd Class', '3rd Class');
    if (!in_array($class, $validClasses)) {
        echo json_encode(array('success' => false, 'message' => 'Invalid class. Must be one of: ' . implode(', ', $validClasses)));
        exit;
    }

    // Validate payment method
    $validPaymentMethods = array('Card', 'Cash');
    if (!in_array($paymentMethod, $validPaymentMethods)) {
        echo json_encode(array('success' => false, 'message' => 'Invalid payment method. Must be one of: ' . implode(', ', $validPaymentMethods)));
        exit;
    }

    // Create the booking
    $result = $bookings->createBooking(
        $userID,
        $start_station,
        $destination_station,
        $class,
        $no_of_passengers,
        $total_fare,
        $paymentMethod
    );

    // Check if booking was created successfully
    if ($result['success']) {
        // Set response code - 201 Created
        http_response_code(201);
        
        // Return success message and booking ID
        echo json_encode($result);
    } else {
        // Set response code - 503 Service Unavailable
        http_response_code(503);
        
        // Tell the user
        echo json_encode($result);
    }
} else {
    // Set response code - 400 Bad Request
    http_response_code(400);
    
    // Tell the user which fields are missing
    $missingFields = array();
    
    if (empty($data->userID)) $missingFields[] = 'userID';
    if (empty($data->start_station)) $missingFields[] = 'start_station';
    if (empty($data->destination_station)) $missingFields[] = 'destination_station';
    if (empty($data->class)) $missingFields[] = 'class';
    if (empty($data->no_of_passengers)) $missingFields[] = 'no_of_passengers';
    if (empty($data->total_fare)) $missingFields[] = 'total_fare';
    if (empty($data->paymentMethod)) $missingFields[] = 'paymentMethod';
    
    echo json_encode(array(
        'success' => false,
        'message' => 'Unable to create booking. The following fields are required: ' . implode(', ', $missingFields)
    ));
}
?>