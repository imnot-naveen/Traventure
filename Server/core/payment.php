<?php
class Payment {
    private $conn;
    private $payment_table = 'payment'; 
    
    public function __construct($db) {
        $this->conn = $db;
    }

    // Process a payment and store the details
    public function processPayment($bookingId, $amount, $paymentMethod, $status, $transactionId, $qrCode) {
        $query = "INSERT INTO " . $this->payment_table . " 
                  (booking_id, amount, payment_method, status, transaction_id, qr_code, created_at) 
                  VALUES (:booking_id, :amount, :payment_method, :status, :transaction_id, :qr_code, NOW())";
        
        $stmt = $this->conn->prepare($query);

        // Bind parameters for PDO
        $stmt->bindParam(':booking_id', $bookingId);
        $stmt->bindParam(':amount', $amount);
        $stmt->bindParam(':payment_method', $paymentMethod);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':transaction_id', $transactionId);
        $stmt->bindParam(':qr_code', $qrCode);

        if ($stmt->execute()) {
            return [
                'status' => 'success',
                'message' => 'Payment processed successfully.',
                'paymentId' => $this->conn->lastInsertId(),
            ];
        } else {
            return [
                'status' => 'error',
                'message' => 'Error processing payment.',
            ];
        }
    }

    // Get payment details by payment ID
    public function getPaymentDetails($paymentId) {
        $query = "SELECT payment_id, booking_id, amount, payment_method, status, transaction_id, qr_code, created_at 
                  FROM " . $this->payment_table . " WHERE payment_id = :payment_id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':payment_id', $paymentId);

        if ($stmt->execute()) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($row) {
                return [
                    'status' => 'success',
                    'payment' => $row,
                ];
            } else {
                return [
                    'status' => 'error',
                    'message' => 'Payment not found.',
                ];
            }
        } else {
            return [
                'status' => 'error',
                'message' => 'Error fetching payment details.',
            ];
        }
    }
}
?>
