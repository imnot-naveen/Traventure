// Fetch and display driver data
fetch('../../../Server/api/getAllDrivers.php')
    .then(response => response.json())
    .then(data => {
        if (data.success && Array.isArray(data.data)) {
            const tableBody = document.getElementById('driverTableBody');  
            tableBody.innerHTML = ""; // Clear existing rows

            data.data.forEach(person => {
                const row = tableBody.insertRow();
                row.insertCell(0).textContent = person.driverID || "N/A";
                row.insertCell(1).textContent = person.firstName || "N/A";
                row.insertCell(2).textContent = person.lastName || "N/A";
                row.insertCell(3).textContent = person.email || "N/A";
                row.insertCell(4).textContent = person.contactNo || "N/A";
                row.insertCell(5).textContent = person.vehicleID || "N/A";
                row.insertCell(6).textContent = person.license || "N/A";

                // Row click redirection
                row.classList.add("clickable-row");
                row.addEventListener("click", () => {
                    const driverID = person.driverID;
                    window.location.href = `AdminDriver-Profile/AdminDriver-Profile.php?driver=${driverID}`;
                });
            });

            displayTable(); // reapply pagination
        } else {
            console.error('Error: Unexpected response format or no success flag');
            document.getElementById('driverTableBody').innerHTML = "<tr><td colspan='7'>No data available</td></tr>";
        }
    })
    .catch(error => console.error('Error fetching user data:', error));

// Pagination
let currentPage = 1;
const rowsPerPage = 6;

function displayTable() {
    const tableBody = document.getElementById("driverTableBody");
    const rows = Array.from(tableBody.getElementsByTagName("tr"));
    const totalRows = rows.length;

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    rows.forEach((row, index) => {
        row.style.display = index >= start && index < end ? "" : "none";
    });

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

document.addEventListener("DOMContentLoaded", () => {
    currentPage = 1;
    displayTable();
});
