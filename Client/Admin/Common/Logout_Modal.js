//Logout modal
// Get elements
const logoutButton = document.getElementById("logoutButton");
const logoutDialog = document.getElementById("logoutDialog");
const confirmLogout = document.getElementById("confirmLogout");
const cancelLogout = document.getElementById("cancelLogout");

// Open dialog
logoutButton.addEventListener("click", () => {
  logoutDialog.style.display = "flex";
});

// Confirm logout
confirmLogout.addEventListener("click", () => {
  alert("You have logged out.");
  logoutDialog.style.display = "none";
  // Add actual logout logic here, e.g., redirect to login page
  window.location.href = "../../Login/LoginPage.html";
});

// Cancel logout
cancelLogout.addEventListener("click", () => {
  logoutDialog.style.display = "none";
});

// Close dialog when clicking outside the modal
window.addEventListener("click", (event) => {
  if (event.target === logoutDialog) {
    logoutDialog.style.display = "none";
  }
});
