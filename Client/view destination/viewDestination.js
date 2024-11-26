function loadDestination(destinationId) {
  fetch(`../../server/api/getDestination.php?id=${destinationId}`)
    .then((response) => response.json())
    .then((data) => {
      if (!data || data.error) {
        throw new Error(data.error || "Error fetching destination");
      }

      // Populate destination details
      document.querySelector("#destination-name").textContent = data.name;
      document.querySelector("#destination-description").textContent =
        data.description;

      // Populate photos
      const photosContainer = document.querySelector("#destination-photos");
      photosContainer.innerHTML = ""; // Clear existing photos
      if (data.photos && data.photos.length > 0) {
        data.photos.forEach((photo) => {
          const imgElement = document.createElement("img");
          imgElement.src = `../../Public/uploads/${photo}`;
          imgElement.alt = data.name;
          imgElement.classList.add("photo-thumbnail");
          photosContainer.appendChild(imgElement);
        });
      } else {
        photosContainer.textContent = "No photos available.";
      }
    })
    .catch((error) => {
      console.error("Error loading destination:", error);
    });
}
