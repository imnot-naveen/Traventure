    <?php
    session_start();
    // Check if the user is logged in
    if (!isset($_SESSION['username'])) {
        header("Location: ../login/loginpage.html"); // Redirect to login if not logged in
        exit();
    }

    if (trim($_SESSION['userType']) !== "TSP") {
        header(header: "Location: ../Home/home.html"); // If not authorized, redirect to homepage
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
        <title>Add Trains | Traventure</title>
        <link rel="stylesheet" href="addtrains.css">
    </head>
    <body>
        <div class="container">
            <header>
                <div class="logo">
                    <img src="logo.png" alt="Traventure Logo">
                </div>
                <nav>
                    <a href="../Manage Trains/managetrains.php" class="go-back-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M15 18l-6-6 6-6"/>
                        </svg>
                        Go Back
                    </a>
                </nav>
            </header>

            <main>
                <div class="form-wrapper">
                    <div class="form-header">
                        <h1>Add New Train</h1>
                        <p>Enter detailed information for a new train in the Traventure network</p>
                    </div>

                    <form id="addTrainForm" class="train-form">
                        <div class="form-grid">
                            <div class="form-column">
                                <div class="form-group">
                                    <label for="trainNo">Train Number</label>
                                    <div class="input-wrapper">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect>
                                            <line x1="3" y1="10" x2="21" y2="10"></line>
                                        </svg>
                                        <input type="text" id="trainNo" name="trainNo" placeholder="Enter train number" required>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="name">Train Name</label>
                                    <div class="input-wrapper">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                        <input type="text" id="name" name="name" placeholder="Enter train name" required>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="route">Route</label>
                                    <div class="input-wrapper">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M3 12h18"></path>
                                            <path d="M3 6h18"></path>
                                            <path d="M3 18h18"></path>
                                        </svg>
                                        <select id="route" name="route" required>
                                            <option value="" disabled selected>Select Route</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="form-column">
                                <div class="form-group">
                                    <label for="type">Train Type</label>
                                    <div class="input-wrapper">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M9 9a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3z"></path>
                                            <path d="M12 3v18"></path>
                                        </svg>
                                        <select id="type" name="type" required>
                                            <option value="" disabled selected>Select Train Type</option>
                                            <option value="Express">Express</option>
                                            <option value="Semi Express">Semi Express</option>
                                            <option value="Commuter">Commuter</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="date">Operating Days</label>
                                    <div class="input-wrapper">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                            <line x1="16" y1="2" x2="16" y2="6"></line>
                                            <line x1="8" y1="2" x2="8" y2="6"></line>
                                            <line x1="3" y1="10" x2="21" y2="10"></line>
                                        </svg>
                                        <select id="date" name="date" required>
                                            <option value="" disabled selected>Select Operating Days</option>
                                            <option value="Daily">Daily</option>
                                            <option value="Weekdays">Weekdays</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="form-group time-group">
                                    <div class="time-inputs">
                                        <div class="time-input">
                                            <label for="departureTime">Departure Time</label>
                                            <input type="time" id="departureTime" name="departureTime" required>
                                        </div>
                                        <div class="time-input">
                                            <label for="arrivalTime">Arrival Time</label>
                                            <input type="time" id="arrivalTime" name="arrivalTime" required>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-group seat-group">
                            <label>No. of seats</label>
                                    <div class="seat-inputs">
                                        <div class="seat-input">
                                            <label for="firstClass">First Class</label>
                                            <input type="text" id="firstClass" name="firstClass" required>
                                        </div>
                                        <div class="seat-input">
                                            <label for="secondClass">Second Class</label>
                                            <input type="text" id="secondClass" name="secondClass" required>
                                        </div>
                                    </div>
                        </div>

                        <div class="form-group stations-group">
                            <label>Train Stations</label>
                            <div class="station-selectors">
                                <div class="station-select">
                                    <label for="start Station">Start Station</label>
                                    <select id="startStation" name="startStation" required>
                                        <option value="" disabled selected>Select Start Station</option>
                                    </select>
                                </div>
                                <div class="station-select">
                                    <label for="endStation">End Station</label>
                                    <select id="endStation" name="endStation" required>
                                        <option value="" disabled selected>Select End Station</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="trainStops">Train Stops</label>
                            <div id="trainStops" class="train-stops">
                                <p>Please select start and end stations to see train stops.</p>
                            </div>
                        </div>

                        <button type="submit" class="btn">Add Train</button>
                    </form>
                </div>
            </main>
        </div>
        <script src="addtrains.js"></script>
    </body>
    </html>