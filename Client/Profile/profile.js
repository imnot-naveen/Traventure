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
          alert(data.message);
          window.location.href = "../login/loginpage.html";
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error("Error during logout:", error);
        alert("An error occurred while logging out.");
      });
  });

  // Handle edit profile button
  const editProfileLink = document.querySelector(".edit-profile");
  const saveButton = document.querySelector(".save-btn");
  const profileInputs = document.querySelectorAll(".profile-form input");

  // Hide save button initially
  saveButton.style.display = "none";

  editProfileLink.addEventListener("click", (e) => {
    e.preventDefault();

    // Toggle input disabled state
    profileInputs.forEach((input) => {
      input.disabled = !input.disabled;
    });

    // Show/hide save button based on input state
    if (!profileInputs[0].disabled) {
      saveButton.style.display = "block";
      editProfileLink.textContent = "Cancel Edit";
    } else {
      saveButton.style.display = "none";
      editProfileLink.textContent = "Edit profile..";

      // Revert to original values if cancelled
      document.getElementById("first-name").value = document
        .querySelector(".name")
        .textContent.split(" ")[0];
      document.getElementById("last-name").value = document
        .querySelector(".name")
        .textContent.split(" ")[1];
      document.getElementById("email").value = document
        .getElementById("email")
        .getAttribute("data-original");
      document.getElementById("contact-number").value = document
        .getElementById("contact-number")
        .getAttribute("data-original");
    }
  });

  // Handle save button click
  saveButton.addEventListener("click", () => {
    // Collect updated profile data
    const updatedProfile = {
      firstName: document.getElementById("first-name").value,
      lastName: document.getElementById("last-name").value,
      email: document.getElementById("email").value,
      contactNo: document.getElementById("contact-number").value,
    };

    // Send updated profile to server
    fetch("/traventure/server/api/updateProfile.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProfile),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Profile updated successfully!");

          // Update name display
          document.querySelector(
            ".name"
          ).textContent = `${updatedProfile.firstName} ${updatedProfile.lastName}`;

          // Disable inputs and hide save button
          profileInputs.forEach((input) => {
            input.disabled = true;
          });
          saveButton.style.display = "none";
          document.querySelector(".edit-profile").textContent =
            "Edit profile..";
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        alert("An error occurred while updating the profile.");
      });
  });
});
