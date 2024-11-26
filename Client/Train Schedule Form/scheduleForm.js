document.addEventListener("DOMContentLoaded", () => {
  const startStationSelect = document.getElementById("start-station");
  const endStationSelect = document.getElementById("end-station");
  const searchDateInput = document.getElementById("search-date");
  const searchButton = document.querySelector("button[type='button']");

  // Ensure elements are properly fetched
  if (
    !startStationSelect ||
    !endStationSelect ||
    !searchDateInput ||
    !searchButton
  ) {
    console.error("One or more required elements are missing from the DOM.");
    return;
  }

  // Fetch stations from the backend
  const fetchStations = async () => {
    try {
      const response = await fetch("../../server/api/getstations.php");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const stations = await response.json();

      if (stations && Array.isArray(stations)) {
        stations.forEach((station) => {
          const optionStart = document.createElement("option");
          optionStart.value = station.StationID;
          optionStart.textContent = `${station.name} (${station.city})`;

          const optionEnd = optionStart.cloneNode(true);

          startStationSelect.appendChild(optionStart);
          endStationSelect.appendChild(optionEnd);
        });
      } else {
        console.error("Unexpected data format from the API:", stations);
      }
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  };

  fetchStations();

  // Disable selected station in the other dropdown
  const handleStationSelection = (changedSelect, otherSelect) => {
    const selectedValue = changedSelect.value;

    Array.from(otherSelect.options).forEach((option) => {
      option.disabled = option.value === selectedValue;
    });
  };

  startStationSelect.addEventListener("change", () => {
    handleStationSelection(startStationSelect, endStationSelect);
  });

  endStationSelect.addEventListener("change", () => {
    handleStationSelection(endStationSelect, startStationSelect);
  });

  // Handle button click for fetching train schedules
  searchButton.addEventListener("click", async () => {
    const startStation = startStationSelect.value;
    const endStation = endStationSelect.value;
    const searchDate = searchDateInput.value;

    // Validate inputs
    if (
      startStation === "--Select--" ||
      endStation === "--Select--" ||
      !searchDate
    ) {
      alert("Please select a valid start station, end station, and date.");
      return;
    }

    if (startStation === endStation) {
      alert("Start station and end station cannot be the same.");
      return;
    }

    try {
      // Fetch train details dynamically
      const response = await fetch("../../server/api/gettrains.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startStation, endStation, searchDate }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const trains = await response.json();

      if (trains && Array.isArray(trains)) {
        // Store the train data in localStorage and redirect
        localStorage.setItem("trainData", JSON.stringify(trains));

        // Redirect to the results page
        window.location.href = "../train schedule/trainschedule.html";
      } else {
        alert("No trains found for the selected criteria.");
      }
    } catch (error) {
      console.error("Error fetching trains:", error);
      alert(
        "An error occurred while fetching train schedules. Please try again."
      );
    }
  });
});
