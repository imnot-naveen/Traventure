document.addEventListener("DOMContentLoaded", async () => {
  const tripData = JSON.parse(localStorage.getItem("tripData")) || {};
  const itinerary = JSON.parse(localStorage.getItem("itinerary")) || {};
  const selectedTrains =
    JSON.parse(localStorage.getItem("selectedTrains")) || [];

  console.log("Trip Data:", tripData);
  console.log("Selected Trains:", selectedTrains);

  const itineraryData = {
    ...tripData,
    ...itinerary,
  }; 

  async function getUserIDFromSession() {
    try {
        const response = await fetch('http://localhost/Traventure/Server/api/getUserId.php', {
            method: 'GET',
            credentials: 'include' 
        });
  
        const data = await response.json();
  
        if (response.ok && data.success) {
            return data.userID;
        } else {
            throw new Error(data.message || "Not logged in");
        }
    } catch (error) {
        console.error("Error fetching user ID:", error);
        return null;
    }
  }

  // Get user details
  let userData = { full_name: "Guest User", id_number: "Not available" };
  try {
    userData = await getUserDetails();
  } catch (error) {
    console.error("Error fetching user details:", error);
  }

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
        console.log(`No name found for station ${stationID}`);
        return `Station ${stationID}`;
      }
    } catch (error) {
      console.error(`Error fetching station name for ID ${stationID}:`, error);
      return `Station ${stationID}`;
    }
  };

  // Function to get user details
  async function getUserDetails() {
    try {
      const response = await fetch("../../server/api/getuserdetails.php");
      const data = await response.json();
      if (data.error) {
        console.error("Error:", data.error);
        return { full_name: "Guest User", id_number: "Not available" };
      } else {
        return data;
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      return { full_name: "Guest User", id_number: "Not available" };
    }
  }

  const itineraryContainer = document.getElementById("itinerary-container");

  // Updated fare calculation with the new API endpoint and logic
  const fromStationId = tripData.startStation;
  const toStationId = tripData.endStation;
  const travelClass = tripData.seatClass || "First Class"; // Using class from data or defaulting
  const adults = parseInt(itineraryData.adults) || 0;
  const children = parseInt(itineraryData.children) || 0;
  const totalPassengerCount = adults + children;

  let farePerPassenger = 0;
  let totalFare = 0;

  try {
    const response = await fetch(
      `http://localhost/Traventure/Server/api/calculateFare.php?from=${fromStationId}&to=${toStationId}&class=${travelClass}`
    );
    
    if (response.ok) {
      const data = await response.json();
      
      if (data && "total_fare" in data) {
        farePerPassenger = data.total_fare;
        // Calculate total fare: adults pay full fare, children pay half fare
        totalFare = farePerPassenger * (adults + children * 0.5);
      } else {
        console.error('Error: No fare details returned.');
        // Use default values if API fails
        farePerPassenger = 2000;
        totalFare = farePerPassenger * (adults + children * 0.5);
      }
    } else {
      console.error("API Error:", "Error calculating fare.");
      // Use default values if API fails
      farePerPassenger = 2000;
      totalFare = farePerPassenger * (adults + children * 0.5);
    }
  } catch (error) {
    console.error("Error fetching fare:", error);
    // Use default values if API fails
    farePerPassenger = 2000;
    totalFare = farePerPassenger * (adults + children * 0.5);
  }

  // Generate booking reference for display purposes only
  // We'll get the actual one from the server after saving
  const temporaryBookingReference = `TV-${Date.now().toString().substring(6)}`;

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

  // Get trip ID from localStorage or use a placeholder
  const tripID = localStorage.getItem("tripID") || "pending";
  
  // Get the userID for the client ID in ride requests
  const userID = await getUserIDFromSession();

  // Generate HTML for all segments
  let segmentsHTML = "";
  let segmentNumber = 1;
  const totalSegments = segments.length;

  for (const segment of segments) {
    const originName = await getStationName(segment.originStationID);
    const destinationName = await getStationName(segment.destinationStationID);
    const formattedTime = segment.departureTime?.substring(0, 5) || "00:00";

    // Create a JSON string of the segment data for the button
    const segmentData = JSON.stringify({
      clientID: userID,
      destination: destinationName,
      stationID: segment.destinationStationID,
      tripID: tripID,
      rideDate: tripData.searchDate || new Date().toISOString().split('T')[0],
      originStationID: segment.originStationID,
      originName: originName,
      departureTime: segment.departureTime,
      trainID: segment.trainID,
      trainName: selectedTrains[segmentNumber - 1]?.name || segment.type + " Service",
      segmentNumber: segmentNumber
    });

    // Add the "Request a Ride" button to all segments except the last one
    const requestRideButton = segmentNumber < totalSegments 
      ? `<button class="request-ride-button action-button" data-segment='${segmentData}'>Request a Ride</button>`
      : '';

    segmentsHTML += `
      <div class="segment">
        <div class="segment-header">
          <span class="segment-number">🛤️ Segment ${segmentNumber}: ${originName} ➡️ ${destinationName}</span>
        </div>
        <div class="segment-details">
          <div><strong>Train ID:</strong> ${segment.trainID || "N/A"}</div>
          <div><strong>Train Name:</strong> ${
            selectedTrains[segmentNumber - 1]?.name || segment.type + " Service"
          }</div>
          <div><strong>Departure Time:</strong> ${formattedTime} ${
      formattedTime < "12:00" ? "AM" : "PM"
    }</div>
          ${requestRideButton}
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
        <div class="booking-reference">Booking #${temporaryBookingReference}</div>
      </div>
      
      <div class="ticket-section passenger-details">
        <h2>👤 Passenger Details</h2>
        <ul>
          <li><strong>Passenger Name:</strong> ${userData.full_name}</li>
          <li><strong>ID Number:</strong> ${userData.id_number}</li>
          <li><strong>Adults:</strong> ${itineraryData.adults || 0}</li>
          <li><strong>Children:</strong> ${itineraryData.children || 0}</li>
          <li><strong>Ticket Class:</strong> ${travelClass}</li>
          <li class="fare-details">
            <strong>Total Fare:</strong> Rs. ${totalFare.toFixed(2)}
            <ul class="fare-breakdown">
              <li>Adult Fare: Rs. ${farePerPassenger.toFixed(2)} × ${
    itineraryData.adults || 0
  } = Rs. ${(farePerPassenger * (itineraryData.adults || 0)).toFixed(2)}</li>
              <li>Child Fare: Rs. ${(farePerPassenger * 0.5).toFixed(2)} × ${
    itineraryData.children || 0
  } = Rs. ${(farePerPassenger * 0.5 * (itineraryData.children || 0)).toFixed(2)}</li>
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
        <button id="book-ticket" class="action-button primary-button">Book Ticket</button>
        <button id="save-itinerary" class="action-button">Save Itinerary</button>
        <button id="export-pdf" class="action-button">Export PDF</button>
        <button id="print-ticket" class="action-button">Print Ticket</button>
      </div>
    </div>
  `;

  // Function to save itinerary and return trip ID and booking reference
  async function saveItinerary() {
    try {
      // Get all necessary data
      const tripData = JSON.parse(localStorage.getItem("tripData")) || {};
      const itinerary = JSON.parse(localStorage.getItem("itinerary")) || {};
      const selectedTrains =
        JSON.parse(localStorage.getItem("selectedTrains")) || [];

      // Get user details
      let userData = {
        full_name: "Guest User",
        id_number: "Not available",
        username: " ",
      };
      try {
        userData = await getUserDetails();
      } catch (error) {
        console.error("Error fetching user details:", error);
      }

      const username = userData.username;

      // Use the updated fare calculation
      const adultFare = farePerPassenger;
      const childFare = farePerPassenger * 0.5;
      const adults = parseInt(tripData.adults) || 1;
      const children = parseInt(tripData.children) || 0;
      const totalFare = adults * adultFare + children * childFare;

      // Prepare data for API
      const bookingData = {
        startStation: tripData.startStation,
        endStation: tripData.endStation,
        departureTime:
          selectedTrains.length > 0
            ? selectedTrains[0].departureTime
            : "08:00:00",
        arrivalTime:
          selectedTrains.length > 0
            ? selectedTrains[selectedTrains.length - 1].arrivalTime
            : "10:00:00",
        username: username,
        adults: tripData.adults,
        children: tripData.children,
        date: tripData.searchDate,
        seatClass: tripData.seatClass,
        // Include fare information
        adultFare: adultFare,
        childFare: childFare,
        totalFare: totalFare,
        // Include user details
        passengerName: userData.full_name,
        passengerID: userData.id_number,
        selectedTrains: selectedTrains.map((train) => ({
          trainID: train.trainID,
          originStationID: train.originStationID || tripData.startStation,
          destinationStationID:
            train.destinationStationID || tripData.endStation,
          departureTime: train.departureTime,
        })),
        destinations: tripData.stopovers || [],
      };

      console.log("Sending booking data:", bookingData);
      // Call the API
      const response = await fetch("../../server/api/saveTrip.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (result.success) {
        // Store trip ID in local storage
        localStorage.setItem("tripID", result.tripID);
        
        return {
          success: true,
          tripID: result.tripID,
          message: result.message
        };
      } else {
        return {
          success: false,
          message: result.message || "Failed to save trip"
        };
      }
    } catch (error) {
      console.error("Error saving itinerary:", error);
      return {
        success: false,
        message: "An error occurred while saving the trip"
      };
    }
  }

  // Add event listeners for buttons
  document.getElementById("save-itinerary").addEventListener("click", async () => {
    const result = await saveItinerary();
    
    if (result.success) {
      alert("Itinerary saved successfully!");
    } else {
      alert(`Error: ${result.message}`);
    }
  });

  // Book ticket button handler - now handles the entire flow
  document.getElementById("book-ticket").addEventListener("click", async () => {
    try {
      // First check if we need to save the trip
      const savedTripID = localStorage.getItem("tripID");
      let tripID = savedTripID;
      
      if (!tripID) {
        // Trip needs to be saved first
        console.log("Trip not saved yet, saving now...");
        const saveResult = await saveItinerary();
        
        if (!saveResult.success) {
          throw new Error(`Failed to save trip: ${saveResult.message}`);
        }
        
        tripID = saveResult.tripID;
      }
      
      // Now proceed to payment using Stripe API
      const paymentData = {
        amount: totalFare,
        tripID: tripID,
        // Include additional booking details needed for creating a booking record
        bookingDetails: {
          userID: await getUserIDFromSession(),
          trainID: selectedTrains.length > 0 ? selectedTrains[0].trainID : null,
          start_station: tripData.startStation,
          destination_station: tripData.endStation,
          class: tripData.seatClass,
          no_of_passengers: adults,
          kidsCount: children,
          total_fare: totalFare,
          paymentMethod: "Card",
          paymentStatus: "Pending", // Will be updated to "Paid" after successful payment
          bookingDate: new Date().toISOString().split("T")[0]
        } 
      };
      
      console.log("Sending payment data to Stripe:", paymentData);
      
      // Call your Stripe session creation API with the updated structure
      const response = await fetch("../../server/api/create_checkout_session.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.id) {
        // Store booking ID in local storage if available
        if (result.bookingID) {
          localStorage.setItem("bookingID", result.bookingID);
        }
        
        // Redirect to Stripe Checkout using the session ID
        const stripe = Stripe('pk_test_51RCy68QwgaoFWhBRVwTGwX9QkMDGiSKTNE1QGHYnM4YqSSTeIgdIlCTw34rqwYcIJxKT1jfXr6fkl5SM3ABac2mY00iwkPeUmO'); 
        stripe.redirectToCheckout({
          sessionId: result.id
        }).then(function (result) {
          if (result.error) {
            alert(result.error.message);
          }
        });
      } else if (result.error) {
        throw new Error(result.error);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert(`Payment processing failed: ${error.message}`);
    }
  });

  // Store booking details in localStorage for potential use elsewhere
  const bookingDetails = {
    userID: await getUserIDFromSession(),
    trainID: selectedTrains.length > 0 ? selectedTrains[0].trainID : null,
    start_station: tripData.startStation,
    destination_station: tripData.endStation,
    class: tripData.seatClass,
    no_of_passengers: parseInt(tripData.adults) || 0, 
    kidsCount: parseInt(tripData.children) || 0,
    total_fare: totalFare,
    paymentMethod: "Card",
    paymentStatus: "Pending", // Will be updated after successful payment
    bookingDate: new Date().toISOString().split("T")[0]
  };

  localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
  console.log(bookingDetails);

  document.getElementById("export-pdf").addEventListener("click", () => {
    alert("Exporting PDF... This feature will be available soon.");
  });

  document.getElementById("print-ticket").addEventListener("click", () => {
    window.print();
  });

  // Add event listener for "Request a Ride" buttons
// Update the event listener for "Request a Ride" buttons to ensure trip exists first
document.querySelectorAll(".request-ride-button").forEach(button => {
  button.addEventListener("click", async function() {
    try {
      // Parse the segment data
      const segmentData = JSON.parse(this.getAttribute("data-segment"));
      console.log("Requesting ride for segment:", segmentData);
      
      // Check if we have a valid trip ID
      let tripID = segmentData.tripID;
      
      // If tripID is "pending" or not valid, save the trip first
      if (!tripID || tripID === "pending") {
        // Show loading indicator
        this.textContent = "Saving trip...";
        this.disabled = true;
        
        // Call the saveItinerary function to create the trip first
        const saveResult = await saveItinerary();
        
        if (!saveResult.success) {
          throw new Error(`Failed to save trip before requesting ride: ${saveResult.message}`);
        }
        
        // Update the tripID with the new one
        tripID = saveResult.tripID;
        segmentData.tripID = tripID;
      }
      
      // Get the segment number to identify the appropriate stopover
      const segmentNumber = segmentData.segmentNumber;
      
      // Find the corresponding stopover for this segment
      const destinationPlace = tripData.stopovers[segmentNumber - 1]?.name || 
                               "Unknown destination";
      
      // Extract required data for the API call
      const rideRequestData = {
        clientID: segmentData.clientID,
        destination: destinationPlace,
        passengerCount: totalPassengerCount,
        stationID: segmentData.stationID,
        tripID: tripID, // Using confirmed tripID
        rideDate: segmentData.rideDate
      };

      console.log("Sending ride request data:", rideRequestData);
      
      // Show loading indicator
      this.textContent = "Requesting...";
      this.disabled = true;
      
      // Call the ride request API
      const response = await fetch("../../server/api/createRidereq.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }, 
        body: JSON.stringify(rideRequestData)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Show success message
        alert(`Ride request created successfully! ${result.message || ''}`);
        this.textContent = "Ride Requested ✓";
        this.classList.add("request-success");
        
        // Store the tripID in localStorage since it might have been updated
        localStorage.setItem("tripID", tripID);
      } else {
        // Show error message
        alert(`Error: ${result.message || 'Failed to create ride request'}`);
        this.textContent = "Request a Ride";
        this.disabled = false;
      }
    } catch (error) {
      console.error("Error processing ride request:", error);
      alert("Failed to process ride request. Please try again.");
      this.textContent = "Request a Ride";
      this.disabled = false;
    }
  });
});
});