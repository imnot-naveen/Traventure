// Get DOM elements
const modal = document.getElementById("driverModal");
const openModalBtn = document.getElementById("Add-driver");
const closeModalBtn = document.querySelector(".close");
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

// Handle Form Submission
document.getElementById("addDriverForm")
  .addEventListener("submit", (event) => {
    event.preventDefault();

  const username = document.getElementById("username").value;
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const contactNumber = document.getElementById("contactNumber").value;
  const nic = document.getElementById("nic").value;
  const station = document.getElementById("station").value;
  const vehicle = document.getElementById("vehicle").value;
  const license = document.getElementById("license").value;
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
      email: email,
      IDNumber: nic,
      contactNumber: contactNumber,
      password: newPassword, 
      assignedStation: station,
      vehicleID: vehicle,
      license: license
    };


  fetch("../../../Server/api/addDriver.php", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
  })
      .then((response) => response.json())
      .then((jsonData) => {
          if (jsonData.success) {
              alert("Driver added successfully!");
              modal.style.display = "none";
        document.getElementById("addDriverForm").reset(); 
          } else {
              alert("Error adding user: " + data.error);
          }
      })
      .catch((error) => console.error("Error:", error));
});

