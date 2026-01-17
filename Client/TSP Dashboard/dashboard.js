document.addEventListener("DOMContentLoaded", () => {
  // Attach logout event listener
  const logoutBtn = document.querySelector(".logout-btn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
});

populate();

function populateFields(train, route, passenger, revenue) {
  document.getElementById("trains").textContent = train + " Trains";
  document.getElementById("routes").textContent = route + " Routes";
  document.getElementById("passengers").textContent = passenger + " Passengers";
  document.getElementById("revenue").textContent = "Rs. " + revenue;
}

function populate() {
  fetch("../../Server/api/tspdashboard.php")
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // Check what data is returned from the API
      train = data.tspData.trains.trains;
      route = data.tspData.routes.routes;
      passenger = data.tspData.passengers.passengers;
      revenue = data.tspData.revenue.revenue;

      populateFields(train, route, passenger, revenue);
    })
    .catch((error) => {
      // Handle errors during the fetch
      console.error("Fetch error:", error);
      blogContainer.innerHTML = "<p>Error loading data.</p>";
      const blogWrapper = document.querySelector(".blog-wrapper");
      if (blogWrapper) {
        blogWrapper.classList.remove("hidden");
      }
    });
}

function handleLogout(event) {
  event.preventDefault(); // Prevent default link behavior

  // Show confirmation dialog
  if (confirm("Are you sure you want to logout?")) {
    // Perform logout request
    fetch("../../server/api/logout.php", {
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
          alert("Logged out successfully"); // Temporary alert for debugging
          window.location.href = "../login/loginpage.html";
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
  window.location.href = "../login/loginpage.html";
}
