// Fetch and display user data
fetch('../../../Server/api/getAllUsers.php')
    .then(response => response.json())
    .then(data => {
        if (data.success && Array.isArray(data.data)) {
            const tableBody = document.getElementById('userTableBody'); 
            tableBody.innerHTML = ""; 

            data.data.forEach(person => {
                const row = tableBody.insertRow();
                row.insertCell(0).textContent = person.username || "N/A";
                row.insertCell(1).textContent = person.first_name || "N/A";
                row.insertCell(2).textContent = person.last_name || "N/A";
                row.insertCell(3).textContent = person.email || "N/A";
                row.insertCell(4).textContent = person.contact_number || "N/A";

                // Add a class for styling
                row.classList.add("clickable-row");
                row.addEventListener("click", () => {
                    const userId = person.userid; 
                    console.log("Navigating to User Profile:", userId);
                    window.location.href = `AdminUserProfile/AdminUserProfile.php?userid=${userId}`;
                });
            });

            // Reinitialize pagination after rows are added
            displayTable();
        } else {
            console.error('Error: Unexpected response format or no success flag');
            document.getElementById('userTableBody').innerHTML = "<tr><td colspan='5'>No data available</td></tr>";
        }
    })
    .catch(error => console.error('Error fetching user data:', error));

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

// Fetch total user count from API
fetch('http://localhost/Traventure/Server/api/getUserCount.php')  
  .then(response => response.json())
  .then(data => {
    if (data.count) {
      document.querySelector('.left h1').textContent = data.count.toLocaleString();
    } else {
      console.error('Failed to fetch user count');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });

  fetch('http://localhost/Traventure/Server/api/getUsersByMonth.php')
  .then(response => response.json())
  .then(data => {
    if (data && data.success && data.data !== undefined) {
      document.querySelector('#userCountMonth').textContent = data.data.toLocaleString();
    } else {
      console.error('Failed to fetch user count');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });