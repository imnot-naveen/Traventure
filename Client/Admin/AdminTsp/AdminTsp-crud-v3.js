// Fetch and display TSP data
fetch('../../../Server/api/adminTsp.php')
    .then(response => response.json())
    .then(data => {
        if (data.success && Array.isArray(data.data)) {
            const tableBody = document.getElementById('userTable').getElementsByTagName('tbody')[0];
            data.data.forEach(tsp => {
                const row = tableBody.insertRow();
                row.insertCell(0).textContent = tsp.username;
                row.insertCell(1).textContent = tsp.tspid;
                row.insertCell(2).textContent = tsp.first_name;
                row.insertCell(3).textContent = tsp.last_name;
                row.insertCell(4).textContent = tsp.email;
                row.insertCell(5).textContent = tsp.contact_number;

                // Make the row clickable
                row.style.cursor = "pointer";
                row.addEventListener("click", () => {
                    const tspId = tsp.tspid; // Use a unique identifier like tspid
                    window.location.href = `AdminTsp-profile/AdminTsp-profile.html?tspid=${tspId}`;
                });
            });
        } else {
            console.error('Error: Unexpected response format or no success flag');
        }
    })
    .catch(error => console.error('Error fetching TSP data:', error));

// Fetch and display TSP count
fetch('../../../Server/api/adminTspCount.php')
    .then(response => response.json())
    .then(data => {
        if (data.success && typeof data.count === 'number') {
            const countElement = document.getElementById('tspCount');
            countElement.textContent = `${data.count}`;
        } else {
            console.error('Error: Unexpected response format or no count field');
        }
    })
    .catch(error => console.error('Error fetching TSP count:', error));
