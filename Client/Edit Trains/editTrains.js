document.addEventListener("DOMContentLoaded", () => {
  const editTrainForm = document.getElementById("editTrainForm");
  const routeDropdown = document.getElementById("route");
  const startStationDropdown = document.getElementById("startStation");
  const endStationDropdown = document.getElementById("endStation");
  const trainStopsDiv = document.getElementById("trainStops");

  // Get train ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const trainId = urlParams.get("trainNo");

  if (!trainId) {
    alert("No train ID provided!");
    window.location.href = "../view and edit trains/vieweditTrains.html";
    return;
  }

  // Populate dropdown helper
  function populateDropdown(dropdown, items, defaultText) {
    dropdown.innerHTML = `<option value="" disabled selected>${defaultText}</option>`;

    if (!Array.isArray(items)) {
      console.error(
        "Expected an array for dropdown items but received:",
        items
      );
      return;
    }

    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.stationID;
      option.textContent = item.name;
      dropdown.appendChild(option);
    });
  }

  // Fetch routes
  function fetchRoutes() {
    fetch("../../server/api/routes.php")
      .then((response) => {
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then((routes) => {
        populateDropdown(
          routeDropdown,
          routes.map((route) => ({
            stationID: route.routeName,
            name: route.routeName,
          })),
          "Select Route"
        );
        // After populating routes, fetch train details
        fetchTrainDetails(trainId);
      })
      .catch((err) => {
        console.error("Error fetching routes:", err);
        alert(
          "Error fetching route data. Please check the console for details."
        );
      });
  }

  // Fetch stations for a route
  function fetchStations(route, callback) {
    fetch(`../../server/api/stations.php?routeName=${route}`)
      .then((response) => {
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then((stations) => {
        populateDropdown(
          startStationDropdown,
          stations,
          "Select Start Station"
        );
        populateDropdown(endStationDropdown, stations, "Select End Station");
        if (callback) callback();
      })
      .catch((err) => {
        console.error("Error fetching stations:", err);
        alert("Error fetching stations. Please check the console for details.");
      });
  }

  // Fetch train stops
  function fetchTrainStops() {
    const routeName = routeDropdown.value;
    const startStation = startStationDropdown.value;
    const endStation = endStationDropdown.value;

    if (!routeName || !startStation || !endStation) {
      trainStopsDiv.innerHTML =
        "<p>Please select both start and end stations.</p>";
      return;
    }

    fetch(
      `../../server/api/getTrainStops.php?routeName=${routeName}&startStation=${startStation}&endStation=${endStation}`
    )
      .then((response) => response.json())
      .then((data) => {
        trainStopsDiv.innerHTML = "";

        if (data.length > 0) {
          data.forEach((stop) => {
            const stopElement = document.createElement("div");
            stopElement.className = "train-stop";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `stop-${stop.stationID}`;
            checkbox.value = stop.stationID;

            const stationLabel = document.createElement("label");
            stationLabel.htmlFor = checkbox.id;
            stationLabel.textContent = stop.name;

            const timesContainer = document.createElement("div");
            timesContainer.className = "train-stop-times";

            const arrivalLabel = document.createElement("label");
            arrivalLabel.textContent = "Arrival";
            const arrivalInput = document.createElement("input");
            arrivalInput.type = "time";
            arrivalInput.className = "arrival-time";

            const departureLabel = document.createElement("label");
            departureLabel.textContent = "Departure";
            const departureInput = document.createElement("input");
            departureInput.type = "time";
            departureInput.className = "departure-time";

            checkbox.addEventListener("change", () => {
              timesContainer.classList.toggle("active", checkbox.checked);
            });

            timesContainer.appendChild(arrivalLabel);
            timesContainer.appendChild(arrivalInput);
            timesContainer.appendChild(departureLabel);
            timesContainer.appendChild(departureInput);

            stopElement.appendChild(checkbox);
            stopElement.appendChild(stationLabel);
            stopElement.appendChild(timesContainer);

            trainStopsDiv.appendChild(stopElement);
          });
        } else {
          trainStopsDiv.innerHTML =
            "<p>No train stops found between these stations.</p>";
        }
      })
      .catch((error) => {
        console.error("Error fetching train stops:", error);
        trainStopsDiv.innerHTML = "<p>Error loading train stops.</p>";
      });
  }

  // Fetch train details
  function fetchTrainDetails(trainNo) {
    fetch(`../../server/api/gettrain.php?trainNo=${trainNo}`)
      .then((response) => {
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then((trainData) => {
        // Populate form fields
        Object.entries(trainData).forEach(([key, value]) => {
          const field = document.getElementById(key);
          if (field) field.value = value;
        });

        // Set train number
        document.getElementById("trainNo").value = trainNo;

        // Handle route and stations
        if (trainData.route) {
          routeDropdown.value = trainData.route;
          fetchStations(trainData.route, () => {
            startStationDropdown.value = trainData.startStation;
            endStationDropdown.value = trainData.endStation;
            fetchTrainStops();
          });
        }
      })
      .catch((err) => {
        console.error("Error fetching train details:", err);
        alert(
          "Error loading train details. Please check the console for details."
        );
      });
  }

  // Form submission handler
  editTrainForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const trainData = {
      trainID: document.getElementById("trainNo").value,
      name: document.getElementById("name").value,
      type: document.getElementById("type").value,
      startStation: document.getElementById("startStation").value,
      endStation: document.getElementById("endStation").value,
      departureTime: document.getElementById("departureTime").value + ":00",
      arrivalTime: document.getElementById("arrivalTime").value + ":00",
      date: document.getElementById("date").value,
      stops: [],
    };

    // Collect stops data
    const stopElements = trainStopsDiv.querySelectorAll(".train-stop");
    stopElements.forEach((stopElement) => {
      const checkbox = stopElement.querySelector('input[type="checkbox"]');
      if (checkbox.checked) {
        const arrivalTimeInput =
          stopElement.querySelector(".arrival-time").value;
        const departureTimeInput =
          stopElement.querySelector(".departure-time").value;

        trainData.stops.push({
          stationID: checkbox.value,
          arrivalTime: arrivalTimeInput ? arrivalTimeInput + ":00" : "",
          departureTime: departureTimeInput ? departureTimeInput + ":00" : "",
        });
      }
    });

    fetch("../../server/api/updatetrain.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trainData),
    })
      .then((response) => response.json())
      .then((result) => {
        alert(result.message);
        if (result.success) {
          window.location.href = "vieweditTrains.html";
        }
      })
      .catch((err) => {
        console.error("Error updating train:", err);
        alert("Error updating train. Please check console for details.");
      });
  });

  // Event listeners for station changes
  routeDropdown.addEventListener("change", () => {
    const selectedRoute = routeDropdown.value;
    if (selectedRoute) {
      fetchStations(selectedRoute);
    }
  });

  startStationDropdown.addEventListener("change", fetchTrainStops);
  endStationDropdown.addEventListener("change", fetchTrainStops);

  // Initialize the form by fetching routes
  fetchRoutes();
});
