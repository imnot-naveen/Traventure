document
  .getElementById("verification-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    const verificationCode = document.getElementById("verification-code").value;

    // Simulate verification logic
    if (verificationCode === "123456") {
      // Replace with actual verification logic
      alert("Verification successful! You can now reset your password.");
      // Redirect to the password reset page or another action
      window.location.href = "reset-password.html"; // Change to your actual reset password page
    } else {
      alert("Invalid verification code. Please try again.");
    }
  });
