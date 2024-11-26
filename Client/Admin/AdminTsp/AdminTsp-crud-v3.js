// Fetch and display TSP data
fetch('../../../Server/api/adminTsp.php')
    .then(response => response.json())
    .then(data => {
        if (data.success && Array.isArray(data.data)) {
            const tableBody = document.getElementById('userTableBody'); // Ensure correct ID
            tableBody.innerHTML = ""; // Clear any existing rows before appending new ones

            data.data.forEach(tsp => {
                const row = tableBody.insertRow();
                row.insertCell(0).textContent = tsp.username || "N/A";
                row.insertCell(1).textContent = tsp.tspid || "N/A";
                row.insertCell(2).textContent = tsp.first_name || "N/A";
                row.insertCell(3).textContent = tsp.last_name || "N/A";
                row.insertCell(4).textContent = tsp.email || "N/A";
                row.insertCell(5).textContent = tsp.contact_number || "N/A";

                // Add a class for styling
                row.classList.add("clickable-row");
                row.addEventListener("click", () => {
                    const tspId = tsp.tspid;
                    window.location.href = `AdminTsp-profile/AdminTsp-profile.html?tspid=${tspId}`;
                });
            });

            // Reinitialize pagination after rows are added
            displayTable();
        } else {
            console.error('Error: Unexpected response format or no success flag');
            document.getElementById('userTableBody').innerHTML = "<tr><td colspan='6'>No data available</td></tr>";
        }
    })
    .catch(error => console.error('Error fetching TSP data:', error));

// Pagination logic
let currentPage = 1;
const rowsPerPage = 6;

function displayTable() {
    const tableBody = document.getElementById("userTableBody");
    const rows = Array.from(tableBody.getElementsByTagName("tr"));
    const totalRows = rows.length;

    // Calculate start and end indices
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    rows.forEach((row, index) => {
        row.style.display = index >= start && index < end ? "" : "none";
    });

    // Update pagination info
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

// Initialize pagination on page load
document.addEventListener("DOMContentLoaded", () => {
    currentPage = 1;
    displayTable();
});

// Fetch and display TSP count
fetch('../../../Server/api/adminTspCount.php')
    .then(response => response.json())
    .then(data => {
        if (data.success && typeof data.count === 'number') {
            const countElement = document.getElementById('tspCount');
            countElement.textContent = `${data.count}`;
        } else {
            console.error('Error: Unexpected response format or no count field');
            document.getElementById('tspCount').textContent = "0";
        }
    })
    .catch(error => console.error('Error fetching TSP count:', error));
