document.addEventListener("DOMContentLoaded", () => {
  // Retrieve train ID from localStorage
  const tripData = JSON.parse(localStorage.getItem("tripData"));

  if (!tripData || !tripData.trainID) {
    alert("Train ID is missing! Please select a train first.");
    window.location.href = "../select train/selecttrain.html"; // Redirect if train ID is not found
    return;
  }

  const trainID = tripData.trainID;

  // Fetch destinations based on trainID
  fetch(`../../server/api/getTrainDestinations.php?trainID=${trainID}`)
    .then((response) => response.json())
    .then((data) => renderDestinations(data))
    .catch((error) => console.error("Error:", error));
});

function renderDestinations(destinations) {
  const destinationList = document.getElementById("destination-list");
  destinationList.innerHTML = ""; // Clear previous content

  if (!destinations || destinations.length === 0) {
    destinationList.innerHTML =
      "<p>No destinations available along this route.</p>";
    return;
  }

  destinations.forEach((destination, index) => {
    const destinationItem = document.createElement("div");
    destinationItem.className = "destination-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = destination.name;
    checkbox.id = `destination-${index}`;
    destinationItem.appendChild(checkbox);

    const label = document.createElement("label");
    label.htmlFor = `destination-${index}`;
    label.innerHTML = `
      <div class="destination-number">${index + 1}</div>
      <div class="destination-title">${destination.name}</div>
    `;
    destinationItem.appendChild(label);

    destinationList.appendChild(destinationItem);
  });

  const submitButton = document.createElement("button");
  submitButton.id = "submit-selections";
  submitButton.textContent = "Proceed to View Itinerary";
  destinationList.appendChild(submitButton);

  // Add the event listener for the dynamically created button here
  submitButton.addEventListener("click", () => {
    const selectedDestinations = Array.from(
      document.querySelectorAll(".destination-item input:checked")
    ).map((checkbox) => checkbox.value);

    if (selectedDestinations.length === 0) {
      alert("Please select at least one destination.");
      return;
    }

    // Save selected destinations to localStorage
    const itinerary = JSON.parse(localStorage.getItem("itinerary")) || {};
    itinerary.destinations = selectedDestinations;
    localStorage.setItem("itinerary", JSON.stringify(itinerary));

    // Redirect to the itinerary view page
    window.location.href = "../view itinerary/viewitinerary.html";
  });
}
