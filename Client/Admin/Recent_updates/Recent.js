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
                  updateRecentUpdates(data.data); // Update the UI with bookings data
              } else {
                  console.error('No bookings found or error in API response');
                  // Optionally, you can show a message in case of failure
              }
          })
          .catch(error => {
              console.error('Error fetching recent bookings:', error);
          });
  }

  // Fetch and display recent bookings when the page is loaded
  fetchRecentBookings();
});
