document.addEventListener("DOMContentLoaded", () => {
  const typeContainer = document.getElementById("typesContainer");
  const nearestStationSelect = document.getElementById("nearestStation");

  // Fetch and populate types as checkboxes
  fetch("../../server/api/getDestinationTypes.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Create heading for types
        const typesHeading = document.createElement("label");
        typesHeading.textContent = "Destination Types:";
        typesHeading.className = "form-label";
        typeContainer.appendChild(typesHeading);

        // Create checkbox container div
        const checkboxContainer = document.createElement("div");
        checkboxContainer.className = "checkbox-container";
        typeContainer.appendChild(checkboxContainer);

        data.types.forEach((type) => {
          // Create container for each checkbox
          const checkboxDiv = document.createElement("div");
          checkboxDiv.className = "form-check";

          // Create checkbox input
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.className = "form-check-input";
          checkbox.name = "types[]";
          checkbox.value = type.type_id;
          checkbox.id = `type-${type.type_id}`;

          // Create label
          const label = document.createElement("label");
          label.className = "form-check-label";
          label.htmlFor = `type-${type.type_id}`;
          label.textContent = type.type;

          // Add checkbox and label to container
          checkboxDiv.appendChild(checkbox);
          checkboxDiv.appendChild(label);
          checkboxContainer.appendChild(checkboxDiv);
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

      // Check if at least one type is selected
      const selectedTypes = document.querySelectorAll(
        'input[name="types[]"]:checked'
      );
      if (selectedTypes.length === 0) {
        alert("Please select at least one destination type.");
        return;
      }

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
            window.location.href =
              "../manage destinations/managedestinations.php";
          } else {
            alert(`Error: ${data.message}`);
          }
        })
        .catch((err) => console.error(err));
    });
});
