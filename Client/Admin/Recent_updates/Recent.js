document.addEventListener("DOMContentLoaded", function () {

    // Function to update the "Recent Updates" section
    function updateRecentUpdates(bookings) {
        const updatesContainer = document.querySelector('.updates');
        updatesContainer.innerHTML = ''; // Clear existing updates
  
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
                }
            })
            .catch(error => {
                console.error('Error fetching recent bookings:', error);
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
                    document.getElementById("user-growth").textContent = "+25%"; // Dummy growth for now
                    document.getElementById("user-growth").classList.add("success");
                } else {
                    document.getElementById("user-count").textContent = "0";
                    document.getElementById("user-growth").textContent = "+0%";
                    document.getElementById("user-growth").classList.remove("success");
                    document.getElementById("user-growth").classList.add("danger");
                }
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
                document.getElementById("user-count").textContent = "0";
                document.getElementById("user-growth").textContent = "Error";
            });
    }
  
    // Call both functions when the DOM is ready
    fetchRecentBookings();
    fetchUserCount();
  });
  