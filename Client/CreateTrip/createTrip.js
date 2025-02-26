document.addEventListener("DOMContentLoaded", () => {
  const startStationSelect = document.getElementById("start-station");
  const endStationSelect = document.getElementById("end-station");
  const totalPassengersInput = document.getElementById("total-passengers");
  const childrenInput = document.getElementById("children");
  const adultsInput = document.getElementById("adults");
  const searchDateInput = document.getElementById("search-date");
  const searchButton = document.querySelector("button[type='button']");

  // Ensure elements are properly fetched
  if (
    !startStationSelect ||
    !endStationSelect ||
    !totalPassengersInput ||
    !childrenInput ||
    !adultsInput ||
    !searchDateInput ||
    !searchButton
  ) {
    console.error("One or more required elements are missing from the DOM.");
    return;
  }

  // Set the current date as the default value for the date input
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
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

  // Autofill logic for adults
  const autofillAdults = () => {
    const totalPassengers = parseInt(totalPassengersInput.value) || 0;
    const children = parseInt(childrenInput.value) || 0;

    if (children > totalPassengers) {
      alert("Number of children cannot exceed total passengers.");
      childrenInput.value = totalPassengers;
    }

    const adults = totalPassengers - (parseInt(childrenInput.value) || 0);
    adultsInput.value = adults >= 0 ? adults : 0;
  };

  // Add event listeners for inputs
  totalPassengersInput.addEventListener("input", () => {
    if (totalPassengersInput.value > 10) {
      alert("Total passengers cannot exceed 10.");
      totalPassengersInput.value = 10;
    }
    autofillAdults();
  });

  childrenInput.addEventListener("input", autofillAdults);

  // Handle button click for fetching train schedules
  searchButton.addEventListener("click", async () => {
    const startStation = startStationSelect.value;
    const endStation = endStationSelect.value;
    const searchDate = searchDateInput.value;
    const totalPassengers = totalPassengersInput.value;
    const children = childrenInput.value;
    const adults = adultsInput.value;

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

    // Save trip details to localStorage
    const tripData = {
      startStation,
      endStation,
      searchDate,
      totalPassengers,
      children,
      adults,
    };
    localStorage.setItem("tripData", JSON.stringify(tripData));

    try {
      // Fetch train details dynamically
      const response = await fetch("../../server/api/gettrains.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startStation, endStation, searchDate }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const trains = await response.json();

      if (trains && Array.isArray(trains)) {
        // Save train data in localStorage and redirect
        localStorage.setItem("trainData", JSON.stringify(trains));
        window.location.href = "../select train/selecttrain.html";
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

  let searchDate = document.getElementById("search-date");

  // Set the minimum date to today
  let todayy = new Date().toISOString().split("T")[0];
  searchDate.setAttribute("min", todayy);

  // Validate the date on change
  searchDate.addEventListener("change", function () {
    if (searchDate.value < todayy) {
      alert("You cannot select a past date.");
      searchDate.value = todayy;
    }
  });
});
