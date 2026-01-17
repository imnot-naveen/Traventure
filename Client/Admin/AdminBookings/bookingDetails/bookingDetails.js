document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const bookingId = urlParams.get("id");

  // Ensure that bookingId is not null or empty
  if (bookingId) {
    fetch(`http://localhost/Traventure/Server/api/getBookingById.php?id=${bookingId}`)
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById("detailsContainer");
        if (data.success && data.data) { 
          const booking = data.data; 
          container.innerHTML = `
            <p><strong>Booking ID:</strong> ${booking.bookingID}</p>
            <p><strong>User ID:</strong> ${booking.userID}</p>
            <p><strong>Full Name:</strong> ${booking.fullName}</p>
            <p><strong>Train ID:</strong> ${booking.trainID}</p>
            <p><strong>Passenger Count:</strong> ${booking.no_of_passengers + booking.kidsCount}</p>
            <p><strong>Payment Status:</strong> ${booking.paymentStatus}</p>
            <p><strong>Booking Date:</strong> ${booking.bookingDate}</p>
            <p><strong>Total Fare:</strong> $${booking.total_fare}</p>
            <p><strong>Start Station:</strong> ${booking.start_station_name}</p>
            <p><strong>Destination Station:</strong> ${booking.destination_station_name}</p>
          `;
        } else {
          container.innerHTML = "<p>Booking not found.</p>";
        }
      })
      .catch(err => {
        console.error("Error fetching booking:", err);
        const container = document.getElementById("detailsContainer");
        container.innerHTML = "<p>There was an error fetching the booking details.</p>";
      });
  } else {
    // If bookingId is not provided, show an error message
    const container = document.getElementById("detailsContainer");
    container.innerHTML = "<p>No Booking ID provided in the URL.</p>";
  }
});


