function showLoading() {
  document.getElementById("loading-spinner").classList.remove("hidden");
  document.getElementById("booking-list").classList.add("hidden");
  document.getElementById("error-message").classList.add("hidden");
  document.getElementById("no-results").classList.add("hidden");
}

async function getUserIDFromSession() {
  try {
      const response = await fetch('http://localhost/Traventure/Server/api/getUserId.php', {
          method: 'GET',
          credentials: 'include' 
      });

      const data = await response.json();

      if (response.ok && data.success) {
          return data.userID;
      } else {
          throw new Error(data.message || "Not logged in");
      }
  } catch (error) {
      console.error("Error fetching user ID:", error);
      return null;
  }
}

function hideLoading() {
  document.getElementById("loading-spinner").classList.add("hidden");
}

function displayBookingCards(bookings) {
  const listContainer = document.getElementById("booking-list");
  listContainer.innerHTML = ""; 

  const template = document.getElementById("booking-template");

  bookings.forEach(booking => {
    const clone = template.content.cloneNode(true);

    clone.querySelector(".booking-id-value").textContent = booking.bookingID ?? "N/A";
    clone.querySelector(".booking-status").textContent = booking.paymentStatus ?? "N/A";
    clone.querySelector(".train-name").textContent = booking.name ?? "Train Name";
    clone.querySelector(".train-number").textContent = `#${booking.trainID ?? "N/A"}`;
    clone.querySelector(".journey-date-value").textContent = new Date(booking.bookingDate).toLocaleDateString() ?? "N/A";
    clone.querySelector(".departure-time").textContent = "--:--"; // If available, replace this
    clone.querySelector(".arrival-time").textContent = "--:--";   // If available, replace this
    clone.querySelector(".from-station-name").textContent = booking.start_station_name ?? "N/A";
    clone.querySelector(".to-station-name").textContent = booking.destination_station_name ?? "N/A";
    clone.querySelector(".passenger-count-value").textContent = booking.no_of_passengers ?? "0";
    clone.querySelector(".class-value").textContent = booking.class ?? "N/A";
    clone.querySelector(".price-value").textContent = `Rs. ${booking.total_fare ?? "0.00"}`;

    const cancelBtn = clone.querySelector(".cancel-btn");
    cancelBtn.textContent = booking.paymentStatus === "Paid" ? "Cancel Booking" : "Not Available";
    cancelBtn.disabled = booking.paymentStatus !== "Paid";

    listContainer.appendChild(clone);
  });

  listContainer.classList.remove("hidden");
}

async function fetchBookingHistory() {
  showLoading();

  try {
      const userID = await getUserIDFromSession();
      if (!userID) throw new Error("User ID not available");

      const response = await fetch(`http://localhost/Traventure/Server/api/getBookingbyUser.php?userID=${userID}`);
      const data = await response.json();

      hideLoading();

      if (data.success && Array.isArray(data.data)) {
          if (data.data.length === 0) {
              document.getElementById("no-results").classList.remove("hidden");
          } else {
              displayBookingCards(data.data);
          }
      } else {
          document.getElementById("error-message").classList.remove("hidden");
      }
  } catch (error) {
      console.error("Error fetching booking history:", error);
      hideLoading();
      document.getElementById("error-message").classList.remove("hidden");
  }
}
