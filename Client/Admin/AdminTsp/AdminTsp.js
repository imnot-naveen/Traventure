const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");

menuBtn.addEventListener('click', ()=>{
  sideMenu.style.display = 'block';
})

closeBtn.addEventListener('click', ()=>{
  sideMenu.style.display = 'none';
})

function filterUsers() {
  const searchValue = document.getElementById("searchBar").value.toLowerCase();
  const rows = document.querySelectorAll("#userTable tbody tr");

  rows.forEach((row) => {
    const name = row.querySelector("td:nth-child(3)").innerText.toLowerCase();
    if (name.includes(searchValue)) {
      row.style.display = ""; // Show row
    } else {
      row.style.display = "none"; // Hide row
    }
  });
}

//pagination
let currentPage = 1;
const rowsPerPage = 6;

function displayTable() {
    const tableBody = document.getElementById("userTableBody");
    const rows = Array.from(tableBody.getElementsByTagName("tr"));
    const totalRows = rows.length;

    // Calculate start and end indices for the current page
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    // Hide all rows initially and display only the rows for the current page
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

// Ensure only the first page rows are shown on page load
document.addEventListener("DOMContentLoaded", () => {
    currentPage = 1; // Reset to the first page on load
    displayTable();  // Call displayTable to initialize the view
});

