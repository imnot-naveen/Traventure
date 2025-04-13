document.addEventListener("DOMContentLoaded", () => {
  // Helper function to safely update element
  const safeSetElement = (selector, value, property = "value") => {
    const element = document.querySelector(selector);
    if (element) {
      if (property === "value") {
        element.value = value;
        element.setAttribute("data-original", value);
      } else {
        element[property] = value;
      }
    }
  };

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
        if (profilePicture && data.data.profilePicture) {
          profilePicture.style.backgroundImage = `url('${data.data.profilePicture}')`;
        }

        // Populate basic profile fields
        safeSetElement(
          ".name",
          `${data.data.firstName} ${data.data.lastName}`,
          "innerText"
        );
        safeSetElement("#first-name", data.data.firstName);
        safeSetElement("#last-name", data.data.lastName);
        safeSetElement("#email", data.data.email);
        safeSetElement("#contact-number", data.data.contactNo);

        // Handle destinations
        const destinationContainer = document.querySelector(
          ".destinations-container"
        );
        if (destinationContainer && data.data.destinations) {
          const destinationsHTML = data.data.destinations
            .map(
              (dest) => `
              <div class="destination-item">
                <input type="checkbox" 
                       id="dest-${dest.type_id}" 
                       name="destinations[]" 
                       value="${dest.type_id}"
                       ${dest.is_preferred ? "checked" : ""}
                       disabled>
                <label for="dest-${dest.type_id}">${dest.type}</label>
              </div>
            `
            )
            .join("");
          destinationContainer.innerHTML = destinationsHTML;

          // Store original selections for cancel functionality
          const originalSelections = data.data.destinations
            .filter((dest) => dest.is_preferred)
            .map((dest) => dest.type_id);
          destinationContainer.setAttribute(
            "data-original",
            JSON.stringify(originalSelections)
          );
        }
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
  if (logoutButton) {
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
  }

  // Handle edit profile button
  const editProfileLink = document.querySelector(".edit-profile");
  const saveButton = document.querySelector(".save-btn");
  const profileInputs = document.querySelectorAll(
    ".profile-form input:not([name='destinations[]'])"
  );

  // Hide save button initially
  if (saveButton) {
    saveButton.style.display = "none";
  }

  if (editProfileLink) {
    editProfileLink.addEventListener("click", (e) => {
      e.preventDefault();

      // Toggle input disabled state
      profileInputs.forEach((input) => {
        input.disabled = !input.disabled;
      });

      // Toggle destination checkboxes
      const destinationCheckboxes = document.querySelectorAll(
        'input[name="destinations[]"]'
      );
      destinationCheckboxes.forEach((checkbox) => {
        checkbox.disabled = !checkbox.disabled;
      });

      if (saveButton) {
        if (!profileInputs[0].disabled) {
          saveButton.style.display = "block";
          editProfileLink.textContent = "Cancel Edit";
        } else {
          saveButton.style.display = "none";
          editProfileLink.textContent = "Edit profile..";

          // Revert basic info
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

          // Revert destinations to original state
          const destinationContainer = document.querySelector(
            ".destinations-container"
          );
          if (destinationContainer) {
            const originalSelections = JSON.parse(
              destinationContainer.getAttribute("data-original") || "[]"
            );

            destinationCheckboxes.forEach((checkbox) => {
              checkbox.checked = originalSelections.includes(checkbox.value);
            });
          }
        }
      }
    });
  }

  // Handle save button click
  if (saveButton) {
    saveButton.addEventListener("click", () => {
      // Get current and original destination selections
      const destinationContainer = document.querySelector(
        ".destinations-container"
      );
      const originalSelections = JSON.parse(
        destinationContainer.getAttribute("data-original") || "[]"
      );

      const currentSelections = Array.from(
        document.querySelectorAll('input[name="destinations[]"]:checked')
      ).map((checkbox) => checkbox.value);

      // Calculate changes
      const toAdd = currentSelections.filter(
        (id) => !originalSelections.includes(id)
      );
      const toRemove = originalSelections.filter(
        (id) => !currentSelections.includes(id)
      );

      // Debug log
      console.log("Original selections:", originalSelections);
      console.log("Current selections:", currentSelections);
      console.log("To Add:", toAdd);
      console.log("To Remove:", toRemove);

      // Collect updated profile data
      const updatedProfile = {
        firstName: document.getElementById("first-name")?.value || "",
        lastName: document.getElementById("last-name")?.value || "",
        email: document.getElementById("email")?.value || "",
        contactNo: document.getElementById("contact-number")?.value || "",
        destinationChanges: {
          add: toAdd,
          remove: toRemove,
        },
      };

      console.log("Sending update:", updatedProfile);

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
          console.log("Server response: ", data);
          if (data.success) {
            alert("Profile updated successfully!");

            // Update displayed name
            const nameElement = document.querySelector(".name");
            if (nameElement) {
              nameElement.textContent = `${updatedProfile.firstName} ${updatedProfile.lastName}`;
            }

            // Disable all inputs and checkboxes
            profileInputs.forEach((input) => {
              input.disabled = true;
            });

            const destinationCheckboxes = document.querySelectorAll(
              'input[name="destinations[]"]'
            );
            destinationCheckboxes.forEach((checkbox) => {
              checkbox.disabled = true;
            });

            // Update stored original destinations
            destinationContainer.setAttribute(
              "data-original",
              JSON.stringify(currentSelections)
            );

            saveButton.style.display = "none";
            if (editProfileLink) {
              editProfileLink.textContent = "Edit profile..";
            }
          } else {
            alert(data.message);
          }
        })
        .catch((error) => {
          console.error("Error updating profile:", error);
          alert("An error occurred while updating the profile.");
        });
    });
  }
});
