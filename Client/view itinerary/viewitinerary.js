document.addEventListener("DOMContentLoaded", async () => {
  const tripData = JSON.parse(localStorage.getItem("tripData")) || {};
  const itinerary = JSON.parse(localStorage.getItem("itinerary")) || {};
  const selectedTrains =
    JSON.parse(localStorage.getItem("selectedTrains")) || [];

  const itineraryData = {
    ...tripData,
    ...itinerary,
  };

  const getStationName = async (stationID) => {
    if (!stationID) {
      console.log("No station ID provided");
      return "Not selected";
    }

    try {
      const response = await fetch(
        `../../server/api/getStationName.php?stationID=${stationID}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0 && data[0].name) {
        return data[0].name;
      } else if (data.name) {
        return data.name;
      } else {
        return `Station ${stationID}`;
      }
    } catch (error) {
      return `Station ${stationID}`;
    }
  };

  const itineraryContainer = document.getElementById("itinerary-container");

  // Handle fare calculation
  const start = parseInt(tripData.startStation);
  const end = parseInt(tripData.endStation);
  const difference = Math.abs(end - start);
  const travelClass = tripData.seatClass || "third"; // Using class from data or defaulting

  let farePerAdult = 2000; // Default values
  let farePerChild = 1400;
  let totalFare = 0;

  try {
    const response = await fetch(
      `http://localhost/traventure/server/api/getTicketFare.php?difference=${difference}&class=${travelClass}`
    );
    const data = await response.json();

    if (data.fare !== undefined) {
      farePerAdult = parseInt(data.fare);
      farePerChild = Math.floor(farePerAdult * 0.5);

      const adults = parseInt(itineraryData.adults) || 0;

      const children = parseInt(itineraryData.children) || 0;

      totalFare = adults * farePerAdult + children * farePerChild;
    }
  } catch (error) {
    console.error("Error fetching fare:", error);
    // Use default values if API fails
    const adults = parseInt(itineraryData.adults) || 0;
    const children = parseInt(itineraryData.children) || 0;
    totalFare = adults * farePerAdult + children * farePerChild;
  }

  // Prepare trip segments
  let segments = [];

  // First segment from selected trains
  if (selectedTrains.length > 0) {
    const firstTrain = selectedTrains[0];
    segments.push({
      trainID: firstTrain.trainID,
      trainName: firstTrain.name || "Express Service",
      originStationID: tripData.startStation,
      destinationStationID:
        tripData.segments && tripData.segments.length > 0
          ? tripData.segments[0].originStationID
          : undefined,
      departureTime: firstTrain.departureTime || "08:30:00",
      type: firstTrain.type || "Express",
    });
  }

  // Additional segments from tripData
  if (tripData.segments && tripData.segments.length > 0) {
    segments = [...segments, ...tripData.segments];
  }

  // Generate HTML for all segments
  let segmentsHTML = "";
  let segmentNumber = 1;

  for (const segment of segments) {
    const originName = await getStationName(segment.originStationID);
    const destinationName = await getStationName(segment.destinationStationID);
    const formattedTime = segment.departureTime?.substring(0, 5) || "00:00";

    segmentsHTML += `
      <div class="segment">
        <div class="segment-header">
          <span class="segment-number">🛤️ Segment ${segmentNumber}: ${originName} ➡️ ${destinationName}</span>
        </div>
        <div class="segment-details">
          <div><strong>Train ID:</strong> ${segment.trainID || "N/A"}</div>
          <div><strong>Train Name:</strong> ${
            selectedTrains[segmentNumber - 1].name || segment.type + " Service"
          }</div>
          <div><strong>Departure Time:</strong> ${formattedTime} ${
      formattedTime < "12:00" ? "AM" : "PM"
    }</div>
        </div>
      </div>
    `;
    segmentNumber++;
  }

  // Get start and end station names
  const startStationName = await getStationName(tripData.startStation);
  const endStationName = await getStationName(tripData.endStation);

  // Format date
  const formattedDate = tripData.searchDate
    ? new Date(tripData.searchDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not selected";

  // Build the complete itinerary HTML
  itineraryContainer.innerHTML = `
    <div class="ticket-container">
      <div class="ticket-header">
        <h1>🎟️ Your Train Trip Itinerary</h1>
        <div class="logo">Traventure</div>
      </div>
      
      <div class="ticket-section passenger-details">
        <h2>👤 Passenger Details</h2>
        <ul>
          <li><strong>Adults:  </strong> ${itineraryData.adults || 0}</li>
          <li><strong>Children:  </strong> ${itineraryData.children || 0}</li>
          <li><strong>Ticket Class:  </strong> ${travelClass}</li>
          <li class="fare-details">
            <strong>Total Fare:</strong> Rs. ${totalFare.toFixed(2)}
            <ul class="fare-breakdown">
              <li>Adult Fare: Rs. ${farePerAdult} × ${
    itineraryData.adults || 0
  } = Rs. ${(farePerAdult * (itineraryData.adults || 0)).toFixed(2)}</li>
              <li>Child Fare: Rs. ${farePerChild} × ${
    itineraryData.children || 0
  } = Rs. ${(farePerChild * (itineraryData.children || 0)).toFixed(2)}</li>
            </ul>
          </li>
        </ul>
      </div>
      
      <div class="ticket-section trip-segments">
        <h2>🚉 Trip Segments</h2>
        ${segmentsHTML}
      </div>
      
      <div class="ticket-section additional-info">
        <h2>🧾 Additional Info</h2>
        <ul>
          <li>Please be at the station at least 20 minutes before departure.</li>
          <li>Carry a valid ID to verify your booking.</li>
          <li>This ticket is non-refundable and non-transferable.</li>
          <li>Travel Date: ${formattedDate}</li>
        </ul>
      </div>
      
      <div class="ticket-footer">
        <p>✅ Thank you for booking with Traventure!</p>
        <p>Let the journey begin 🚂✨</p>
      </div>
      
      <div class="actions">
        <button id="save-itinerary" class="action-button">Save Itinerary</button>
        <button id="export-pdf" class="action-button">Export PDF</button>
        <button id="print-ticket" class="action-button">Print Ticket</button>
      </div>
    </div>
  `;

  // Add event listeners for buttons
  document.getElementById("save-itinerary").addEventListener("click", () => {
    alert("Itinerary saved successfully!");
  });

  document.getElementById("export-pdf").addEventListener("click", () => {
    alert("Exporting PDF... This feature will be available soon.");
  });

  document.getElementById("print-ticket").addEventListener("click", () => {
    window.print();
  });
});
