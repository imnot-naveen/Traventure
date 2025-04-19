// Get elements
const logoutButton = document.getElementById("logoutButton");
const confirmLogout = document.getElementById("confirmLogout");
const cancelLogout = document.getElementById("cancelLogout");
const logoutDialog = document.getElementById("logoutDialog");

// Handle logout button click to show modal
logoutButton.addEventListener("click", () => {
  logoutDialog.style.display = "flex"; // Show the modal dialog
});

// Confirm logout from the modal
confirmLogout.addEventListener("click", () => {
  fetch("http://localhost/Traventure/Server/api/logout.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert(data.message); // Notify user of successful logout
        window.location.href = "../../Login/LoginPage.html"; 
      } else {
        alert(data.message); // Display any error message from the backend
      }
    })
    .catch((error) => {
      console.error("Error during logout:", error);
      alert("An error occurred while logging out."); // Alert on error
    });

  logoutDialog.style.display = "none"; // Close the dialog
});

// Cancel logout from the modal
cancelLogout.addEventListener("click", () => {
  logoutDialog.style.display = "none"; // Close the dialog
});

// Close dialog when clicking outside the modal
window.addEventListener("click", (event) => {
  if (event.target === logoutDialog) {
    logoutDialog.style.display = "none"; // Close dialog if clicked outside
  }
});
