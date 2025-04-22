document.addEventListener("DOMContentLoaded", () => {
  // Fetch train data from localStorage
  const trainData = JSON.parse(localStorage.getItem("trainData")) || [];
  const trainResultsContainer = document.getElementById("train-results");

  // Array to store selected trains (trainID and departure time)
  let selectedTrains = JSON.parse(localStorage.getItem("selectedTrains")) || [];

  const renderTrains = (data) => {
    trainResultsContainer.innerHTML = ""; // Clear existing rows

    if (data.length === 0) {
      trainResultsContainer.innerHTML =
        "<tr><td colspan='7'>No trains available.</td></tr>";
      return;
    }

    // Loop through the train data and populate the table
    data.forEach((train) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${train.departureTime}</td>
        <td>${train.arrivalTime}</td>
        <td>${train.duration}</td>
        <td>${train.endStation}</td>
        <td>${train.trainID}</td>
        <td>${train.type}</td>
        <td>
          <button class="select-train-btn" data-trainid="${train.trainID}" data-departure="${train.departureTime}" data-arrival="${train.arrivalTime}" data-name="${train.name}">
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
        const departureTime = e.target.getAttribute("data-departure");
        const name = e.target.getAttribute("data-name");
        const arrivalTime = e.target.getAttribute("data-arrival");

        if (trainID) {
          // Save selected train to localStorage
          const tripData = JSON.parse(localStorage.getItem("tripData")) || {};
          tripData.trainID = trainID;
          localStorage.setItem("tripData", JSON.stringify(tripData));

          // Add selected train info to the array
          selectedTrains.push({
            trainID: trainID,
            departureTime: departureTime,
            name: name,
            arrivalTime: arrivalTime,
          });

          // Save the updated array to localStorage
          localStorage.setItem(
            "selectedTrains",
            JSON.stringify(selectedTrains)
          );

          // Redirect to destinations page
          window.location.href =
            "../select destinations/selectdestinations.html";
        }
      });
    });
  };

  // Initial render
  renderTrains(trainData);

  // Filter by train type
  const filterSelect = document.getElementById("train-type-filter");
  filterSelect.addEventListener("change", () => {
    const selectedType = filterSelect.value;
    const filteredTrains = selectedType
      ? trainData.filter((train) => train.type === selectedType)
      : trainData;
    renderTrains(filteredTrains);
  });

  // Sort by departure time
  document.getElementById("sort-departure").addEventListener("click", () => {
    const sortedTrains = [...trainData].sort(
      (a, b) => new Date(a.departureTime) - new Date(b.departureTime)
    );
    renderTrains(sortedTrains);
  });

  // Sort by arrival time
  document.getElementById("sort-arrival").addEventListener("click", () => {
    const sortedTrains = [...trainData].sort(
      (a, b) => new Date(a.arrivalTime) - new Date(b.arrivalTime)
    );
    renderTrains(sortedTrains);
  });
});
