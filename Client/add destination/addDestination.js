document.addEventListener("DOMContentLoaded", () => {
  const typeSelect = document.getElementById("type");
  const nearestStationSelect = document.getElementById("nearestStation");

  // Fetch and populate types
  fetch("../../server/api/getDestinationTypes.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        data.types.forEach((type) => {
          const option = document.createElement("option");
          option.value = type.type_id;
          option.textContent = type.type;
          typeSelect.appendChild(option);
        });
      } else {
        alert("Failed to fetch destination types.");
      }
    })
    .catch((err) => console.error(err));

  // Fetch and populate stations
  fetch("../../server/api/getstations.php")
    .then((response) => response.json())
    .then((stations) => {
      if (stations.length > 0) {
        // Add default option
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select Nearest Station";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        nearestStationSelect.appendChild(defaultOption);

        // Populate stations
        stations.forEach((station) => {
          const option = document.createElement("option");
          option.value = station.StationID;
          option.textContent = `${station.name} (${station.city})`;
          nearestStationSelect.appendChild(option);
        });
      } else {
        alert("No stations available.");
      }
    })
    .catch((err) => console.error(err));

  // Handle form submission
  document
    .getElementById("destination-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(e.target);

      fetch("../../server/api/createDestination.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert("Destination added successfully!");
            e.target.reset();
          } else {
            alert(`Error: ${data.message}`);
          }
        })
        .catch((err) => console.error(err));
    });
});
