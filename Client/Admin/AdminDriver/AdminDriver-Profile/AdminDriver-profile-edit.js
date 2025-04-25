// Get DOM elements
const updateModal = document.getElementById("updatedriverModal");
const openModalBtn = document.querySelector(".update-button");
const closeModalBtn = document.querySelector(".close-u");
const updateForm = document.getElementById("updatedriverForm");

// Function to fetch driver details and populate the modal
function fetchdriverDetails(driverId) {
  fetch(`../../../../Server/api/getDriverByID.php?driverID=${driverId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {

        const driver = data.data.data;
        console.log("Driver data:", driver);

        document.getElementById("driverId").value = driver.id ?? "";
        document.getElementById("driverFirstName").value = driver.firstName ?? "";
        document.getElementById("driverLastName").value = driver.lastName ?? "";
        document.getElementById("driverPhone").value = driver.contactNo?.toString() ?? "";        
        updateModal.style.display = "flex";
      } else {
        alert(data.message || "Failed to fetch driver details.");
      }
    })
    .catch((error) => console.error("Error fetching driver details:", error));
}

// Open modal when button is clicked
openModalBtn.addEventListener("click", () => {
  const driverId = new URLSearchParams(window.location.search).get("driver");
  if (driverId) {
    fetchdriverDetails(driverId);
  } else {
    alert("driver ID is missing in the URL.");
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

// Handle form submission to update driver
updateForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = {
    id: document.getElementById("driverId").value,
    first_name: document.getElementById("driverFirstName").value,
    last_name: document.getElementById("driverLastName").value,
    contact_number: document.getElementById("driverPhone").value,
  };

  fetch("../../../../Server/api/updateDriver.php", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert(data.message || "driver updated successfully.");
        updateModal.style.display = "none";
      } else {
        alert(data.message || "Failed to update driver.");
      }
    })
    .catch((error) => console.error("Error updating driver:", error));
});
