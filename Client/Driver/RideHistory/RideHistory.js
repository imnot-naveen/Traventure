document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.querySelector(".logout-btn");

  fetch("http://localhost/Traventure/Server/api/getRideHistoryByDriver.php", {
    method: "GET",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      const container = document.getElementById("history-container");

      if (data.success) {
        if (data.data.length === 0) {
          container.innerHTML = "<p>No ride history found.</p>";
          return;
        }

        data.data.forEach((ride) => {
          const rideDiv = document.createElement("div");
          rideDiv.classList.add("ride-entry");

          rideDiv.innerHTML = `
            <h3>Request ID: ${ride.id}</h3>
            <p><strong>Date:</strong> ${ride.rideDate}</p>
            <p><strong>Time:</strong> ${ride.rideTime}</p>
            <p><strong>Pickup:</strong> ${ride.pickupPoint}</p>
            <p><strong>Drop:</strong> ${ride.dropPoint}</p>
          `;

          container.appendChild(rideDiv);
        });
      } else {
        container.innerHTML = `<p class="error-msg">${data.message}</p>`;
      }
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      document.getElementById("history-container").innerHTML =
        '<p class="error-msg">Error loading ride history.</p>';
    });

  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
});

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
