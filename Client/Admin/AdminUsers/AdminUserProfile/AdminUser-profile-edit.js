// Get DOM elements
const updateModal = document.getElementById("updateUserModal");
const openModalBtn = document.querySelector(".update-button");
const closeModalBtn = document.querySelector(".close-u");
const updateForm = document.getElementById("updateUserForm");

// Function to fetch user details and populate the modal
function fetchUserDetails(userId) {
  fetch(`../../../../Server/api/adminUserUpdate.php?userid=${userId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const user = data.data;
        document.getElementById("userId").value = user.userid;
        document.getElementById("userFirstName").value = user.first_name || "";
        document.getElementById("userLastName").value = user.last_name || "";
        document.getElementById("userPhone").value = user.contact_number || "";
        updateModal.style.display = "flex";
      } else {
        alert(data.message || "Failed to fetch user details.");
      }
    })
    .catch((error) => console.error("Error fetching user details:", error));
}

// Open modal when button is clicked
openModalBtn.addEventListener("click", () => {
  const userId = new URLSearchParams(window.location.search).get("userid");
  if (userId) {
    fetchUserDetails(userId);
  } else {
    alert("user ID is missing in the URL.");
  }
});

// Close modal on close button click
closeModalBtn.addEventListener("click", () => {
  updateModal.style.display = "none";
});

// Handle modal close when clicking outside
window.addEventListener("click", (event) => {
  if (event.target === updateModal) {
    updateModal.style.display = "none";
  }
});

// Handle form submission to update user
updateForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = {
    userid: document.getElementById("userId").value,
    first_name: document.getElementById("userFirstName").value,
    last_name: document.getElementById("userLastName").value,
    contact_number: document.getElementById("userPhone").value,
  };

  fetch("../../../../Server/api/adminUserUpdate.php", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert(data.message || "user updated successfully.");
        updateModal.style.display = "none";
      } else {
        alert(data.message || "Failed to update user.");
      }
    })
    .catch((error) => console.error("Error updating user:", error));
});
