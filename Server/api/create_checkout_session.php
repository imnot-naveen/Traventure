<?php

require_once '../stripe-php-master/init.php';
\Stripe\Stripe::setApiKey('sk_test_51RCy68QwgaoFWhBRwdHxXBnm0PfR48XwhFFjstKkrsehntGXk841cmi7tswvHn9n2NDOiwQ7f0IoguWf7V2LyZfl00fs5vEnlm');

header('Content-Type: application/json');
$input = json_decode(file_get_contents("php://input"), true);
$amount = $input['amount'] ?? 0;

try {
    $session = \Stripe\Checkout\Session::create([
        'payment_method_types' => ['card'],
        'line_items' => [[
            'price_data' => [
                'currency' => 'lkr',
                'unit_amount' => $amount * 100,
                'product_data' => ['name' => 'Train Ticket Booking'],
            ],
            'quantity' => 1,
        ]],
        'mode' => 'payment',
        'success_url' => 'http://localhost/Traventure/Client/Booking/success.html',
        'cancel_url' => 'http://localhost/Traventure/Client/Booking/cancel.html',
    ]);

    echo json_encode(['id' => $session->id]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
