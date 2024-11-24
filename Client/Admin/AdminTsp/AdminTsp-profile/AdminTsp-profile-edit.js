const tspProfileUrl = '../../../../Server/api/adminTspUpdate.php'; 

// Open Modal with fetched data
function openModal(tspId) {
  fetchTspProfile(tspId);  // Fetch TSP profile data based on the TSP ID
  document.getElementById('updateTspModal').style.display = 'block'; // Show the modal
}

// Close Modal
function closeModal() {
  document.getElementById('updateTspModal').style.display = 'none';
  document.getElementById('updateTspForm').reset();  // Reset form fields when modal is closed
}

// Fetch TSP Profile Data from server
function fetchTspProfile(tspId) {
  fetch(`${tspProfileUrl}?tspid=${tspId}`)  // Pass TSP ID as a query parameter
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch TSP profile');
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        // Populate form fields with the fetched TSP data
        document.getElementById('tspFirstName').value = data.tsp.first_name;
        document.getElementById('tspLastName').value = data.tsp.last_name;
        document.getElementById('tspPhone').value = data.tsp.contact_number;
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

  // Send the updated data to the server
  fetch(tspProfileUrl, {
    method: 'POST',
    body: formData,
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

// Call this function to open the modal with current data (on some event, e.g., button click)
document.addEventListener('DOMContentLoaded', () => {
  const tspId = 1; // Replace this with dynamic TSP ID (from session or URL parameter)
  openModal(tspId);
});
