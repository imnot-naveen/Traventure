// Function to extract destination ID from URL
function getDestinationIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

function loadDestinationForEdit(destinationId) {
  // Check if destinationId is valid
  if (!destinationId) {
    console.error("No destination ID provided");
    alert("Error: No destination ID specified");
    return;
  }

  // Parallel promises to load destination, types, and stations
  Promise.all([
    fetch(`../../server/api/getDestination.php?id=${destinationId}`).then(
      (response) => response.json()
    ),
    fetch("../../server/api/getDestinationTypes.php").then((response) =>
      response.json()
    ),
    fetch("../../server/api/getstations.php").then((response) =>
      response.json()
    ),
  ])
    .then(([destinationResponse, typesResponse, stationsResponse]) => {
      // Check for errors in destination response
      if (destinationResponse.error) {
        throw new Error(destinationResponse.error);
      }

      // Populate types dropdown
      const typeSelect = document.querySelector("#destinationType");
      typeSelect.innerHTML =
        '<option value="">Select Destination Type</option>';

      // Check if types response has the expected structure
      if (typesResponse.success && Array.isArray(typesResponse.types)) {
        typesResponse.types.forEach((typeObj) => {
          const option = document.createElement("option");
          option.value = typeObj.type_id;
          option.textContent = typeObj.type;
          typeSelect.appendChild(option);
        });
      } else {
        console.error("Invalid types response", typesResponse);
        alert("Failed to load destination types");
      }

      // Populate stations dropdown
      const stationSelect = document.querySelector("#nearestStation");
      stationSelect.innerHTML =
        '<option value="">Select Nearest Station</option>';

      // Check if stations response is valid
      if (Array.isArray(stationsResponse)) {
        stationsResponse.forEach((station) => {
          const option = document.createElement("option");
          option.value = station.StationID;
          option.textContent = `${station.name} (${station.city})`;
          stationSelect.appendChild(option);
        });
      } else {
        console.error("Invalid stations response", stationsResponse);
        alert("Failed to load stations");
      }

      // Load destination details
      const data = destinationResponse;

      // Populate destination details
      document.querySelector("#destinationNameInput").value = data.name;

      // Set the correct type in dropdown
      const typeOption = Array.from(typeSelect.options).find(
        (option) => parseInt(option.value) === data.type_id
      );
      if (typeOption) {
        typeOption.selected = true;
      }

      // Set the correct station in dropdown
      const stationOption = Array.from(stationSelect.options).find(
        (option) => parseInt(option.value) === data.nearestStation
      );
      if (stationOption) {
        stationOption.selected = true;
      }

      document.querySelector("#destinationDescriptionInput").value =
        data.description;
      console.log(data);

      // Populate photos with delete functionality
      const photosContainer = document.querySelector("#destinationPhotos");
      photosContainer.innerHTML = ""; // Clear existing photos
      const photosToDelete = [];

      if (data.photos && data.photos.length > 0) {
        data.photos.forEach((photo) => {
          const photoWrapper = document.createElement("div");
          photoWrapper.classList.add("photo-wrapper");

          const imgElement = document.createElement("img");
          imgElement.src = `../../Public/uploads/${photo}`;
          imgElement.alt = photo;
          imgElement.classList.add("photo-thumbnail");

          const deleteButton = document.createElement("button");
          deleteButton.textContent = "X";
          deleteButton.classList.add("delete-photo");
          deleteButton.addEventListener("click", () => {
            photoWrapper.remove();
            photosToDelete.push(photo); // Mark photo for deletion
          });

          photoWrapper.appendChild(imgElement);
          photoWrapper.appendChild(deleteButton);
          photosContainer.appendChild(photoWrapper);
        });
      } else {
        photosContainer.textContent = "No photos available.";
      }

      // Store photosToDelete and destination ID for form submission
      window.photosToDelete = photosToDelete;
      window.currentDestinationId = data.id;
    })
    .catch((error) => {
      console.error("Error loading destination for edit:", error);
      alert(`Failed to load destination: ${error.message}`);
    });
}

// Event listener for form submission
document.addEventListener("DOMContentLoaded", () => {
  const destinationId = getDestinationIdFromUrl();

  // Load destination data when page loads
  if (destinationId) {
    loadDestinationForEdit(destinationId);
  } else {
    console.error("No destination ID in URL");
    alert("Error: No destination ID specified");
  }

  // Form submission handler
  const form = document.querySelector("#edit-destination-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData();
    // Use the stored destination ID from the loaded data
    formData.append("id", window.currentDestinationId);
    formData.append(
      "name",
      document.querySelector("#destinationNameInput").value
    );
    formData.append("type", document.querySelector("#destinationType").value);
    formData.append(
      "nearestStation",
      document.querySelector("#nearestStation").value
    );
    formData.append(
      "description",
      document.querySelector("#destinationDescriptionInput").value
    );

    // Handle photo deletions
    formData.append(
      "deletePhotos",
      JSON.stringify(window.photosToDelete || [])
    );

    // Append new photos
    const newPhotosInput = document.querySelector("#newPhotosInput");
    if (newPhotosInput.files.length > 0) {
      for (let i = 0; i < newPhotosInput.files.length; i++) {
        formData.append("newPhotos[]", newPhotosInput.files[i]);
      }
    }

    // Submit the update
    fetch("../../server/api/updateDestination.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          alert("Destination updated successfully!");
          window.location.href = "destinations.html"; // Redirect after successful update
        } else {
          alert(`Error updating destination: ${result.error}`);
        }
      })
      .catch((error) => {
        console.error("Error updating destination:", error);
        alert("Failed to update destination");
      });
  });
});

function goBack() {
  window.location.href = "destinations.html";
}
