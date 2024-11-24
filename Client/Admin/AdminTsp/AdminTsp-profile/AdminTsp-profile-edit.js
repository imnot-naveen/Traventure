const tspProfileUrl = '../../../../Server/api/adminTspUpdate.php'; 

// Open Modal with fetched data
function openModal(tspid) {
  fetchTspProfile(tspid);  // Fetch TSP profile data based on the TSP ID
  document.getElementById('updateTspModal').style.display = 'block'; // Show the modal
}

// Close Modal
function closeModal() {
  document.getElementById('updateTspModal').style.display = 'none';
  document.getElementById('updateTspForm').reset();  // Reset form fields when modal is closed
}

// Fetch TSP Profile Data from server
function fetchTspProfile(tspid) {
  fetch(`${tspProfileUrl}?tspid=${tspid}`)  // Pass TSP ID as a query parameter
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch TSP profile');
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        // Populate form fields with the fetched TSP data
        document.getElementById('tspFirstName').value = data.tsp.first_name || '';
        document.getElementById('tspLastName').value = data.tsp.last_name || '';
        document.getElementById('tspPhone').value = data.tsp.contact_number || '';
      } else {
        console.error('Failed to load TSP profile:', data.message);
      }
    })
    .catch(error => {
      console.error('Error fetching TSP profile:', error);
    });
}

// Form Submission Handler
document.getElementById('updateTspForm').addEventListener('submit', function (event) {
  event.preventDefault();  // Prevent default form submission

  const formData = new FormData(this);

  // Prepare data for sending to server (only include updated fields)
  const updatedData = {};
  formData.forEach((value, key) => {
    if (value) {
      updatedData[key] = value; // Only include fields that are not empty
    }
  });

  // Send the updated data to the server
  fetch(tspProfileUrl, {
    method: 'POST',
    body: JSON.stringify(updatedData), // Send as JSON
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('TSP Updated Successfully');
      closeModal();  // Close modal after successful submission
    } else {
      alert('Failed to update TSP: ' + data.message);
    }
  })
  .catch(error => {
    console.error('Error updating TSP:', error);
    alert('Failed to update TSP');
  });
});

// Example event listener for dynamically triggering modal open
document.addEventListener('DOMContentLoaded', () => {
  const tableRows = document.querySelectorAll('.tsp-row'); // Example: rows with class 'tsp-row'
  tableRows.forEach(row => {
    row.addEventListener('click', () => {
      const tspid = row.getAttribute('data-tspid'); // Fetch TSP ID from a data attribute
      openModal(tspid);
    });
  });
});
