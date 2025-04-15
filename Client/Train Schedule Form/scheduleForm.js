document.addEventListener("DOMContentLoaded", () => {
  // Get elements for station-based search
  const startStationSelect = document.getElementById("start-station");
  const endStationSelect = document.getElementById("end-station");
  const searchDateInput = document.getElementById("search-date");

  // Get element for train name search
  const trainNameInput = document.getElementById("train-name");

  // Get common search button
  const searchButton = document.getElementById("search-button");

  // Ensure essential elements are properly fetched
  if (!searchDateInput || !searchButton) {
    console.error("Essential elements are missing from the DOM.");
    return;
  }

  // Set the current date as the default value for the date input
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0]; // Format to YYYY-MM-DD
  searchDateInput.value = formattedDate;

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

  // Initialize stations if they exist in the DOM
  if (startStationSelect && endStationSelect) {
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
  }

  // Date validation
  let todayStr = new Date().toISOString().split("T")[0];
  searchDateInput.setAttribute("min", todayStr);

  // Validate the date on change
  searchDateInput.addEventListener("change", function () {
    if (searchDateInput.value < todayStr) {
      alert("You cannot select a past date.");
      searchDateInput.value = todayStr;
    }
  });

  // Handle button click for searches
  searchButton.addEventListener("click", async () => {
    const trainNameValue = trainNameInput ? trainNameInput.value.trim() : "";

    // Check if search by train name
    if (trainNameValue !== "") {
      // Search by train name
      try {
        // First, get the train ID from the name
        const response = await fetch(
          `../../server/api/getTrainIdByName.php?trainName=${encodeURIComponent(
            trainNameValue
          )}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const trainData = await response.json();

        if (trainData.error) {
          alert(trainData.error);
          return;
        }

        // Redirect to train details page with the trainID
        window.location.href = `../train details/traindetails.html?trainNo=${trainData.trainID}`;
      } catch (error) {
        console.error("Error searching by train name:", error);
        alert(
          "An error occurred while searching for the train. Please try again."
        );
      }
    }
    // Otherwise check if station search is being used
    else if (startStationSelect && endStationSelect) {
      const startStation = startStationSelect.value;
      const endStation = endStationSelect.value;
      const searchDate = searchDateInput.value;

      // Validate station search inputs
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
        // Fetch train schedules
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
    } else {
      // If neither search method has valid inputs
      alert("Please either enter a train name or select stations to search.");
    }
  });
});