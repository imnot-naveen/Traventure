document.addEventListener("DOMContentLoaded", async () => {
  const tripContentElement = document.getElementById("trip-content");

  // Get tripID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const tripID = urlParams.get("tripID");

  if (!tripID) {
    displayError("No trip ID provided");
    return;
  }

  try {
    // Fetch trip details
    const response = await fetch(
      `../../server/api/getTripDetails.php?tripID=${tripID}`
    );
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to load trip details");
    }

    // Render trip details
    renderTripDetails(data.tripDetails);
  } catch (error) {
    console.error("Error fetching trip details:", error);
    displayError(error.message || "Failed to load trip details");
  }
});

function renderTripDetails(tripDetails) {
  const { tripData, stations, segments, destinations } = tripDetails;

  // Format date
  const tripDate = new Date(tripData.date);
  const formattedDate = tripDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format time helper
  const formatTime = (timeStr) => {
    if (!timeStr) return "N/A";
    const timeParts = timeStr.split(":");
    const hour = parseInt(timeParts[0]);
    const minute = timeParts[1];
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  };

  // Get station names
  const startStationName =
    stations[tripData.startStation] || `Station ${tripData.startStation}`;
  const endStationName =
    stations[tripData.endStation] || `Station ${tripData.endStation}`;

  // Generate segments HTML
  let segmentsHTML = "";
  if (segments && segments.length > 0) {
    segments.forEach((segment, index) => {
      segmentsHTML += `
        <div class="segment">
          <div class="segment-header">
            <span class="segment-number">🛤️ Segment ${index + 1}: ${
        segment.originStationName
      } ➡️ ${segment.destinationStationName}</span>
          </div>
          <div class="segment-details">
            <div><strong>Train ID:</strong> ${segment.trainID || "N/A"}</div>
            <div><strong>Train Name:</strong> ${
              segment.trainName || segment.trainType + " Service"
            }</div>
            <div><strong>Departure Time:</strong> ${formatTime(
              segment.departureTime
            )}</div>
          </div>
        </div>
      `;
    });
  } else {
    segmentsHTML = `
      <div class="segment">
        <div class="segment-header">
          <span class="segment-number">🛤️ Direct Trip: ${startStationName} ➡️ ${endStationName}</span>
        </div>
        <div class="segment-details">
          <div><strong>Departure Time:</strong> ${formatTime(
            tripData.departureTime
          )}</div>
          <div><strong>Arrival Time:</strong> ${formatTime(
            tripData.arrivalTime
          )}</div>
        </div>
      </div>
    `;
  }

  // Calculate fare information
  const adultFare = parseFloat(tripData.adult_fare) || 0;
  const childFare = parseFloat(tripData.child_fare) || 0;
  const adults = parseInt(tripData.number_of_adults) || 0;
  const children = parseInt(tripData.number_of_children) || 0;
  const totalFare = parseFloat(tripData.total_fare) || 0;

  const urlParams = new URLSearchParams(window.location.search);
  const tripID = urlParams.get("tripID");

  // Build the complete itinerary HTML
  const tripContentElement = document.getElementById("trip-content");
  tripContentElement.innerHTML = `
    <div class="ticket-container">
      <div class="ticket-header">
        <div>
          <h1>🎟️ Your Train Trip Itinerary</h1>
          <div class="booking-reference">Booking #${
            tripData.booking_reference
          }</div>
        </div>
        <div class="logo">Traventure</div>
      </div>
      
      <div class="ticket-section">
        <h2>👤 Passenger Details</h2>
        <div class="passenger-details">
          <ul>
            <li><strong>Username:</strong> ${tripData.username}</li>
            <li><strong>Adults:</strong> ${adults}</li>
            <li><strong>Children:</strong> ${children}</li>
          </ul>
          <ul>
            <li><strong>Ticket Class:</strong> ${tripData.ticket_class}</li>
            <li class="fare-details">
              <strong>Total Fare:</strong> Rs. ${totalFare.toFixed(2)}
              <ul class="fare-breakdown">
                <li>Adult Fare: Rs. ${adultFare.toFixed(
                  2
                )} × ${adults} = Rs. ${(adultFare * adults).toFixed(2)}</li>
                <li>Child Fare: Rs. ${childFare.toFixed(
                  2
                )} × ${children} = Rs. ${(childFare * children).toFixed(2)}</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="ticket-section trip-segments">
        <h2>🚉 Trip Segments</h2>
        ${segmentsHTML}
      </div>
      
      <div class="ticket-section additional-info">
        <h2>🧾 Trip Information</h2>
        <ul>
          <li><strong>From:</strong> ${startStationName}</li>
          <li><strong>To:</strong> ${endStationName}</li>
          <li><strong>Travel Date:</strong> ${formattedDate}</li>
          <li><strong>Departure Time:</strong> ${formatTime(
            tripData.departureTime
          )}</li>
          <li><strong>Arrival Time:</strong> ${formatTime(
            tripData.arrivalTime
          )}</li>
        </ul>
      </div>
      
      <div class="ticket-footer">
        <p>✅ Thank you for booking with Traventure!</p>
        <p>Let the journey begin 🚂✨</p>
      </div>
      
      <div class="actions">
        <button id="print-ticket" class="action-button">Print Ticket</button>
        <button id="export-pdf" class="action-button secondary">Export as PDF</button>
        <button id="remove-trip" class="action-button danger">Remove Trip</button>
      </div>
    </div>
  `;

  // Add event listeners for buttons
  document.getElementById("print-ticket").addEventListener("click", () => {
    window.print();
  });

  document.getElementById("export-pdf").addEventListener("click", () => {
    alert("Exporting PDF... This feature will be available soon.");
  });
  document.getElementById("remove-trip").addEventListener("click", () => {
    confirmTripRemoval(tripID);
  });
}

function confirmTripRemoval(tripID) {
  if (
    confirm(
      "Are you sure you want to remove this trip? This action is irreversible and the trip will be removed from your profile."
    )
  ) {
    removeTripFromProfile(tripID);
  }
}

async function removeTripFromProfile(tripID) {
  try {
    const response = await fetch("../../server/api/removeTrip.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tripID }),
    });

    const result = await response.json();

    if (result.success) {
      alert("Trip successfully removed from your profile.");
      window.location.href = "../userTrips/userTrips.html";
    } else {
      throw new Error(result.message || "Failed to remove trip");
    }
  } catch (error) {
    console.error("Error removing trip:", error);
    alert("Failed to remove trip: " + error.message);
  }
}

function displayError(message) {
  const tripContentElement = document.getElementById("trip-content");
  tripContentElement.innerHTML = `
    <div class="error-container">
      <h3>Oops! Something went wrong</h3>
      <p>${message}</p>
      <a href="../userTrips/userTrips.html" class="action-button">Back to My Trips</a>
    </div>
  `;
}
