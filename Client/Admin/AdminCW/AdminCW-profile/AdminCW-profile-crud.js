// Function to extract query parameter by name
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  
  // Fetch the CW ID from the URL
  const cwId = getQueryParam('id');
  
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
          
          // Handle status display
          const cwStatus = document.getElementById('cwStatus');
          const activeStatus = data.data.Active_status;
          cwStatus.textContent = activeStatus;
          
          // Update status class based on active status
          // Check if the status contains 'active' regardless of case
          if (activeStatus.toLowerCase() === 'active') {
            cwStatus.className = 'status active';
          } else {
            cwStatus.className = 'status inactive';
          }
          
          // Update deactivate/activate buttons
          const deactivateBtn = document.getElementById('deactivateBtn');
          const confirmDeactivateBtn = document.getElementById('confirmDeactivateBtn');
          
          if (deactivateBtn && confirmDeactivateBtn) {
            // Store the current status in a data attribute for reference
            deactivateBtn.dataset.currentStatus = activeStatus.toLowerCase();
            
            // Check current status and update button text accordingly
            if (activeStatus.toLowerCase() === 'active') {
              deactivateBtn.textContent = 'Deactivate';
              confirmDeactivateBtn.textContent = 'Yes, Deactivate';
            } else {
              deactivateBtn.textContent = 'Activate';
              confirmDeactivateBtn.textContent = 'Yes, Activate';
            }
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
  
  // Add event listener for the deactivate/activate button
  document.getElementById('confirmDeactivateBtn')?.addEventListener('click', function() {
    const deactivateBtn = document.getElementById('deactivateBtn');
    const currentStatus = deactivateBtn.dataset.currentStatus || document.getElementById('cwStatus').textContent.toLowerCase();
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    updateCwStatus(cwId, newStatus);
  });
  
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
        alert(`Content writer status has been updated to ${newStatus}`);
        
        // Update the status display
        const cwStatus = document.getElementById('cwStatus');
        cwStatus.textContent = newStatus;
        cwStatus.className = `status ${newStatus.toLowerCase()}`;
        
        // Update button texts
        const deactivateBtn = document.getElementById('deactivateBtn');
        const confirmDeactivateBtn = document.getElementById('confirmDeactivateBtn');
        
        // Update the stored status
        if (deactivateBtn) {
          deactivateBtn.dataset.currentStatus = newStatus.toLowerCase();
        }
        
        if (newStatus.toLowerCase() === 'active') {
          deactivateBtn.textContent = 'Deactivate';
          confirmDeactivateBtn.textContent = 'Yes, Deactivate';
        } else {
          deactivateBtn.textContent = 'Activate';
          confirmDeactivateBtn.textContent = 'Yes, Activate';
        }
        
        // Close the modal after successful update
        const deactivateModal = document.getElementById('deactivateModal');
        if (deactivateModal) {
          deactivateModal.style.display = 'none';
        }
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