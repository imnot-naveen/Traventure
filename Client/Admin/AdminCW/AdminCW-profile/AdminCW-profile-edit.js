// Get DOM elements
const updateModal = document.getElementById("updatecwModal");
const openModalBtn = document.querySelector(".update-button");
const closeModalBtn = document.querySelector(".close-u");
const updateForm = document.getElementById("updatecwForm");

// Function to fetch cw details and populate the modal
function fetchcwDetails(cwId) {
  fetch(`../../../../Server/api/updateCW.php?cwid=${cwId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const cw = data.data;
        document.getElementById("cwId").value = cw.cwid;
        document.getElementById("cwFirstName").value = cw.first_name || "";
        document.getElementById("cwLastName").value = cw.last_name || "";
        document.getElementById("cwPhone").value = cw.contact_number || "";
        updateModal.style.display = "flex";
      } else {
        alert(data.message || "Failed to fetch cw details.");
      }
    })
    .catch((error) => console.error("Error fetching cw details:", error));
}

// Open modal when button is clicked
openModalBtn.addEventListener("click", () => {
  const cwId = new URLSearchParams(window.location.search).get("cwid");
  if (cwId) {
    fetchcwDetails(cwId);
  } else {
    alert("cw ID is missing in the URL.");
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

// Handle form submission to update cw
updateForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = {
    cwid: document.getElementById("cwId").value,
    first_name: document.getElementById("cwFirstName").value,
    last_name: document.getElementById("cwLastName").value,
    contact_number: document.getElementById("cwPhone").value,
  };

  fetch("../../../../Server/api/updateCW.php", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert(data.message || "cw updated successfully.");
        updateModal.style.display = "none";
      } else {
        alert(data.message || "Failed to update cw.");
      }
    })
    .catch((error) => console.error("Error updating cw:", error));
});
