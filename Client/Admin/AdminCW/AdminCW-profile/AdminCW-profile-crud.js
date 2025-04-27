// Function to extract query parameter by name
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Modal and Button Element Setup
document.addEventListener('DOMContentLoaded', function () {
  const deactivateBtn = document.getElementById('deactivateBtn');
  const deactivateModal = document.getElementById('deactivateModal');
  const cancelDeactivateBtn = document.getElementById('cancelDeactivateBtn');
  const confirmDeactivateBtn = document.getElementById('confirmDeactivateBtn');

  if (deactivateBtn && deactivateModal) {
      deactivateBtn.addEventListener('click', function () {
          // Update modal button text based on current status
          const currentStatus = document.getElementById('cwStatus').textContent.trim();
          if (confirmDeactivateBtn) {
              confirmDeactivateBtn.textContent = currentStatus === 'Active' ? 'Yes, Deactivate' : 'Yes, Activate';
          }
          deactivateModal.style.display = 'block';
      });
  }

  // Close modal on 'Cancel' button
  if (cancelDeactivateBtn) {
      cancelDeactivateBtn.addEventListener('click', function () {
          closeDeactivateModal();
      });
  }

  // Handle 'Confirm' button click
  if (confirmDeactivateBtn) {
      confirmDeactivateBtn.addEventListener('click', function () {
          const cwId = document.getElementById('cwid').textContent.trim();
          const currentStatus = document.getElementById('cwStatus').textContent.trim();
          // Toggle to the opposite status
          const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
          updateCwStatus(cwId, newStatus);
      });
  }

  // Close modal if user clicks outside
  window.addEventListener('click', function (event) {
      if (event.target === deactivateModal) {
          closeDeactivateModal();
      }
  });
});

// Function to close the deactivate modal
function closeDeactivateModal() {
  const deactivateModal = document.getElementById('deactivateModal');
  if (deactivateModal) {
      deactivateModal.style.display = 'none';
  }
}

// Fetch the CW ID from the URL
const cwId = getQueryParam('cwid');

if (cwId) {
  // Fetch cw details using the ID
  fetch(`../../../../Server/api/getCWbyId.php?cwid=${cwId}`)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          if (data.success) {
              const cwData = data.data;
              
              // Populate the profile page with cw details
              document.getElementById('cwName').textContent = `${cwData.first_name} ${cwData.last_name}`;
              document.getElementById('cwEmail').textContent = cwData.email;
              document.getElementById('cwContact').textContent = cwData.contact_number;
              document.getElementById('cwid').textContent = cwData.cwid;
              document.getElementById('cwStatus').textContent = cwData.status;
              
              const deactivateBtn = document.getElementById('deactivateBtn');
              
              if (deactivateBtn) {
                  // Set initial button text based on current status
                  updateButtonLabels(cwData.status);
              }
          } else {
              console.error('Content writer not found:', data.message);
              alert('Content writer not found. Please check the ID and try again.');
          }
      })
      .catch(error => {
          console.error('Error fetching content writer details:', error);
          alert('Failed to load content writer details. Please try again later.');
      });
} else {
  console.error('No content writer ID provided in the URL');
  alert('No content writer ID found in the URL. Please navigate back and select a valid content writer.');
}

// Function to update button labels based on current status
function updateButtonLabels(status) {
  const deactivateBtn = document.getElementById('deactivateBtn');
  
  if (deactivateBtn) {
      deactivateBtn.textContent = status === 'Active' ? 'Deactivate' : 'Activate';
  }
}

// Function to update cw status
function updateCwStatus(cwId, newStatus) {
  fetch('../../../../Server/api/deactivateCw.php', {
      method: 'PUT',
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
          // Update the displayed status
          document.getElementById('cwStatus').textContent = newStatus;
          
          // Update button labels
          updateButtonLabels(newStatus);
          
          // Show success message
          alert(`Content writer status has been updated to ${newStatus}`);
          
          // Close the modal
          closeDeactivateModal();
      } else {
          console.error('Failed to update content writer status:', data.message);
          alert(`Failed to update status: ${data.message || 'Unknown error'}`);
      }
  })
  .catch(error => {
      console.error('Error updating content writer status:', error);
      alert('An error occurred while updating the status. Please try again.');
  });
}