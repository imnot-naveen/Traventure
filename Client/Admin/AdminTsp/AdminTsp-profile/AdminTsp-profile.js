// Sidebar toggle functionality
const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");

menuBtn.addEventListener('click', () => {
  sideMenu.classList.add('open'); // Add the 'open' class for smooth transition
});

closeBtn.addEventListener('click', () => {
  sideMenu.classList.remove('open'); // Remove the 'open' class to close the sidebar
});

// Pagination variables and functions
let currentPage = 1;
const rowsPerPage = 6;

function displayTable() {
    const tableBody = document.getElementById("userTableBody");
    const rows = Array.from(tableBody.getElementsByTagName("tr"));
    const totalRows = rows.length;

    // Calculate start and end indices for current page
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    // Hide all rows initially
    rows.forEach((row, index) => {
        row.style.display = index >= start && index < end ? "" : "none";
    });

    // Update page info and button states
    document.getElementById("pageInfo").innerText = `Page ${currentPage} of ${Math.ceil(totalRows / rowsPerPage)}`;
    document.getElementById("prevBtn").disabled = currentPage === 1;
    document.getElementById("nextBtn").disabled = currentPage === Math.ceil(totalRows / rowsPerPage);
}

function nextPage() {
    currentPage++;
    displayTable();
}

function prevPage() {
    currentPage--;
    displayTable();
}

// Initialize the table display on page load
document.addEventListener("DOMContentLoaded", displayTable);

// Example function to open the modal with current data
function openModal(tspData) {
  // Populate form fields with current data
  document.getElementById('tspName').value = tspData.name;  // Assuming tspData contains a 'name' field
  document.getElementById('tspEmail').value = tspData.email;  // Assuming tspData contains an 'email' field
  
  // Show the modal
  document.getElementById('updateTspModal').style.display = 'flex';
}

// Example: Table row click event to open the modal with current data
document.querySelectorAll("#userTableBody tr").forEach(row => {
  row.addEventListener("click", () => {
    // Assuming each row contains the TSP data as a data attribute or directly in the row
    const tspData = {
      name: row.cells[0].textContent,  // Example: First column as name
      email: row.cells[1].textContent  // Example: Second column as email
    };
    openModal(tspData);
  });
});

// Close Modal function
function closeModal() {
  document.getElementById('updateTspModal').style.display = 'none';
  document.getElementById('updateTspForm').reset();  // Reset the form on close
}

// Form Submission handler
document.getElementById('updateTspForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const formData = new FormData(this);

  // Example of sending form data to the backend via AJAX (using fetch)
  fetch('your-backend-endpoint', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    alert('TSP Updated Successfully');
    closeModal();
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Failed to update TSP');
  });
});
