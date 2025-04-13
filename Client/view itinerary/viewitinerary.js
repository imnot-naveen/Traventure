document.addEventListener("DOMContentLoaded", async () => {
  const tripData = JSON.parse(localStorage.getItem("tripData")) || {};
  const itinerary = JSON.parse(localStorage.getItem("itinerary")) || {};

  const itineraryData = {
    ...tripData,
    ...itinerary,
  };

  const itineraryContainer = document.getElementById("itinerary-container");

  const start = parseInt(itineraryData.startStation);
  const end = parseInt(itineraryData.endStation);
  const difference = Math.abs(end - start);
  const travelClass = "third"; // hardcoded for now

  let farePerAdult = 0;
  let farePerChild = 0;
  let totalFare = 0;

  try {
    const response = await fetch(
      `http://localhost/traventure/server/api/getTicketFare.php?difference=${difference}&class=${travelClass}`
    );
    const data = await response.json();

    if (data.fare !== undefined) {
      farePerAdult = parseInt(data.fare);
      farePerChild = Math.floor(farePerAdult / 2);

      const adults = parseInt(itineraryData.adults) || 0;
      const children = parseInt(itineraryData.children) || 0;

      totalFare = adults * farePerAdult + children * farePerChild;
    }
  } catch (error) {
    console.error("Error fetching fare:", error);
  }

  itineraryContainer.innerHTML = `
    <h2>Your Itinerary</h2>
    <p><strong>Start Station:</strong> ${
      itineraryData.startStation || "Not selected"
    }</p>
    <p><strong>End Station:</strong> ${
      itineraryData.endStation || "Not selected"
    }</p>
    <p><strong>Date:</strong> ${itineraryData.searchDate || "Not selected"}</p>
    <p><strong>Passengers:</strong> ${itineraryData.totalPassengers || 0} 
        (${itineraryData.adults || 0} Adults, ${
    itineraryData.children || 0
  } Children)</p>
    <p><strong>Selected Train:</strong> ${
      itineraryData.trainID || "Not selected"
    }</p>
    <p><strong>Destinations:</strong> ${
      itineraryData.destinations
        ? itineraryData.destinations.join(", ")
        : "None selected"
    }</p>
    <p><strong>Class:</strong> ${travelClass}</p>
    <p><strong>Fare:</strong> Rs. ${farePerAdult} per adult, Rs. ${farePerChild} per child</p>
    <p><strong>Total Fare:</strong> Rs. ${totalFare}</p>
  `;
});
