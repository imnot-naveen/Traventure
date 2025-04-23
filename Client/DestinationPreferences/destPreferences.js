document.addEventListener("DOMContentLoaded", function () {
  // Show loading spinner
  const destinationList = document.getElementById("destinationList");
  destinationList.innerHTML = `
    <div class="loading-container">
      <div class="loading-spinner"></div>
    </div>
  `;

  // First, get user's current preferences (if any)
  let userPreferences = [];

  fetch("../../server/api/getUserTypes.php")
    .then((response) => response.json())
    .then((data) => {
      if (data && data.preferred_types) {
        userPreferences = data.preferred_types.map((type) => type.toString());
      }
      // Now fetch all destination types
      return fetch("../../server/api/getDestinationTypes.php");
    })
    .catch((error) => {
      console.error("Error fetching user preferences:", error);
      // Continue to fetch destination types even if preferences fail
      return fetch("../../server/api/getDestinationTypes.php");
    })
    .then((response) => response.json())
    .then((data) => {
      // Clear loading spinner
      destinationList.innerHTML = "";

      let destinations = data.types;
      if (!Array.isArray(destinations)) {
        throw new Error("Invalid data format: Expected an array");
      }

      // Render each destination type with its photo
      destinations.forEach((dest) => {
        // Create container for destination item
        const item = document.createElement("div");
        item.className = "destination-item";

        // Add photo
        const img = document.createElement("img");
        img.className = "destination-photo";
        // If there's a photo property in the API response, use it, otherwise use a default or placeholder
        img.src = dest.photo
          ? `../../Public/uploads/${dest.photo}`
          : `../../Public/uploads/default-destination.jpg`;
        img.alt = dest.type;
        item.appendChild(img);

        // Create info overlay
        const info = document.createElement("div");
        info.className = "destination-info";

        // Create checkbox input
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "destination-checkbox";
        checkbox.id = `dest-${dest.type_id}`;
        checkbox.value = dest.type_id;
        checkbox.name = "destination";

        // Check if this is a user preference
        if (userPreferences.includes(dest.type_id.toString())) {
          checkbox.checked = true;
        }

        // Create custom checkbox
        const checkmark = document.createElement("span");
        checkmark.className = "checkmark";

        // Create label
        const label = document.createElement("label");
        label.className = "destination-label";
        label.setAttribute("for", `dest-${dest.type_id}`);
        label.textContent = dest.type;

        // Assemble the components
        info.appendChild(checkbox);
        info.appendChild(checkmark);
        info.appendChild(label);
        item.appendChild(info);

        destinationList.appendChild(item);
      });
    })
    .catch((error) => {
      console.error("Error fetching destinations:", error);
      destinationList.innerHTML = `
        <div class="error-message">
          <p>Sorry, we couldn't load destination types. Please try again later.</p>
        </div>
      `;
    });

  // Form submission handler
  document
    .getElementById("preferenceForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      // Show a loading state on the button
      const submitButton = this.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.textContent = "Saving...";
      submitButton.disabled = true;

      let selectedDestinations = Array.from(
        document.querySelectorAll('input[name="destination"]:checked')
      ).map((cb) => cb.value);

      fetch("../../server/api/saveUserDestinations.php", {
        method: "POST",
        body: JSON.stringify({ destinations: selectedDestinations }),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          // Show success message
          const successMessage = document.createElement("div");
          successMessage.className = "success-message";
          successMessage.textContent =
            data.message || "Preferences saved successfully!";
          document.body.appendChild(successMessage);

          // Make it visible
          setTimeout(() => successMessage.classList.add("visible"), 10);

          // Redirect after a short delay
          setTimeout(() => {
            window.location.href = "../home/home.html";
          }, 1500);
        })
        .catch((error) => {
          console.error("Error saving preferences:", error);
          submitButton.textContent = originalButtonText;
          submitButton.disabled = false;

          const errorMsg = document.createElement("div");
          errorMsg.className = "error-message";
          errorMsg.textContent =
            "There was a problem saving your preferences. Please try again.";

          // Insert at the top of the form
          this.insertBefore(errorMsg, this.firstChild);

          // Remove after 5 seconds
          setTimeout(() => {
            errorMsg.remove();
          }, 5000);
        });
    });
});
