fetch('../../../Server/api/adminUser.php')
    .then(response => response.json())
    .then(data => {
        if (data.success && Array.isArray(data.data)) {
            const tableBody = document.getElementById('userTable').getElementsByTagName('tbody')[0];
            data.data.forEach(person => {
                const row = tableBody.insertRow();
                row.insertCell(0).textContent = person.username;
                row.insertCell(1).textContent = person.first_name;
                row.insertCell(2).textContent = person.last_name;
                row.insertCell(3).textContent = person.email;
                row.insertCell(4).textContent = person.contact_number;

                // Make the row clickable
                row.style.cursor = "pointer";
                row.addEventListener("click", () => {
                    const userId = person.username; // Use a unique identifier like username
                    console.log("Navigating to User Profile:", userId);
                    window.location.href = `AdminTsp-profile/AdminTsp-profile.html?user=${userId}`;
                });
            });
        } else {
            console.error('Error: Unexpected response format or no success flag');
        }
    })
    .catch(error => console.error('Error fetching data:', error));
