const routeDropdown = document.getElementById("route");
const startStationDropdown = document.getElementById("startStation");
const endStationDropdown = document.getElementById("endStation");
const addTrainForm = document.getElementById("addTrainForm");
const trainStopsDiv = document.getElementById("trainStops");

// Fetch routes
fetch("../../server/api/routes.php")
  .then((response) => response.json())
  .then((routes) => {
    routes.forEach((route) => {
      const option = document.createElement("option");
      option.value = route.routeName;
      option.textContent = route.routeName;
      routeDropdown.appendChild(option);
    });
  })
  .catch((err) => console.error("Error loading routes:", err));

// Update stations when a route is selected
routeDropdown.addEventListener("change", () => {
  const routeName = routeDropdown.value;

  fetch(`../../server/api/stations.php?routeName=${routeName}`)
    .then((response) => response.json())
    .then((stations) => {
      populateDropdown(startStationDropdown, stations, "Select Start Station");
      populateDropdown(endStationDropdown, stations, "Select End Station");
    })
    .catch((err) => console.error("Error loading stations:", err));
});

// Disable selected start station in end station dropdown
startStationDropdown.addEventListener("change", () => {
  const selectedStartStation = startStationDropdown.value;

  Array.from(endStationDropdown.options).forEach((option) => {
    option.disabled = option.value === selectedStartStation;
  });
});

// Populate dropdown helper
function populateDropdown(dropdown, items, defaultText) {
  dropdown.innerHTML = `<option value="" disabled selected>${defaultText}</option>`;
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.stationID;
    option.textContent = item.name;
    dropdown.appendChild(option);
  });
}

// Fetch train stops when start or end station changes
startStationDropdown.addEventListener("change", fetchTrainStops);
endStationDropdown.addEventListener("change", fetchTrainStops);

function fetchTrainStops() {
  const routeName = routeDropdown.value;
  const startStation = startStationDropdown.value;
  const endStation = endStationDropdown.value;

  if (startStation && endStation && routeName) {
    fetch(
      `../../server/api/getTrainStops.php?routeName=${routeName}&startStation=${startStation}&endStation=${endStation}`
    )
      .then((response) => response.json())
      .then((data) => {
        trainStopsDiv.innerHTML = ""; // Clear previous stops

        if (data.length > 0) {
          data.forEach((stop) => {
            const stopElement = document.createElement("div");
            stopElement.className = "train-stop";

            // Checkbox with stationID as value
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `stop-${stop.stationID}`;
            checkbox.value = stop.stationID; // Store stationID in value

            // Station name label
            const stationLabel = document.createElement("label");
            stationLabel.htmlFor = checkbox.id;
            stationLabel.textContent = stop.name;

            // Times container
            const timesContainer = document.createElement("div");
            timesContainer.className = "train-stop-times";

            // Arrival time input
            const arrivalLabel = document.createElement("label");
            arrivalLabel.textContent = "Arrival";
            const arrivalInput = document.createElement("input");
            arrivalInput.type = "time";
            arrivalInput.className = "arrival-time";

            // Departure time input
            const departureLabel = document.createElement("label");
            departureLabel.textContent = "Departure";
            const departureInput = document.createElement("input");
            departureInput.type = "time";
            departureInput.className = "departure-time";

            // Add data attributes to store station info
            stopElement.dataset.stationId = stop.stationID;
            stopElement.dataset.stationName = stop.name;

            // Add event listener to toggle times visibility
            checkbox.addEventListener("change", () => {
              timesContainer.classList.toggle("active", checkbox.checked);
            });

            // Append elements
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
      });
  } else {
    trainStopsDiv.innerHTML =
      "<p>Please select both start and end stations.</p>";
  }
}

// Handle form submission
addTrainForm.addEventListener("submit", (e) => {
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
    firstClass: document.getElementById("firstClass").value,
    SecondClass: document.getElementById("secondClass").value,
    stops: [],
  };

  console.log(document.getElementById("secondClass").value);

  // Collect stops data
  const stopElements = trainStopsDiv.querySelectorAll(".train-stop");
  stopElements.forEach((stopElement) => {
    const checkbox = stopElement.querySelector('input[type="checkbox"]');
    if (checkbox.checked) {
      const arrivalTimeInput = stopElement.querySelector(".arrival-time").value;
      const departureTimeInput =
        stopElement.querySelector(".departure-time").value;

      trainData.stops.push({
        stationID: checkbox.value,
        arrivalTime: arrivalTimeInput + ":00",
        departureTime: departureTimeInput + ":00",
      });
    }
  });

  fetch("../../server/api/addtrain.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(trainData),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        alert(result.message);
        if (result.redirect) {
          window.location.href = result.redirect;
        }
      } else {
        alert(result.message);
      }
    })
    .catch((err) => {
      console.error("Error adding train:", err);
      alert("Error adding train. Please check console for details.");
    });
});
