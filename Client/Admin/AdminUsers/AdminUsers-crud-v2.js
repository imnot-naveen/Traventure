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
            });
        } else {
            console.error('Error: Unexpected response format or no success flag');
        }
    })
    .catch(error => console.error('Error fetching data:', error));
