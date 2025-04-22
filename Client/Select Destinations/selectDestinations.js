document.addEventListener("DOMContentLoaded", () => {
  // Retrieve train ID from localStorage
  const tripData = JSON.parse(localStorage.getItem("tripData"));

  if (!tripData || !tripData.trainID) {
    alert("Train ID is missing! Please select a train first.");
    window.location.href = "../select train/selecttrain.html"; // Redirect if train ID is not found
    return;
  }

  const trainID = tripData.trainID;

  // First fetch user's preferred destination types
  fetch(`../../server/api/getUserTypes.php`)
    .then((response) => response.json())
    .then((data) => {
      const preferredTypes = data.preferred_types || [];

      // Then fetch destinations based on trainID
      return fetch(
        `../../server/api/getTrainDestinations.php?trainID=${trainID}`
      )
        .then((response) => response.json())
        .then((destinations) =>
          renderDestinations(destinations, preferredTypes)
        );
    })
    .catch((error) => {
      console.error("Error:", error);
      // If there's an error fetching preferences, still try to show destinations
      fetch(`../../server/api/getTrainDestinations.php?trainID=${trainID}`)
        .then((response) => response.json())
        .then((destinations) => renderDestinations(destinations, []))
        .catch((error) => console.error("Error fetching destinations:", error));
    });
});

function renderDestinations(destinations, preferredTypes) {
  const destinationList = document.getElementById("destination-list");
  destinationList.innerHTML = ""; // Clear previous content

  if (!destinations || destinations.length === 0) {
    destinationList.innerHTML =
      "<div class='no-destinations'><p>No destinations available along this route.</p></div>";
    return;
  }

  // Create header
  const headerElement = document.createElement("div");
  headerElement.className = "destinations-header";
  headerElement.innerHTML = `
    <h2>Select Your Destinations</h2>
    <p>Choose the places you'd like to visit along this route</p>
  `;
  destinationList.appendChild(headerElement);

  // Sort destinations - recommended first
  const recommendedDestinations = [];
  const otherDestinations = [];

  destinations.forEach((destination) => {
    if (preferredTypes.includes(parseInt(destination.type_id))) {
      recommendedDestinations.push(destination);
    } else {
      otherDestinations.push(destination);
    }
  });

  // Create containers for recommended and other destinations
  if (recommendedDestinations.length > 0) {
    const recommendedSection = document.createElement("div");
    recommendedSection.className = "destinations-section recommended-section";
    recommendedSection.innerHTML = `
      <h3 class="section-title">Recommended for You</h3>
      <div class="destinations-container" id="recommended-container"></div>
    `;
    destinationList.appendChild(recommendedSection);

    createDestinationItems(
      recommendedDestinations,
      document.getElementById("recommended-container"),
      0,
      true
    );
  }

  if (otherDestinations.length > 0) {
    const otherSection = document.createElement("div");
    otherSection.className = "destinations-section other-section";
    otherSection.innerHTML = `
      <h3 class="section-title">${
        recommendedDestinations.length > 0
          ? "Other Destinations"
          : "All Destinations"
      }</h3>
      <div class="destinations-container" id="other-container"></div>
    `;
    destinationList.appendChild(otherSection);

    createDestinationItems(
      otherDestinations,
      document.getElementById("other-container"),
      recommendedDestinations.length
    );
  }

  // Add the submit button section
  const actionSection = document.createElement("div");
  actionSection.className = "action-section";

  const submitButton = document.createElement("button");
  submitButton.id = "submit-selections";
  submitButton.textContent = "Proceed to View Itinerary";
  submitButton.className = "primary-button";
  actionSection.appendChild(submitButton);

  destinationList.appendChild(actionSection);

  // Add the event listener for the dynamically created button here
  submitButton.addEventListener("click", () => {
    // Get all checkboxes
    const allCheckboxes = document.querySelectorAll(".destination-checkbox");
    const selectedDestinations = [];

    // Process checkboxes in order (maintaining route sequence)
    allCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        selectedDestinations.push({
          id: checkbox.getAttribute("data-id"),
          name: checkbox.value,
          nearestStation: checkbox.getAttribute("data-station-id"),
          photos: JSON.parse(checkbox.getAttribute("data-photos") || "[]"),
          type_id: checkbox.getAttribute("data-type-id"),
        });
      }
    });

    // Save selected destinations to localStorage
    const tripData = JSON.parse(localStorage.getItem("tripData")) || {};
    tripData.stopovers = selectedDestinations;
    localStorage.setItem("tripData", JSON.stringify(tripData));

    // Redirect based on selection
    if (selectedDestinations.length > 0) {
      window.location.href = "../select train/selectnexttrain.html";
    } else {
      window.location.href = "../view itinerary/viewitinerary.html";
    }
  });
}

function createDestinationItems(
  destinations,
  container,
  startIndex,
  isRecommended = false
) {
  destinations.forEach((destination, index) => {
    const displayIndex = startIndex + index + 1; // +1 because indices start at 1 for display
    const destinationItem = document.createElement("div");
    destinationItem.className = "destination-item";
    if (isRecommended) {
      destinationItem.classList.add("recommended");
    }

    // Extract photos array
    let photos = [];
    if (destination.photos && destination.photos.length > 0) {
      // If it's already an array, use it directly
      if (Array.isArray(destination.photos)) {
        photos = destination.photos;
      }
      // If it's a string (like from a data attribute), try to parse it
      else if (typeof destination.photos === "string") {
        try {
          photos = JSON.parse(destination.photos);
        } catch (e) {
          // If it's a comma-separated string
          photos = destination.photos.split(",").map((p) => p.trim());
        }
      }
    }

    // Create the left side with destination info
    const infoSection = document.createElement("div");
    infoSection.className = "destination-info";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = destination.name;
    checkbox.id = `destination-${displayIndex}`;
    checkbox.setAttribute("data-station-id", destination.nearestStation);
    checkbox.setAttribute("data-id", destination.id);
    checkbox.setAttribute("data-photos", JSON.stringify(destination.photos));
    checkbox.setAttribute("data-type-id", destination.type_id);
    checkbox.className = "destination-checkbox";
    infoSection.appendChild(checkbox);

    const label = document.createElement("label");
    label.htmlFor = `destination-${displayIndex}`;
    label.className = "destination-label";

    let labelContent = `
      <div class="destination-number">${displayIndex}</div>
      <div class="destination-details">
        <div class="destination-title">
          ${destination.name}
          ${
            isRecommended
              ? '<span class="recommended-badge">Recommended</span>'
              : ""
          }
        </div>
        ${
          destination.description
            ? `<div class="destination-description">${destination.description}</div>`
            : ""
        }
    `;

    // Add destination type if available
    if (destination.type_name) {
      labelContent += `<div class="destination-type">${destination.type_name}</div>`;
    }

    labelContent += `</div>`;
    label.innerHTML = labelContent;

    infoSection.appendChild(label);
    destinationItem.appendChild(infoSection);

    // Create the right side with photos carousel
    if (photos && photos.length > 0) {
      const photoSection = document.createElement("div");
      photoSection.className = "destination-photos";

      const carousel = document.createElement("div");
      carousel.className = "photo-carousel";

      // Track the current photo index
      carousel.dataset.currentPhoto = 0;

      // Create photo container
      const photoContainer = document.createElement("div");
      photoContainer.className = "carousel-container";

      // Add photos to carousel
      photos.forEach((photo, photoIndex) => {
        const img = document.createElement("img");
        img.src = `../../Public/uploads/${photo}`; // Adjust path as needed
        img.alt = `${destination.name} photo ${photoIndex + 1}`;
        img.className = "carousel-image";
        if (photoIndex === 0) {
          img.classList.add("active");
        }
        photoContainer.appendChild(img);
      });

      carousel.appendChild(photoContainer);

      // Add navigation buttons if more than one photo
      if (photos.length > 1) {
        const navButtons = document.createElement("div");
        navButtons.className = "carousel-nav";

        const prevButton = document.createElement("button");
        prevButton.className = "carousel-prev";
        prevButton.innerHTML = "&#10094;";
        prevButton.addEventListener("click", (e) => {
          e.preventDefault();
          navigateCarousel(carousel, "prev");
        });

        const nextButton = document.createElement("button");
        nextButton.className = "carousel-next";
        nextButton.innerHTML = "&#10095;";
        nextButton.addEventListener("click", (e) => {
          e.preventDefault();
          navigateCarousel(carousel, "next");
        });

        navButtons.appendChild(prevButton);
        navButtons.appendChild(nextButton);
        carousel.appendChild(navButtons);

        // Add indicators
        const indicators = document.createElement("div");
        indicators.className = "carousel-indicators";

        photos.forEach((_, i) => {
          const dot = document.createElement("span");
          dot.className = "indicator-dot";
          if (i === 0) dot.classList.add("active");
          dot.addEventListener("click", (e) => {
            e.preventDefault();
            moveToSlide(carousel, i);
          });
          indicators.appendChild(dot);
        });

        carousel.appendChild(indicators);
      }

      photoSection.appendChild(carousel);
      destinationItem.appendChild(photoSection);
    }

    container.appendChild(destinationItem);
  });
}

// Function to navigate carousel
function navigateCarousel(carousel, direction) {
  const images = carousel.querySelectorAll(".carousel-image");
  const dots = carousel.querySelectorAll(".indicator-dot");
  let currentIndex = parseInt(carousel.dataset.currentPhoto);

  // Remove active class from current
  images[currentIndex].classList.remove("active");
  if (dots.length) dots[currentIndex].classList.remove("active");

  // Calculate new index
  if (direction === "next") {
    currentIndex = (currentIndex + 1) % images.length;
  } else {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
  }

  // Add active class to new
  images[currentIndex].classList.add("active");
  if (dots.length) dots[currentIndex].classList.add("active");

  // Update current index
  carousel.dataset.currentPhoto = currentIndex;
}

// Move to specific slide
function moveToSlide(carousel, index) {
  const images = carousel.querySelectorAll(".carousel-image");
  const dots = carousel.querySelectorAll(".indicator-dot");
  const currentIndex = parseInt(carousel.dataset.currentPhoto);

  // Remove active class from current
  images[currentIndex].classList.remove("active");
  dots[currentIndex].classList.remove("active");

  // Add active class to new
  images[index].classList.add("active");
  dots[index].classList.add("active");

  // Update current index
  carousel.dataset.currentPhoto = index;
}
