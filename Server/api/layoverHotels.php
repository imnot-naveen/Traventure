<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$station = trim($_GET['station'] ?? 'Colombo Fort');
$checkin = trim($_GET['checkin'] ?? date('Y-m-d'));
$checkout = trim($_GET['checkout'] ?? date('Y-m-d', strtotime('+1 day', strtotime($checkin))));

// City / Hub Coordinates and Search Query Mapping for Sri Lankan Railway Junctions
$hubMetadata = [
    'Colombo Fort' => [
        'city' => 'Colombo',
        'query' => 'Colombo Fort Railway Station, Sri Lanka',
        'lat' => 6.9344,
        'lng' => 79.8500,
        'curated' => [
            [
                'name' => 'The Kingsbury Hotel Colombo',
                'stars' => 5,
                'rating' => 8.7,
                'reviews' => '1,420 reviews',
                'distance' => '0.8 km from Colombo Fort Station',
                'estimatedPrice' => '$85 / night',
                'badge' => 'Transit Favorite',
                'thumbnail' => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=80',
                'features' => ['24/7 Front Desk', 'Breakfast Buffet', 'Station Shuttle']
            ],
            [
                'name' => 'Fairway Colombo',
                'stars' => 4,
                'rating' => 8.5,
                'reviews' => '980 reviews',
                'distance' => '0.5 km from Colombo Fort Station (Hospital St)',
                'estimatedPrice' => '$52 / night',
                'badge' => 'Walking Distance',
                'thumbnail' => 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&auto=format&fit=crop&q=80',
                'features' => ['Fast Wi-Fi', 'Soundproof Rooms', 'Rooftop Bar']
            ],
            [
                'name' => 'City Rest Fort Hostel & Transit Pods',
                'stars' => 3,
                'rating' => 8.2,
                'reviews' => '650 reviews',
                'distance' => '0.4 km from Colombo Fort Station',
                'estimatedPrice' => '$22 / night',
                'badge' => 'Budget Transit',
                'thumbnail' => 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500&auto=format&fit=crop&q=80',
                'features' => ['Luggage Lockers', 'Clean AC Dorms & Private', 'Early Checkout']
            ]
        ]
    ],
    'Maradana' => [
        'city' => 'Colombo',
        'query' => 'Maradana, Colombo, Sri Lanka',
        'lat' => 6.9271,
        'lng' => 79.8656,
        'curated' => [
            [
                'name' => 'Cinnamon Red Colombo',
                'stars' => 4,
                'rating' => 8.6,
                'reviews' => '2,100 reviews',
                'distance' => '2.5 km from Maradana Station',
                'estimatedPrice' => '$58 / night',
                'badge' => 'City Center',
                'thumbnail' => 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&auto=format&fit=crop&q=80',
                'features' => ['Infinity Pool', 'AC Rooms', 'Express Checkout']
            ]
        ]
    ],
    'Kandy' => [
        'city' => 'Kandy',
        'query' => 'Kandy Railway Station, Kandy, Sri Lanka',
        'lat' => 7.2906,
        'lng' => 80.6337,
        'curated' => [
            [
                'name' => 'Queen\'s Hotel Kandy',
                'stars' => 4,
                'rating' => 8.1,
                'reviews' => '850 reviews',
                'distance' => '1.0 km from Kandy Station',
                'estimatedPrice' => '$65 / night',
                'badge' => 'Heritage Landmark',
                'thumbnail' => 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&auto=format&fit=crop&q=80',
                'features' => ['Lake View', 'Colonial Dining', 'Tour Desk']
            ]
        ]
    ],
    'Polgahawela' => [
        'city' => 'Polgahawela',
        'query' => 'Polgahawela, Sri Lanka',
        'lat' => 7.3333,
        'lng' => 80.3000,
        'curated' => [
            [
                'name' => 'Junction Transit Inn & Rest',
                'stars' => 3,
                'rating' => 7.9,
                'reviews' => '120 reviews',
                'distance' => '0.3 km from Polgahawela Junction',
                'estimatedPrice' => '$25 / night',
                'badge' => 'Station Adjacent',
                'thumbnail' => 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500&auto=format&fit=crop&q=80',
                'features' => ['24h Check-in', 'AC Rooms', 'Hot Water']
            ]
        ]
    ]
];

// Normalize station name
$matchedMetadata = $hubMetadata['Colombo Fort'];
foreach ($hubMetadata as $hubKey => $data) {
    if (stripos($station, $hubKey) !== false || stripos($hubKey, $station) !== false) {
        $matchedMetadata = $data;
        break;
    }
}

// Generate real Booking.com Affiliate Search Link with accurate parameters
$encodedQuery = urlencode($matchedMetadata['query']);
$bookingUrl = "https://www.booking.com/searchresults.html?ss={$encodedQuery}&checkin={$checkin}&checkout={$checkout}&group_adults=1&no_rooms=1&group_children=0";

// Generate Airbnb Search Link
$airbnbUrl = "https://www.airbnb.com/s/{$encodedQuery}/homes?checkin={$checkin}&checkout={$checkout}&adults=1";

echo json_encode([
    'success' => true,
    'station' => $station,
    'city' => $matchedMetadata['city'],
    'dates' => [
        'checkin' => $checkin,
        'checkout' => $checkout
    ],
    'bookingDeepLink' => $bookingUrl,
    'airbnbDeepLink' => $airbnbUrl,
    'hotels' => $matchedMetadata['curated']
]);
