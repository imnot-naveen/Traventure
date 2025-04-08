document.addEventListener("DOMContentLoaded", () => {
  const startStationSelect = document.getElementById("start-station");
  const endStationSelect = document.getElementById("end-station");
  const totalPassengersInput = document.getElementById("total-passengers");
  const childrenInput = document.getElementById("children");
  const adultsInput = document.getElementById("adults");
  const searchDateInput = document.getElementById("search-date");
  const searchButton = document.querySelector("button[type='button']");

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

  // Set the current date as default and prevent past dates
  const today = new Date().toISOString().split("T")[0];
  searchDateInput.setAttribute("min", today);
  searchDateInput.value = today;

  searchDateInput.addEventListener("change", function () {
    if (searchDateInput.value < today) {
      alert("You cannot select a past date.");
      searchDateInput.value = today;
    }
  });

  // Fetch stations dynamically
  const fetchStations = async () => {
    try {
      const response = await fetch("../../server/api/getstations.php");
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

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

  startStationSelect.addEventListener("change", () =>
    handleStationSelection(startStationSelect, endStationSelect)
  );
  endStationSelect.addEventListener("change", () =>
    handleStationSelection(endStationSelect, startStationSelect)
  );

  // Update total passengers based on adults and children
  const updateTotalPassengers = () => {
    const adults = parseInt(adultsInput.value) || 0;
    const children = parseInt(childrenInput.value) || 0;
    totalPassengersInput.value = adults + children;
  };

  // Adjust adults/children when total passengers change
  totalPassengersInput.addEventListener("input", () => {
    let totalPassengers = parseInt(totalPassengersInput.value) || 0;
    if (totalPassengers > 10) {
      alert("Total passengers cannot exceed 10.");
      totalPassengers = 10;
      totalPassengersInput.value = 10;
    }

    if (
      totalPassengers <
      (parseInt(adultsInput.value) || 0) + (parseInt(childrenInput.value) || 0)
    ) {
      alert(
        "Total passengers cannot be less than the sum of adults and children."
      );
      totalPassengersInput.value =
        (parseInt(adultsInput.value) || 0) +
        (parseInt(childrenInput.value) || 0);
    }
  });

  adultsInput.addEventListener("input", updateTotalPassengers);
  childrenInput.addEventListener("input", updateTotalPassengers);

  // Handle button click for fetching train schedules
  searchButton.addEventListener("click", async () => {
    const startStation = startStationSelect.value;
    const endStation = endStationSelect.value;
    const searchDate = searchDateInput.value;
    const totalPassengers = parseInt(totalPassengersInput.value) || 0;
    const children = parseInt(childrenInput.value) || 0;
    const adults = parseInt(adultsInput.value) || 0;

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

    if (totalPassengers > 10) {
      alert("Total passengers cannot exceed 10.");
      return;
    }

    if (totalPassengers !== adults + children) {
      alert("Total passengers must match the sum of adults and children.");
      return;
    }

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
      const response = await fetch("../../server/api/gettrains.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startStation, endStation, searchDate }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const trains = await response.json();
      if (trains && Array.isArray(trains)) {
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
});
