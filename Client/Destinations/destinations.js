document.addEventListener("DOMContentLoaded", () => {
  fetch("../../server/api/getDestinations.php")
    .then((response) => response.json())
    .then((data) => renderDestinations(data))
    .catch((error) => console.error("Error:", error));

  // Check if user is logged in and get username from session
  fetch("../../server/api/getSession.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.loggedIn) {
        window.currentUser = data.username;
      }
    })
    .catch((error) => console.error("Session Error:", error));
});

function renderDestinations(destinations) {
  const destinationList = document.getElementById("destination-list");
  destinationList.innerHTML = ""; // Clear previous content

  destinations.forEach((destination, index) => {
    const destinationItem = document.createElement("div");
    destinationItem.className = "destination-item";

    // Header with number and title
    const headerSection = document.createElement("div");
    headerSection.className = "destination-header";
    headerSection.innerHTML = `
      <div class="destination-number">${index + 1}</div>
      <div class="destination-title">${destination.name}</div>
    `;
    destinationItem.appendChild(headerSection);

    // Nearest Station
    const nearestStation = document.createElement("div");
    nearestStation.className = "nearest-station";
    nearestStation.innerHTML = `<i class="fas fa-subway"></i> ${destination.nearestStation}`;
    destinationItem.appendChild(nearestStation);

    // Slideshow
    const slideshow = document.createElement("div");
    slideshow.className = "destination-slideshow";

    // Create slideshow container
    const slideshowContainer = document.createElement("div");
    slideshowContainer.className = "slideshow-container";

    // Add images to the slideshow
    destination.photos.forEach((photo, photoIndex) => {
      const img = document.createElement("img");
      img.src = `../../public/uploads/${photo}`;
      img.className = "slideshow-image";
      img.style.display = photoIndex === 0 ? "block" : "none";
      img.alt = `${destination.name} - Photo ${photoIndex + 1}`;

      // Detect image orientation after load
      img.onload = function () {
        if (this.naturalHeight > this.naturalWidth) {
          this.classList.add("portrait");
        }
      };

      slideshowContainer.appendChild(img);
    });

    // Create slideshow controls
    slideshow.innerHTML = `
      <button class="arrow left" aria-label="Previous image"><i class="fas fa-chevron-left"></i></button>
      <button class="arrow right" aria-label="Next image"><i class="fas fa-chevron-right"></i></button>
      <div class="slide-indicator"></div>
    `;
    slideshow.insertBefore(slideshowContainer, slideshow.firstChild);

    // Initialize slideshow
    let currentSlide = 0;
    const slides = slideshow.querySelectorAll(".slideshow-image");

    // Create slide indicators
    const slideIndicator = slideshow.querySelector(".slide-indicator");
    for (let i = 0; i < slides.length; i++) {
      const dot = document.createElement("span");
      dot.className = "slide-dot";
      dot.setAttribute("data-slide", i);
      dot.addEventListener("click", () => {
        goToSlide(i);
      });
      slideIndicator.appendChild(dot);
    }

    // Show first slide if available
    if (slides.length > 0) {
      slides[currentSlide].style.display = "block";
      updateSlideIndicators();
    }

    // Set up arrow navigation
    slideshow.querySelector(".arrow.left").addEventListener("click", () => {
      goToSlide((currentSlide - 1 + slides.length) % slides.length);
    });

    slideshow.querySelector(".arrow.right").addEventListener("click", () => {
      goToSlide((currentSlide + 1) % slides.length);
    });

    function goToSlide(slideIndex) {
      slides[currentSlide].style.display = "none";
      currentSlide = slideIndex;
      slides[currentSlide].style.display = "block";
      updateSlideIndicators();
    }

    function updateSlideIndicators() {
      const dots = slideIndicator.querySelectorAll(".slide-dot");
      dots.forEach((dot, idx) => {
        if (idx === currentSlide) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });
    }

    destinationItem.appendChild(slideshow);

    // Description
    const description = document.createElement("div");
    description.className = "destination-description";
    description.textContent = destination.description;
    destinationItem.appendChild(description);

    // Average Rating Section - Initially hidden, will be populated later
    const averageRatingSection = document.createElement("div");
    averageRatingSection.className = "average-rating-section";
    destinationItem.appendChild(averageRatingSection);

    // Reviews Toggle Button
    const reviewsToggle = document.createElement("button");
    reviewsToggle.className = "reviews-toggle";
    reviewsToggle.innerHTML = `<span>Show Reviews</span> <i class="fas fa-chevron-down"></i>`;
    destinationItem.appendChild(reviewsToggle);

    // Reviews Container - Initially hidden
    const reviewsContainer = document.createElement("div");
    reviewsContainer.className = "reviews-container";
    reviewsContainer.style.display = "none";
    destinationItem.appendChild(reviewsContainer);

    // Add rating system
    const ratingSection = document.createElement("div");
    ratingSection.className = "rating-section";
    ratingSection.innerHTML = `
      <h3>Rate this destination</h3>
      <div class="stars-container" data-destination-id="${destination.id}">
        <span class="star" data-rating="1"><i class="fas fa-star"></i></span>
        <span class="star" data-rating="2"><i class="fas fa-star"></i></span>
        <span class="star" data-rating="3"><i class="fas fa-star"></i></span>
        <span class="star" data-rating="4"><i class="fas fa-star"></i></span>
        <span class="star" data-rating="5"><i class="fas fa-star"></i></span>
      </div>
      <div class="rating-value">0/5</div>
      <textarea class="review-text" placeholder="Share your experience..." rows="3"></textarea>
      <button class="submit-rating">Submit Rating</button>
      <div class="rating-message"></div>
    `;
    reviewsContainer.appendChild(ratingSection);

    // Add reviews list
    const reviewsSection = document.createElement("div");
    reviewsSection.className = "reviews-section";
    reviewsSection.innerHTML = `<h3>User Reviews</h3>`;

    const reviewsList = document.createElement("div");
    reviewsList.className = "reviews-list";
    reviewsList.innerHTML = "<p class='loading-reviews'>Loading reviews...</p>";
    reviewsSection.appendChild(reviewsList);
    reviewsContainer.appendChild(reviewsSection);

    // Toggle reviews visibility
    reviewsToggle.addEventListener("click", () => {
      const isVisible = reviewsContainer.style.display === "block";
      reviewsContainer.style.display = isVisible ? "none" : "block";
      reviewsToggle.innerHTML = isVisible
        ? `<span>Show Reviews</span> <i class="fas fa-chevron-down"></i>`
        : `<span>Hide Reviews</span> <i class="fas fa-chevron-up"></i>`;
    });

    // Add event listeners for the rating stars
    const stars = ratingSection.querySelectorAll(".star");
    const ratingValue = ratingSection.querySelector(".rating-value");
    const submitButton = ratingSection.querySelector(".submit-rating");
    const reviewText = ratingSection.querySelector(".review-text");
    const ratingMessage = ratingSection.querySelector(".rating-message");
    let selectedRating = 0;

    stars.forEach((star) => {
      // Hover effect
      star.addEventListener("mouseover", function () {
        const rating = parseInt(this.getAttribute("data-rating"));
        highlightStars(stars, rating);
      });

      // Mouse leave - return to selected rating
      star.addEventListener("mouseleave", function () {
        highlightStars(stars, selectedRating);
      });

      // Click to select rating
      star.addEventListener("click", function () {
        selectedRating = parseInt(this.getAttribute("data-rating"));
        ratingValue.textContent = `${selectedRating}/5`;
        highlightStars(stars, selectedRating);
      });
    });

    // Submit rating
    submitButton.addEventListener("click", function () {
      if (!window.currentUser) {
        ratingMessage.textContent = "Please log in to submit a rating";
        ratingMessage.className = "rating-message error";
        fadeMessage(ratingMessage);
        return;
      }

      if (selectedRating === 0) {
        ratingMessage.textContent = "Please select a rating";
        ratingMessage.className = "rating-message error";
        fadeMessage(ratingMessage);
        return;
      }

      const reviewData = {
        username: window.currentUser,
        destinationId: destination.id,
        rating: selectedRating,
        description: reviewText.value,
      };

      // Display loading state
      submitButton.disabled = true;
      submitButton.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Submitting...';

      fetch("../../server/api/saveRating.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      })
        .then((response) => response.json())
        .then((data) => {
          submitButton.disabled = false;
          submitButton.innerHTML = "Submit Rating";

          if (data.success) {
            ratingMessage.textContent = "Thank you for your rating!";
            ratingMessage.className = "rating-message success";
            fadeMessage(ratingMessage);

            // Refresh the reviews section to show the new/updated review
            refreshReviews(
              destination.id,
              reviewsSection,
              averageRatingSection
            );
          } else {
            ratingMessage.textContent = data.message || "Error saving rating";
            ratingMessage.className = "rating-message error";
            fadeMessage(ratingMessage);
          }
        })
        .catch((error) => {
          submitButton.disabled = false;
          submitButton.innerHTML = "Submit Rating";
          ratingMessage.textContent = "An error occurred";
          ratingMessage.className = "rating-message error";
          fadeMessage(ratingMessage);
          console.error("Error:", error);
        });
    });

    // Fetch and display reviews
    fetchDestinationReviews(destination.id)
      .then((reviewData) => {
        // Ensure reviewData has expected structure
        if (!reviewData.success) {
          throw new Error(reviewData.message || "Error fetching reviews");
        }

        // Make sure reviews is an array to prevent the length error
        const reviews = Array.isArray(reviewData.reviews)
          ? reviewData.reviews
          : [];
        const avgRating = reviewData.averageRating || 0;
        const reviewCount = reviews.length;

        // Update the average rating display
        updateAverageRatingDisplay(
          avgRating,
          reviewCount,
          averageRatingSection
        );

        // Update the reviews list
        updateReviewsList(reviews, reviewsList);

        // Pre-fill with user's existing review if it exists
        if (window.currentUser) {
          const userReview = reviews.find(
            (review) => review.username === window.currentUser
          );
          if (userReview) {
            selectedRating = parseInt(userReview.rating);
            ratingValue.textContent = `${selectedRating}/5`;
            highlightStars(stars, selectedRating);
            reviewText.value = userReview.description || "";
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        reviewsList.innerHTML =
          "<p class='error-message'>Failed to load reviews. Please try again later.</p>";
      });

    destinationList.appendChild(destinationItem);
  });
}

// Helper function to fade a message
function fadeMessage(messageElement) {
  setTimeout(() => {
    messageElement.classList.add("fade-out");
    setTimeout(() => {
      messageElement.textContent = "";
      messageElement.className = "rating-message";
    }, 1000);
  }, 3000);
}

// Helper function to highlight stars up to the selected rating
function highlightStars(stars, rating) {
  stars.forEach((star) => {
    const starRating = parseInt(star.getAttribute("data-rating"));
    if (starRating <= rating) {
      star.classList.add("active");
    } else {
      star.classList.remove("active");
    }
  });
}

// Generate HTML star rating display (filled and empty stars)
function generateStarRating(rating) {
  let starsHtml = "";
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  // Generate stars
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      starsHtml += '<i class="fas fa-star filled"></i>';
    } else if (i === fullStars + 1 && hasHalfStar) {
      starsHtml += '<i class="fas fa-star-half-alt filled"></i>';
    } else {
      starsHtml += '<i class="far fa-star"></i>';
    }
  }

  return starsHtml;
}

// Update average rating display
function updateAverageRatingDisplay(avgRating, reviewCount, container) {
  const roundedRating = Math.round(avgRating * 2) / 2; // Round to nearest 0.5

  container.innerHTML = `
    <div class="rating-summary">
      <div class="average-stars">
        ${generateStarRating(roundedRating)}
      </div>
      <div class="average-value">${avgRating.toFixed(
        1
      )} <span class="rating-count">(${reviewCount} ${
    reviewCount === 1 ? "review" : "reviews"
  })</span></div>
    </div>
  `;
}

// Update reviews list
function updateReviewsList(reviews, container) {
  container.innerHTML = "";

  if (reviews.length > 0) {
    reviews.forEach((review) => {
      const reviewItem = document.createElement("div");
      reviewItem.className = "review-item";
      reviewItem.innerHTML = `
        <div class="review-header">
          <div class="review-username">${review.username}</div>
          <div class="review-rating">${generateStarRating(review.rating)}</div>
        </div>
        ${
          review.description
            ? `<div class="review-text">${review.description}</div>`
            : ""
        }
      `;
      container.appendChild(reviewItem);
    });
  } else {
    container.innerHTML =
      "<p class='no-reviews'>No reviews yet. Be the first to review this destination!</p>";
  }
}

// Fetch reviews for a specific destination
function fetchDestinationReviews(destinationId) {
  return fetch(`../../server/api/getReviews.php?destinationId=${destinationId}`)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error in fetch:", error);
      return {
        success: false,
        message: "Failed to fetch reviews",
        reviews: [],
      };
    });
}

// Refresh the reviews section after submitting a new review
function refreshReviews(destinationId, reviewsSection, averageRatingSection) {
  fetchDestinationReviews(destinationId)
    .then((reviewData) => {
      // Safety check
      if (!reviewData.success) {
        throw new Error(reviewData.message || "Error refreshing reviews");
      }

      const reviews = reviewData.reviews || [];
      const avgRating = reviewData.averageRating || 0;
      const reviewCount = reviews.length;

      // Update average rating display
      updateAverageRatingDisplay(avgRating, reviewCount, averageRatingSection);

      // Update reviews list
      const reviewsList = reviewsSection.querySelector(".reviews-list");
      updateReviewsList(reviews, reviewsList);
    })
    .catch((error) => {
      console.error("Error refreshing reviews:", error);
    });
}
