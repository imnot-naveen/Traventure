// Get DOM elements
const modal = document.getElementById("userModal");
const openModalBtn = document.getElementById("Add-user");
const closeModalBtn = document.querySelector(".close-m");
const cancelBtn = document.getElementById("cancelBtn");

// Open Modal
openModalBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

// Close Modal
closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

cancelBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Close Modal when clicking outside content
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});


// Handle TSP registration form submission
document
  .getElementById("addTspForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Get form input values
    const username = document.getElementById("username").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const IDNumber = document.getElementById("IDNumber").value;
    const contactNumber = document.getElementById("contactNumber").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    // Prepare the data to send to the server
    const requestData = {
      username: username,
      firstName: firstName,
      lastName: lastName,
      IDNumber: IDNumber,
      email: email,
      contactNumber: contactNumber,
      password: newPassword, // Note: Password hashing is handled server-side
    };


    // Send the data to the API
    fetch("../../../Server/api/adminTspAdd.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((jsonData) => {
        if (jsonData.success) {
          alert("TSP Registration successful!");
          modal.style.display = "none";
        } else {
          alert(jsonData.message || "TSP registration failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
      });
  });
