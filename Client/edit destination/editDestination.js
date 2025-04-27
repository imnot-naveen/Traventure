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

      // Get destination types container
      const typesContainer = document.querySelector("#destinationTypes");
      typesContainer.innerHTML = ""; // Clear existing content

      // Create heading for types
      const typesHeading = document.createElement("label");
      typesHeading.textContent = "Destination Types:";
      typesHeading.className = "form-label";
      typesContainer.appendChild(typesHeading);

      // Create checkbox container
      const checkboxContainer = document.createElement("div");
      checkboxContainer.className = "checkbox-container";
      typesContainer.appendChild(checkboxContainer);

      // Check if types response has the expected structure
      if (typesResponse.success && Array.isArray(typesResponse.types)) {
        // Get destination's current types (if any)
        const currentTypes = destinationResponse.types || [];

        typesResponse.types.forEach((typeObj) => {
          // Create container for each checkbox
          const checkboxDiv = document.createElement("div");
          checkboxDiv.className = "form-check";

          // Create checkbox input
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.className = "form-check-input";
          checkbox.name = "types[]";
          checkbox.value = typeObj.type_id;
          checkbox.id = `type-${typeObj.type_id}`;

          // Check if this type is already associated with the destination
          if (currentTypes.some((type) => type.type_id === typeObj.type_id)) {
            checkbox.checked = true;
          }

          // Create label
          const label = document.createElement("label");
          label.className = "form-check-label";
          label.htmlFor = `type-${typeObj.type_id}`;
          label.textContent = typeObj.type;

          // Add checkbox and label to container
          checkboxDiv.appendChild(checkbox);
          checkboxDiv.appendChild(label);
          checkboxContainer.appendChild(checkboxDiv);
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

  // Add event listener for file input changes to show previews
  const newPhotosInput = document.querySelector("#newPhotosInput");
  newPhotosInput.addEventListener("change", function () {
    const photosContainer = document.querySelector("#destinationPhotos");

    // Remove "No photos available" text if it exists
    if (photosContainer.textContent === "No photos available.") {
      photosContainer.textContent = "";
    }

    // Remove any existing new photo previews (in case the user selects files multiple times)
    const existingPreviews = photosContainer.querySelectorAll(".new-photo");
    existingPreviews.forEach((preview) => preview.remove());

    // Show previews for newly selected files
    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i];

      // Only process image files
      if (!file.type.match("image.*")) {
        continue;
      }

      const photoWrapper = document.createElement("div");
      photoWrapper.classList.add("photo-wrapper", "new-photo");

      const imgElement = document.createElement("img");
      imgElement.classList.add("photo-thumbnail");

      // Create a temporary preview URL
      const reader = new FileReader();
      reader.onload = (function (img) {
        return function (e) {
          img.src = e.target.result;
        };
      })(imgElement);

      reader.readAsDataURL(file);
      imgElement.alt = file.name;

      const label = document.createElement("div");
      label.classList.add("new-photo-label");
      label.textContent = "New";

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "X";
      deleteButton.classList.add("delete-photo");
      deleteButton.addEventListener("click", () => {
        photoWrapper.remove();
      });

      photoWrapper.appendChild(imgElement);
      photoWrapper.appendChild(label);
      photoWrapper.appendChild(deleteButton);
      photosContainer.appendChild(photoWrapper);
    }
  });

  // Form submission handler
  const form = document.querySelector("#edit-destination-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Check if at least one type is selected
    const selectedTypes = document.querySelectorAll(
      'input[name="types[]"]:checked'
    );
    if (selectedTypes.length === 0) {
      alert("Please select at least one destination type.");
      return;
    }

    const formData = new FormData();

    // Use the stored destination ID from the loaded data
    formData.append("id", window.currentDestinationId);
    formData.append(
      "name",
      document.querySelector("#destinationNameInput").value
    );
    formData.append(
      "nearestStation",
      document.querySelector("#nearestStation").value
    );
    formData.append(
      "description",
      document.querySelector("#destinationDescriptionInput").value
    );

    // Add selected types to the form data
    selectedTypes.forEach((checkbox) => {
      formData.append("types[]", checkbox.value);
    });

    // Handle photo deletions
    formData.append(
      "deletePhotos",
      JSON.stringify(window.photosToDelete || [])
    );

    // Append new photos
    const newPhotosInput = document.querySelector("#newPhotosInput");
    if (newPhotosInput.files.length > 0) {
      console.log("Files detected for upload:", newPhotosInput.files.length);

      for (let i = 0; i < newPhotosInput.files.length; i++) {
        console.log(`Adding file: ${newPhotosInput.files[i].name}`);
        formData.append("newPhotos[]", newPhotosInput.files[i]);
      }
    } else {
      console.log("No new photos selected for upload");
    }

    // Log form data for debugging
    console.log("FormData entries:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
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
          window.location.href =
            "../manage destinations/managedestinations.php"; // Redirect after successful update
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
  window.location.href = "../manage destinations/managedestinations.php";
}
