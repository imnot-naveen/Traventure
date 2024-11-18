document.addEventListener("DOMContentLoaded", () => {
  // Fetch user profile data
  fetch(
    `/traventure/server/api/getProfile.php?username=${encodeURIComponent(
      username
    )}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Display profile picture if available
        const profilePicture = document.querySelector(".profile-picture");
        if (data.data.profilePicture) {
          profilePicture.style.backgroundImage = `url('${data.data.profilePicture}')`;
        }

        // Populate the profile fields
        document.querySelector(
          ".name"
        ).innerText = `${data.data.firstName} ${data.data.lastName}`;
        document.getElementById("first-name").value = data.data.firstName;
        document.getElementById("last-name").value = data.data.lastName;
        document.getElementById("email").value = data.data.email;
        document.getElementById("contact-number").value = data.data.contactNo;
      } else {
        console.error(data.message);
        alert("Failed to load profile data. Please try again.");
      }
    })
    .catch((error) => {
      console.error("Error fetching user profile:", error);
      alert("An error occurred while fetching the profile data.");
    });

  // Handle logout button click
  const logoutButton = document.querySelector(".logout-btn");
  logoutButton.addEventListener("click", () => {
    fetch("/traventure/server/api/logout.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert(data.message); // Show success message
          window.location.href = "../login/loginpage.html"; // Redirect to login page
        } else {
          alert(data.message); // Show error message
        }
      })
      .catch((error) => {
        console.error("Error during logout:", error);
        alert("An error occurred while logging out.");
      });
  });
});
