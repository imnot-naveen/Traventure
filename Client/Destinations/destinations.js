document.addEventListener("DOMContentLoaded", () => {
  fetch("../../server/api/getDestinations.php")
    .then((response) => response.json())
    .then((data) => renderDestinations(data))
    .catch((error) => console.error("Error:", error));
});

function renderDestinations(destinations) {
  const destinationList = document.getElementById("destination-list");
  destinationList.innerHTML = ""; // Clear previous content

  destinations.forEach((destination, index) => {
    const destinationItem = document.createElement("div");
    destinationItem.className = "destination-item";

    // Number and title
    destinationItem.innerHTML = `
      <div class="destination-number">${index + 1}</div>
      <div class="destination-title">${destination.name}</div>
    `;

    // Nearest Station
    const nearestStation = document.createElement("h3");
    nearestStation.className = "nearest-station";
    nearestStation.textContent = `Nearest Station: ${destination.nearestStation}`;

    destinationItem.appendChild(nearestStation);

    // Slideshow
    const slideshow = document.createElement("div");
    slideshow.className = "destination-slideshow";

    const images = destination.photos.map(
      (photo) =>
        `<img src="../../public/uploads/${photo}" class="slideshow-image" style="display: none;">`
    );

    slideshow.innerHTML = `
        ${images.join("")}
        <button class="arrow left">&lt;</button>
        <button class="arrow right">&gt;</button>
      `;

    let currentSlide = 0;
    const slides = slideshow.querySelectorAll(".slideshow-image");
    if (slides.length > 0) {
      slides[currentSlide].style.display = "block"; // Show the first slide
    }

    slideshow.querySelector(".arrow.left").addEventListener("click", () => {
      slides[currentSlide].style.display = "none";
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      slides[currentSlide].style.display = "block";
    });

    slideshow.querySelector(".arrow.right").addEventListener("click", () => {
      slides[currentSlide].style.display = "none";
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].style.display = "block";
    });

    destinationItem.appendChild(slideshow);

    // Description
    const description = document.createElement("p");
    description.className = "destination-description";
    description.textContent = destination.description;

    destinationItem.appendChild(description);
    destinationList.appendChild(destinationItem);
  });
}
