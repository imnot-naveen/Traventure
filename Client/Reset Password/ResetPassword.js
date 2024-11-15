document
  .getElementById("reset-password-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (newPassword === confirmPassword) {
      // Proceed with password reset logic (e.g., send to server)
      alert("Password has been reset successfully!");
      // Redirect to login or another page if needed
    } else {
      alert("Passwords do not match. Please try again.");
    }
  });
