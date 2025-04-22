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

    // Create reviews section ahead of time
    const reviewsSection = document.createElement("div");
    reviewsSection.className = "reviews-section";
    reviewsSection.innerHTML = `<h3>User Reviews</h3>`;

    const reviewsList = document.createElement("div");
    reviewsList.className = "reviews-list";
    reviewsList.innerHTML = "<p class='loading-reviews'>Loading reviews...</p>";

    reviewsSection.appendChild(reviewsList);

    // Fetch and display the average rating and reviews
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

        // Add the average rating display
        const averageRatingSection = document.createElement("div");
        averageRatingSection.className = "average-rating-section";

        // Create star display for average rating
        const roundedRating = Math.round(avgRating * 2) / 2; // Round to nearest 0.5

        averageRatingSection.innerHTML = `
          <h3>Average Rating</h3>
          <div class="average-stars">
            ${generateStarRating(roundedRating)}
          </div>
          <div class="average-value">${avgRating.toFixed(
            1
          )} / 5 (${reviewCount} reviews)</div>
        `;

        destinationItem.appendChild(averageRatingSection);

        // Add rating system for the user
        const ratingSection = document.createElement("div");
        ratingSection.className = "rating-section";
        ratingSection.innerHTML = `
          <h3>Rate this destination</h3>
          <div class="stars-container" data-destination-id="${destination.id}">
            <span class="star" data-rating="1">★</span>
            <span class="star" data-rating="2">★</span>
            <span class="star" data-rating="3">★</span>
            <span class="star" data-rating="4">★</span>
            <span class="star" data-rating="5">★</span>
          </div>
          <div class="rating-value">0/5</div>
          <textarea class="review-text" placeholder="Share your experience..." rows="3"></textarea>
          <button class="submit-rating">Submit Rating</button>
          <div class="rating-message"></div>
        `;

        destinationItem.appendChild(ratingSection);

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

        // Submit rating
        submitButton.addEventListener("click", function () {
          if (!window.currentUser) {
            ratingMessage.textContent = "Please log in to submit a rating";
            ratingMessage.style.color = "red";
            return;
          }

          if (selectedRating === 0) {
            ratingMessage.textContent = "Please select a rating";
            ratingMessage.style.color = "red";
            return;
          }

          const reviewData = {
            username: window.currentUser,
            destinationId: destination.id,
            rating: selectedRating,
            description: reviewText.value,
          };

          fetch("../../server/api/saveRating.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(reviewData),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                ratingMessage.textContent = "Thank you for your rating!";
                ratingMessage.style.color = "green";

                // Refresh the reviews section to show the new/updated review
                refreshReviews(destination.id, reviewsSection);

                setTimeout(() => {
                  ratingMessage.textContent = "";
                }, 3000);
              } else {
                ratingMessage.textContent =
                  data.message || "Error saving rating";
                ratingMessage.style.color = "red";
              }
            })
            .catch((error) => {
              ratingMessage.textContent = "An error occurred";
              ratingMessage.style.color = "red";
              console.error("Error:", error);
            });
        });

        // Update the reviews list
        reviewsList.innerHTML = "";
        if (reviews.length > 0) {
          reviews.forEach((review) => {
            const reviewItem = document.createElement("div");
            reviewItem.className = "review-item";
            reviewItem.innerHTML = `
              <div class="review-header">
                <div class="review-username">${review.username}</div>
                <div class="review-rating">${generateStarRating(
                  review.rating
                )}</div>
              </div>
              <div class="review-text">${review.description || ""}</div>
            `;
            reviewsList.appendChild(reviewItem);
          });
        } else {
          reviewsList.innerHTML =
            "<p class='no-reviews'>No reviews yet. Be the first to review this destination!</p>";
        }
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        reviewsList.innerHTML =
          "<p class='error-message'>Failed to load reviews. Please try again later.</p>";
      });

    // Append the reviews section last
    destinationItem.appendChild(reviewsSection);
    destinationList.appendChild(destinationItem);
  });
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

  // Generate full stars
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      starsHtml += '<span class="star-display filled">★</span>';
    } else if (i - 0.5 <= rating) {
      starsHtml += '<span class="star-display half-filled">★</span>';
    } else {
      starsHtml += '<span class="star-display">★</span>';
    }
  }

  return starsHtml;
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
function refreshReviews(destinationId, reviewsSection) {
  fetchDestinationReviews(destinationId)
    .then((reviewData) => {
      // Safety check
      if (!reviewData.success) {
        throw new Error(reviewData.message || "Error refreshing reviews");
      }

      const reviews = reviewData.reviews || [];
      const avgRating = reviewData.averageRating || 0;
      const reviewCount = reviews.length;

      const reviewsList = reviewsSection.querySelector(".reviews-list");
      reviewsList.innerHTML = "";

      const avgRatingDisplay = document.querySelector(".average-value");
      if (avgRatingDisplay) {
        avgRatingDisplay.textContent = `${avgRating.toFixed(
          1
        )} / 5 (${reviewCount} reviews)`;

        const avgStars = document.querySelector(".average-stars");
        if (avgStars) {
          const roundedRating = Math.round(avgRating * 2) / 2;
          avgStars.innerHTML = generateStarRating(roundedRating);
        }
      }

      if (reviews.length > 0) {
        reviews.forEach((review) => {
          const reviewItem = document.createElement("div");
          reviewItem.className = "review-item";
          reviewItem.innerHTML = `
            <div class="review-header">
              <div class="review-username">${review.username}</div>
              <div class="review-rating">${generateStarRating(
                review.rating
              )}</div>
            </div>
            <div class="review-text">${review.description || ""}</div>
          `;
          reviewsList.appendChild(reviewItem);
        });
      } else {
        reviewsList.innerHTML =
          "<p class='no-reviews'>No reviews yet. Be the first to review this destination!</p>";
      }
    })
    .catch((error) => {
      console.error("Error refreshing reviews:", error);
    });
}
