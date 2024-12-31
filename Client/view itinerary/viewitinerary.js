document.addEventListener("DOMContentLoaded", () => {
  const tripData = JSON.parse(localStorage.getItem("tripData")) || {};
  const itinerary = JSON.parse(localStorage.getItem("itinerary")) || {};

  const itineraryData = {
    ...tripData,
    ...itinerary,
  };

  const itineraryContainer = document.getElementById("itinerary-container");

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
  `;
});
