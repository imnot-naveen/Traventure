// Function to extract query parameter by name
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Fetch the CW ID from the URL
const cwId = getQueryParam('cwid');

if (cwId) {
  // Fetch cw details using the ID
  fetch(`../../../../Server/api/getCWbyId.php?cwid=${cwId}`)
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              // Populate the profile page with cw details
              document.getElementById('cwName').textContent = `${data.data.first_name} ${data.data.last_name}`;
              document.getElementById('cwEmail').textContent = data.data.email;
              document.getElementById('cwContact').textContent = data.data.contact_number;
              document.getElementById('cwid').textContent = data.data.cwid;
              document.getElementById('cwStatus').textContent = data.data.Active_status;
              
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
                      updatecwStatus(cwId, newStatus);
                  });
              }
          } else {
              console.error('cw not found:', data.message);
          }
      })
      .catch(error => console.error('Error fetching cw details:', error));
} else {
  console.error('No cw ID provided in the URL');
}

// Function to update cw status
function updatecwStatus(cwId, newStatus) {
  fetch('../../../../Server/api/admincw_Deactivate.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          cwid: cwId,
          status: newStatus
      })
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          alert(`cw status has been updated to ${newStatus}`);
          document.getElementById('cwStatus').textContent = newStatus; // Update the status on the page
          document.getElementById('updateStatusButton').textContent = (newStatus === 'active') ? 'Deactivate' : 'Activate'; // Update the button text
      } else {
          console.error('Failed to update cw status:', data.message);
      }
  })
  .catch(error => console.error('Error updating cw status:', error));
}
