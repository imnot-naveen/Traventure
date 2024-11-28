document.addEventListener("DOMContentLoaded", () => {
  // Attach logout event listener
  const logoutBtn = document.querySelector(".logout-btn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
});

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
