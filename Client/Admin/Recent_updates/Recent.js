document.addEventListener("DOMContentLoaded", function () {

    // Function to update the "Recent Updates" section
    function updateRecentUpdates(bookings) {
        const updatesContainer = document.querySelector('.updates');
        updatesContainer.innerHTML = ''; // Clear existing updates
        
        if (bookings.length === 0) {
            updatesContainer.innerHTML = "<p>No recent bookings.</p>"; 
            return;
        }

        bookings.forEach((booking) => {
            const updateDiv = document.createElement('div');
            updateDiv.classList.add('update');
            
            updateDiv.innerHTML = `
                <div class="profile-photo">
                    <span class="material-symbols-outlined">account_circle</span>
                </div>
                <div class="message">
                    <p><b>${booking.userName}</b> booked a train from ${booking.startStation} to ${booking.endStation}.</p>
                    <small class="text-muted">${booking.timeAgo}</small>
                </div>
            `;
            
            updatesContainer.appendChild(updateDiv);
        });
    }

    // Fetch recent bookings from API
    function fetchRecentBookings() {
        fetch('http://localhost/Traventure/Server/api/getRecent3Bookings.php') 
            .then(response => response.json())
            .then(data => {
                if (data.success && data.data) {
                    updateRecentUpdates(data.data);
                } else {
                    console.error('No bookings found or error in API response');
                    updateRecentUpdates([]); // Handle empty response gracefully
                }
            })
            .catch(error => {
                console.error('Error fetching recent bookings:', error);
                updateRecentUpdates([]); // Handle error by showing no bookings
            });
    }

    // Fetch new user count from API
    function fetchUserCount() {
        fetch('http://localhost/Traventure/Server/api/getUserCountInaDay.php') 
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    const count = result.data;
                    document.getElementById("user-count").textContent = count;
                } else {
                    document.getElementById("user-count").textContent = "0";
                }
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
                document.getElementById("user-count").textContent = "0";
            });
    }

    //Function to fetch trip count
    function fetchTripCount() {
        fetch('http://localhost/Traventure/Server/api/getTripCount.php')
            .then(response => response.json()) 
            .then(result => {
                if (result.success) {
                    const count = result.data.count;
                    document.getElementById("tripCount").textContent = count;
                } else {
                    console.error("Error fetching trip count:", result.message || "Unknown error");
                    document.getElementById("tripCount").textContent = "0"; 
                }
            })
            .catch(error => {
                console.error("Network or server error:", error);
                document.getElementById("tripCount").textContent = "0";
            });
    }
    

    // Function to fetch the logged-in username
    async function fetchLoggedInUsername() {
        try {
            const response = await fetch('http://localhost/Traventure/Server/api/getUsername.php');
            const data = await response.json();
            
            if (data.success) {
                return data.username; // Return the username
            } else {
                console.error('Error:', data.message);
                return null; // Return null if not logged in
            }
        } catch (error) {
            console.error('Error fetching logged-in user:', error);
            return null; // Return null if there was an error
        }
    }

    // Function to fetch and update admin details dynamically
    async function updateAdminInfo() {
        const username = await fetchLoggedInUsername(); // Wait for the username
        
        if (username) {
            fetch(`http://localhost/Traventure/Server/api/getAdminDetails.php?username=${username}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const admin = data.data;
                        // Dynamically update the admin name and role
                        document.querySelector('.info b').textContent = admin.first_name || 'Admin';
                    } else {
                        console.error('Admin not found:', data.message);
                    }
                })
                .catch(error => console.error('Error fetching admin details:', error));
        } else {
            console.error('No username provided or user not logged in');
        }
    }

    async function bookingCount() {
        try {
            const response = await fetch('http://localhost/Traventure/Server/api/getBookingCountDay.php');
            const result = await response.json();
    
            if (result.success) {
                const count = result.data.count;
                document.getElementById("bookingCount").textContent = count;
            } else {
                document.getElementById("bookingCount").textContent = "0";
            }
        } catch (error) {
            console.error("Error fetching booking data:", error);
            document.getElementById("bookingCount").textContent = "0";
        }
    }

    // Call the updateAdminInfo function to update the information dynamically
    updateAdminInfo();
    bookingCount();

    // Call both functions when the DOM is ready
    fetchRecentBookings();
    fetchTripCount();
    fetchUserCount();
});
