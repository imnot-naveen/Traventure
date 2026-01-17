document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.querySelector(".logout-btn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
});

// Fetch ride requests and display them with accept buttons
fetch("http://localhost/Traventure/Server/api/getRequestByDriver.php", {
  method: "GET",
  credentials: "include",
})
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById("requests-container");

    if (data.success) {
      const requests = data.data;

      if (requests.length === 0) {
        container.innerHTML = "<p>No upcoming ride requests found.</p>";
        return;
      }

      requests.forEach((req) => {
        const div = document.createElement("div");
        div.classList.add("request-card");
        div.innerHTML = `
          <h3>Request ID: ${req.id}</h3>
          <p><strong>Client Name:</strong> ${req.client_fullName}</p>
          <p><strong>Destination:</strong> ${req.destination}</p>
          <p><strong>Passenger Count:</strong> ${req.passengerCount}</p>
          <p><strong>Client Email:</strong> ${req.email}</p>
          <p><strong>Client Contact No:</strong> ${req.contactNo}</p>
          <p><strong>Date:</strong> ${formatDate(req.rideDate)}</p>
          <button class="accept-btn" data-request-id="${
            req.id
          }">Accept Request</button>
        `;
        container.appendChild(div);
      });

      // Add event listeners to all accept buttons
      document.querySelectorAll(".accept-btn").forEach((button) => {
        button.addEventListener("click", function () {
          const requestId = this.getAttribute("data-request-id");
          acceptRequest(requestId, this);
        });
      });
    } else {
      container.innerHTML = `<p class="error">${data.message}</p>`;
    }
  })
  .catch((err) => {
    document.getElementById(
      "requests-container"
    ).innerHTML = `<p class="error">Fetch error: ${err}</p>`;
  });

// Function to format date nicely
function formatDate(dateString) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Function to accept a ride request
function acceptRequest(requestId, buttonElement) {
  buttonElement.disabled = true;
  buttonElement.textContent = "Processing...";

  fetch("http://localhost/Traventure/Server/api/acceptRideRequest.php", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ requestID: requestId }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        const card = buttonElement.closest(".request-card");
        card.classList.add("accepted");
        buttonElement.textContent = "Accepted ✓";
        buttonElement.classList.add("accepted-btn");

        // Show success alert
        alert("Ride request accepted successfully!");

        // You could also choose to remove the card after a delay
        setTimeout(() => {
          card.style.opacity = "0";
          setTimeout(() => {
            card.remove();
            // If no more requests, show message
            if (document.querySelectorAll(".request-card").length === 0) {
              document.getElementById("requests-container").innerHTML =
                "<p>No more pending ride requests.</p>";
            }
          }, 500);
        }, 2000);
      } else {
        // Show error and re-enable the button
        buttonElement.textContent = "Failed - Try Again";
        buttonElement.disabled = false;
        alert("Failed to accept request: " + data.message);
      }
    })
    .catch((err) => {
      buttonElement.textContent = "Error - Try Again";
      buttonElement.disabled = false;
      console.error("Error accepting request:", err);
      alert("Network error. Please try again.");
    });
}

function handleLogout(event) {
  event.preventDefault(); // Prevent default link behavior

  // Show confirmation dialog
  if (confirm("Are you sure you want to logout?")) {
    // Perform logout request
    fetch("../../../server/api/logout.php", {
      method: "POST",
      credentials: "same-origin", // Important for session handling
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", // Changed content type
      },
      body: "logout=true", // Add a simple body to ensure POST request works
    })
      .then((response) => {
        // Check if response is ok
        if (!response.ok) {
          throw new Error("Logout request failed");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          // Successful logout
          alert("Logged out successfully");
          window.location.href = "../../login/loginpage.html";
        } else {
          // Logout failed
          alert(data.message || "Logout failed");
        }
      })
      .catch((error) => {
        console.error("Logout error:", error);
        alert("An unexpected error occurred during logout");
      });
  }
}

function showLogoutSuccessMessage() {
  const toastContainer = createToastContainer();
  const toast = document.createElement("div");
  toast.classList.add("toast", "success");
  toast.textContent = "Logged out successfully";
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        toastContainer.removeChild(toast);
      }, 300);
    }, 3000);
  }, 10);
}

function showLogoutErrorMessage(message) {
  const toastContainer = createToastContainer();
  const toast = document.createElement("div");
  toast.classList.add("toast", "error");
  toast.textContent = message || "Logout failed";
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        toastContainer.removeChild(toast);
      }, 300);
    }, 3000);
  }, 10);
}

function createToastContainer() {
  // Check if toast container already exists
  let toastContainer = document.getElementById("toast-container");

  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    document.body.appendChild(toastContainer);
  }

  return toastContainer;
}

function redirectToLogin() {
  // Redirect to login page after successful logout
  window.location.href = "../../login/loginpage.html";
}
