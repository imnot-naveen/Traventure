document.addEventListener("DOMContentLoaded", () => {
  const startStationSelect = document.getElementById("start-station");
  const endStationSelect = document.getElementById("end-station");
  const searchDateInput = document.getElementById("search-date");
  const trainNameInput = document.getElementById("train-name");
  const searchButton = document.getElementById("search-button");

  if (!startStationSelect || !endStationSelect || !searchDateInput || !searchButton) {
    console.error("One or more required elements are missing from the DOM.");
    return;
  }

  // Set current date
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  searchDateInput.value = todayStr;
  searchDateInput.setAttribute("min", todayStr);

  // LocalStorage saved values
  const savedStartStation = localStorage.getItem("startStation");
  const savedEndStation = localStorage.getItem("endStation");

  // Station selection handling
  const handleStationSelection = (changedSelect, otherSelect) => {
    const selectedValue = changedSelect.value;
    Array.from(otherSelect.options).forEach((option) => {
      option.disabled = option.value === selectedValue;
    });
  };

  // Fetch stations
  const fetchStations = async () => {
    try {
      const res = await fetch("../../server/api/getstations.php");
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  
      const stations = await res.json();
  
      if (Array.isArray(stations)) {
        // Clear existing options
        startStationSelect.innerHTML = '';
        endStationSelect.innerHTML = '';
  
        // Add placeholder option
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "--Select--";
        defaultOption.disabled = true;
        defaultOption.selected = true;
  
        startStationSelect.appendChild(defaultOption.cloneNode(true));
        endStationSelect.appendChild(defaultOption.cloneNode(true));
  
        stations.forEach((station) => {
          const optionStart = document.createElement("option");
          optionStart.value = station.StationID;
          optionStart.textContent = `${station.name} (${station.city})`;
  
          const optionEnd = optionStart.cloneNode(true);
  
          startStationSelect.appendChild(optionStart);
          endStationSelect.appendChild(optionEnd);
        });
  
        // Restore previously selected stations (if they still exist)
        if (savedStartStation && startStationSelect.querySelector(`option[value="${savedStartStation}"]`)) {
          startStationSelect.value = savedStartStation;
        }
        if (savedEndStation && endStationSelect.querySelector(`option[value="${savedEndStation}"]`)) {
          endStationSelect.value = savedEndStation;
        }
  
        // Apply disable logic if needed
        if (savedStartStation) handleStationSelection(startStationSelect, endStationSelect);
        if (savedEndStation) handleStationSelection(endStationSelect, startStationSelect);
  
      } else {
        console.error("Unexpected station format:", stations);
      }
    } catch (err) {
      console.error("Error fetching stations:", err);
    }
  };  

  fetchStations();

  // Listeners to save selection and handle disabling
  startStationSelect.addEventListener("change", () => {
    localStorage.setItem("startStation", startStationSelect.value);
    handleStationSelection(startStationSelect, endStationSelect);
  });

  endStationSelect.addEventListener("change", () => {
    localStorage.setItem("endStation", endStationSelect.value);
    handleStationSelection(endStationSelect, startStationSelect);
  });

  // Date validation
  searchDateInput.addEventListener("change", function () {
    if (searchDateInput.value < todayStr) {
      alert("You cannot select a past date.");
      searchDateInput.value = todayStr;
    }
  });

  // Search logic
  searchButton.addEventListener("click", async () => {
    const trainName = trainNameInput ? trainNameInput.value.trim() : "";

    if (trainName !== "") {
      // Train name search
      try {
        const response = await fetch(
          `../../server/api/getTrainIdByName.php?trainName=${encodeURIComponent(trainName)}`
        );

        const data = await response.json();

        if (data.error) {
          alert(data.error);
        } else {
          window.location.href = `../train details/traindetails.html?trainNo=${data.trainID}`;
        }
      } catch (err) {
        console.error("Train search error:", err);
        alert("An error occurred while searching for the train.");
      }
    } else {
      // Station search
      const startStation = startStationSelect.value;
      const endStation = endStationSelect.value;
      const searchDate = searchDateInput.value;

      if (
        startStation === "--Select--" ||
        endStation === "--Select--" ||
        !searchDate
      ) {
        alert("Please select valid start/end stations and a date.");
        return;
      }

      if (startStation === endStation) {
        alert("Start and end stations cannot be the same.");
        return;
      }

      try {
        const response = await fetch("../../server/api/gettrains.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ startStation, endStation, searchDate }),
        });

        const trains = await response.json();

        if (Array.isArray(trains)) {
          localStorage.setItem("trainData", JSON.stringify(trains));
          window.location.href = "../train schedule/trainschedule.html";
        } else {
          alert("No trains found for the selected criteria.");
        }
      } catch (err) {
        console.error("Station-based search error:", err);
        alert("Error fetching train schedules.");
      }
    }
  });
});