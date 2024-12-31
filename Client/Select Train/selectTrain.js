document.addEventListener("DOMContentLoaded", () => {
  // Fetch train data from localStorage
  const trainData = JSON.parse(localStorage.getItem("trainData"));

  const trainResultsContainer = document.getElementById("train-results");

  if (!trainData || trainData.length === 0) {
    trainResultsContainer.innerHTML =
      "<tr><td colspan='7'>No trains available.</td></tr>";
    return;
  }

  // Loop through the train data and populate the table
  trainData.forEach((train) => {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${train.departureTime}</td>
        <td>${train.arrivalTime}</td>
        <td>${train.duration}</td>
        <td>${train.endStation}</td>
        <td>${train.trainID}</td>
        <td>${train.type}</td>
        <td>
          <button class="select-train-btn" data-trainid="${train.trainID}">
            Select
          </button>
        </td>
      `;

    trainResultsContainer.appendChild(row);
  });

  // Add event listeners for "Select" buttons
  const selectButtons = document.querySelectorAll(".select-train-btn");
  selectButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const trainID = e.target.getAttribute("data-trainid");
      if (trainID) {
        // Save selected train to localStorage
        const tripData = JSON.parse(localStorage.getItem("tripData")) || {};
        tripData.trainID = trainID;
        localStorage.setItem("tripData", JSON.stringify(tripData));

        // Redirect to destinations page
        window.location.href = "../select destinations/selectdestinations.html";
      }
    });
  });
});
