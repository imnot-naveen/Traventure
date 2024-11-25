// Get DOM elements
const updateModal = document.getElementById("updateTspModal");
const openModalBtn = document.querySelector(".update-button");
const closeModalBtn = document.querySelector(".close");
const updateForm = document.getElementById("updateTspForm");

// Function to fetch TSP details and populate the modal
function fetchTspDetails(tspId) {
  fetch(`../../../../Server/api/adminTspUpdate.php?tspid=${tspId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const tsp = data.data;
        document.getElementById("tspId").value = tsp.tspid;
        document.getElementById("tspFirstName").value = tsp.first_name || "";
        document.getElementById("tspLastName").value = tsp.last_name || "";
        document.getElementById("tspPhone").value = tsp.contact_number || "";
        updateModal.style.display = "flex";
      } else {
        alert(data.message || "Failed to fetch TSP details.");
      }
    })
    .catch((error) => console.error("Error fetching TSP details:", error));
}

// Open modal when button is clicked
openModalBtn.addEventListener("click", () => {
  const tspId = new URLSearchParams(window.location.search).get("tspid");
  if (tspId) {
    fetchTspDetails(tspId);
  } else {
    alert("TSP ID is missing in the URL.");
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

// Handle form submission to update TSP
updateForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = {
    tspid: document.getElementById("tspId").value,
    first_name: document.getElementById("tspFirstName").value,
    last_name: document.getElementById("tspLastName").value,
    contact_number: document.getElementById("tspPhone").value,
  };

  fetch("../../../../Server/api/adminTspUpdate.php", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert(data.message || "TSP updated successfully.");
        updateModal.style.display = "none";
      } else {
        alert(data.message || "Failed to update TSP.");
      }
    })
    .catch((error) => console.error("Error updating TSP:", error));
});
