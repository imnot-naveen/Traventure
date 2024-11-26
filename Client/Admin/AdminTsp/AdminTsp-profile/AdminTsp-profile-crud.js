// Function to extract query parameter by name
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Fetch the TSP ID from the URL
const tspId = getQueryParam('tspid');

if (tspId) {
  // Fetch TSP details using the ID
  fetch(`../../../../Server/api/getTspDetails.php?tspid=${tspId}`)
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              // Populate the profile page with TSP details
              document.getElementById('tspName').textContent = `${data.data.first_name} ${data.data.last_name}`;
              document.getElementById('tspEmail').textContent = data.data.email;
              document.getElementById('tspContact').textContent = data.data.contact_number;
              document.getElementById('tspid').textContent = data.data.tspid;
              document.getElementById('tspStatus').textContent = data.data.Active_status;
              
              // Add the update status button if needed
              const statusButton = document.getElementById('confirmDeactivateBtn');
              const activeBtn = document.getElementById('deactivateBtn')
              if (statusButton) {
                  // Check current status and update button text accordingly
                  if (data.data.Active_status === 'active') {
                      statusButton.textContent = 'Deactivate';
                      activeBtn.textContent = 'Deactivate';
                  } else {
                      statusButton.textContent = 'Activate';
                      activeBtn.textContent = 'Activate';
                  }

                  // Add event listener for updating status
                  statusButton.addEventListener('click', function() {
                      const newStatus = (data.data.Active_status === 'active') ? 'inactive' : 'active';
                      updateTspStatus(tspId, newStatus);
                  });
              }
          } else {
              console.error('TSP not found:', data.message);
          }
      })
      .catch(error => console.error('Error fetching TSP details:', error));
} else {
  console.error('No TSP ID provided in the URL');
}

// Function to update TSP status
function updateTspStatus(tspId, newStatus) {
  fetch('../../../../Server/api/adminTsp_Deactivate.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          tspid: tspId,
          status: newStatus
      })
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          alert(`TSP status has been updated to ${newStatus}`);
          document.getElementById('tspStatus').textContent = newStatus; // Update the status on the page
          document.getElementById('updateStatusButton').textContent = (newStatus === 'active') ? 'Deactivate' : 'Activate'; // Update the button text
      } else {
          console.error('Failed to update TSP status:', data.message);
      }
  })
  .catch(error => console.error('Error updating TSP status:', error));
}
