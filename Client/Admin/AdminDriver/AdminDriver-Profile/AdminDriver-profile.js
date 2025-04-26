const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");

menuBtn.addEventListener('click', ()=>{
  sideMenu.style.display = 'block';
})

closeBtn.addEventListener('click', ()=>{
  sideMenu.style.display = 'none';
})

//Table row href
// document.addEventListener("DOMContentLoaded", function() {
//   const tableRows = document.querySelectorAll("#driverTable tbody tr");

//   tableRows.forEach(row => {
//       // Add click event to each row
//       row.addEventListener("click", function() {
//           const driverId = this.cells[0].textContent; 
//           window.location.href = `../AdmindriverProfile/AdmindriverProfile.html`; 
//       });
//   });
// });


function filterdrivers() {
  const searchValue = document.getElementById("searchBar").value.toLowerCase();
  const rows = document.querySelectorAll("#driverTable tbody tr");

  rows.forEach((row) => {
    const name = row.querySelector("td:nth-child(2)").innerText.toLowerCase();
    if (name.includes(searchValue)) {
      row.style.display = ""; // Show row
    } else {
      row.style.display = "none"; // Hide row
    }
  });
}

let currentPage = 1;
const rowsPerPage = 6;

function displayTable() {
    const tableBody = document.getElementById("driverTableBody");
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

// Initialize the table display
document.addEventListener("DOMContentLoaded", displayTable);
