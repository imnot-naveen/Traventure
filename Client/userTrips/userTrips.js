document.addEventListener("DOMContentLoaded", async () => {
  const tripsContentElement = document.getElementById("trips-content");

  try {
    // Fetch user trips
    const response = await fetch("../../server/api/getUserTrips.php");
    const data = await response.json();

    if (!response.ok) {
      throw new Error("Failed to fetch trips");
    }

    if (!data.success) {
      throw new Error(data.message || "Failed to load trips");
    }

    // Display trips or empty state
    if (data.trips && data.trips.length > 0) {
      const tripsGrid = document.createElement("div");
      tripsGrid.className = "trips-grid";

      data.trips.forEach((trip) => {
        const tripCard = createTripCard(trip);
        tripsGrid.appendChild(tripCard);
      });

      tripsContentElement.innerHTML = "";
      tripsContentElement.appendChild(tripsGrid);
    } else {
      displayEmptyState();
    }
  } catch (error) {
    console.error("Error fetching trips:", error);
    tripsContentElement.innerHTML = `
      <div class="empty-state">
        <h3>Oops! Something went wrong</h3>
        <p>${
          error.message || "Failed to load your trips. Please try again later."
        }</p>
        <a href="../CreateTrip/createTrip.html" class="btn-book-trip">Book a Trip Instead</a>
      </div>
    `;
  }
});

function createTripCard(trip) {
  // Format date
  const tripDate = new Date(trip.date);
  const formattedDate = tripDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format time
  const formatTime = (timeStr) => {
    if (!timeStr) return "N/A";
    const timeParts = timeStr.split(":");
    const hour = parseInt(timeParts[0]);
    const minute = timeParts[1];
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  };

  const departureTime = formatTime(trip.departureTime);

  // Create trip card element
  const tripCard = document.createElement("div");
  tripCard.className = "trip-card";
  tripCard.setAttribute("data-trip-id", trip.tripID);
  tripCard.innerHTML = `
    <div class="booking-ref">${trip.bookingID}</div>
    <div class="trip-date">${formattedDate}</div>
    <div class="trip-route">${trip.start_station_name} to ${trip.end_station_name}</div>
    <div class="trip-time">Departure: ${departureTime}</div>
    <div class="trip-meta">
      <span class="trip-meta-item">${trip.ticket_class}</span>
      <span class="trip-meta-item">Rs. ${trip.total_fare}</span>
    </div>
    <button class="btn-remove-trip">Remove</button>
  `;

  tripCard.addEventListener("click", () => {
    window.location.href = `../Trip Details/tripDetails.html?tripID=${trip.tripID}`;
  });

  const removeButton = tripCard.querySelector(".btn-remove-trip");
  removeButton.addEventListener("click", (e) => {
    e.stopPropagation();

    if (confirm("Are you sure you want to remove this trip?")) {
      removeTrip(trip.tripID, tripCard);
    }
  });

  return tripCard;
}

function displayEmptyState() {
  const tripsContentElement = document.getElementById("trips-content");
  tripsContentElement.innerHTML = `
    <div class="empty-state">
      <img src="../assets/images/empty-trips.svg" alt="No trips found" onerror="this.style.display='none'">
      <h3>No Trips Found</h3>
      <p>You haven't booked any trips yet. Start your adventure by booking your first trip!</p>
      <a href="../createTrip/createTrip.html" class="btn-book-trip">Book Your First Trip</a>
    </div>
  `;
}

function removeTrip(tripID, tripCard) {
  fetch("../../server/api/removeTrip.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tripID }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        tripCard.remove();
        alert("Trip removed successfully!");
      } else {
        alert(data.message || "Failed to remove trip.");
      }
    })
    .catch((error) => {
      console.error("Error removing trip:", error);
      alert("Something went wrong. Please try again later.");
    });
}
