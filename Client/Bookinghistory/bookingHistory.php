<?php
session_start(); 

// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    header("Location: ../login/loginpage.html"); 
    exit();
}

// Get the username from the session
$username = $_SESSION['username'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Train Booking History</title>
    <link rel="stylesheet" href="bookingHistory.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Your Train Booking History</h1>
            <div class="user-info">
                <span id="username">Welcome, <strong id="user-display-name">User</strong></span>
            </div>
        </header>

        <div class="filter-section">
            <div class="filter-controls">
                <div class="search-box">
                    <input type="text" id="search-input" placeholder="Search by destination or train number...">
                    <button id="search-btn">Search</button>
                </div>
                <div class="filter-dropdown">
                    <label for="filter-status">Filter by Status:</label>
                    <select id="filter-status">
                        <option value="all">All Bookings</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
                <div class="date-range">
                    <label for="date-from">From:</label>
                    <input type="date" id="date-from">
                    <label for="date-to">To:</label>
                    <input type="date" id="date-to">
                    <button id="apply-date-filter">Apply</button>
                </div>
            </div>
        </div>

        <div class="booking-history-container">
            <div class="loading-spinner" id="loading-spinner">
                <div class="spinner"></div>
                <p>Loading your booking history...</p>
            </div>
            
            <div id="error-message" class="error-message hidden">
                <p>Failed to load booking history. Please try again later.</p>
                <button id="retry-btn">Retry</button>
            </div>
            
            <div id="no-results" class="no-results hidden">
                <p>No booking history found.</p>
            </div>
            
            <div id="booking-list" class="booking-list hidden"></div>
        </div>
        
        <div class="pagination">
            <button id="prev-page" disabled>Previous</button>
            <span id="page-info">Page 1 of 1</span>
            <button id="next-page" disabled>Next</button>
        </div>
    </div>

    <template id="booking-template">
        <div class="booking-card">
            <div class="booking-header">
                <div class="booking-id">
                    <span class="label">Booking ID:</span>
                    <span class="value booking-id-value"></span>
                </div>
                <div class="booking-status"></div>
            </div>
            
            <div class="booking-details">
                <div class="train-info">
                    <div class="train-name-number">
                        <h3 class="train-name"></h3>
                        <span class="train-number"></span>
                    </div>
                    <div class="journey-date">
                        <span class="label">Journey Date:</span>
                        <span class="value journey-date-value"></span>
                    </div>
                </div>
                
                <div class="journey-details">
                    <div class="station-info">
                        <div class="from-station">
                            <div class="time departure-time"></div>
                            <div class="station from-station-name"></div>
                        </div>
                        <div class="journey-line">
                            <div class="dot"></div>
                            <div class="line"></div>
                            <div class="dot"></div>
                        </div>
                        <div class="to-station">
                            <div class="time arrival-time"></div>
                            <div class="station to-station-name"></div>
                        </div>
                    </div>
                </div>
                
                <div class="passenger-info">
                    <div class="passenger-count">
                        <span class="label">Passengers:</span>
                        <span class="value passenger-count-value"></span>
                    </div>
                    <div class="class-info">
                        <span class="label">Class:</span>
                        <span class="value class-value"></span>
                    </div>
                </div>
            </div>
            
            <div class="booking-footer">
                <div class="price">
                    <span class="label">Total Fare:</span>
                    <span class="value price-value"></span>
                </div>
                <div class="booking-actions">
                    <button class="view-details-btn">View Details</button>
                    <button class="download-btn">Download E-Ticket</button>
                    <button class="cancel-btn" data-status=""></button>
                </div>
            </div>
        </div>
    </template>
    <script type="module" src="main.js"></script>
    <!-- <script src="api.js"></script> -->
</body>
</html>