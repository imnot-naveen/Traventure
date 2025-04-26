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

// Handle CW registration form submission
document
  .getElementById("addCWForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Get form input values
    const cwid = document.getElementById("cwid").value; // Change tspid to cwid
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
      cwid: cwid, 
      username: username,
      firstName: firstName,
      lastName: lastName,
      IDNumber: IDNumber,
      email: email,
      contactNumber: contactNumber,
      password: newPassword, 
    };

    // Send the data to the API
    fetch("../../../Server/api/adminAddCw.php", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((jsonData) => {
        if (jsonData.success) {
          alert("CW Registration successful!");
          modal.style.display = "none";
        } else {
          alert(jsonData.message || "CW registration failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
      });
  });
