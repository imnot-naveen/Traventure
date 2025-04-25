// Function to get query parameter from URL
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
    const closeModalBtn = document.getElementById('closeModal-d');
  
    if (deactivateBtn && deactivateModal) {
        deactivateBtn.addEventListener('click', function () {
            // Update modal button text based on current status
            const currentStatus = document.getElementById('tspStatuss').textContent.trim();
            if (confirmDeactivateBtn) {
                confirmDeactivateBtn.textContent = currentStatus === 'active' ? 'Yes, Deactivate' : 'Yes, Activate';
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
  
    // Close modal with X button
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function () {
            closeDeactivateModal();
        });
    }
  
    // Handle 'Confirm' button click
    if (confirmDeactivateBtn) {
        confirmDeactivateBtn.addEventListener('click', function () {
            const tspId = document.getElementById('tspid').textContent.trim();
            const currentStatus = document.getElementById('tspStatuss').textContent.trim();
            // Toggle to the opposite status
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            updateTspStatus(tspId, newStatus);
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
  
// Fetch TSP Data based on Query Parameter (tspid)
const tspId = getQueryParam('tspid');
if (tspId) {
    fetch(`http://localhost/Traventure/Server/api/getTspDetails.php?tspid=${tspId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                const tspData = data.data;
  
                // Populate the profile details
                document.getElementById('tspName').textContent = `${tspData.first_name} ${tspData.last_name}`;
                document.getElementById('tspEmail').textContent = tspData.email;
                document.getElementById('tspContact').textContent = tspData.contact_number;
                document.getElementById('tspid').textContent = tspData.tspid;
                document.getElementById('tspStatuss').textContent = tspData.status;
  
                // Also update the status class for styling
                const statusElement = document.getElementById('tspStatuss');
                if (statusElement) {
                    statusElement.className = `status ${tspData.status === 'active' ? 'active' : 'inactive'}`;
                }
  
                const deactivateBtn = document.getElementById('deactivateBtn');
          
                if (deactivateBtn) {
                    // Set initial button text based on current status
                    updateButtonLabels(tspData.status);
                }
            } else {
                console.error('TSP not found:', data.message);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}
  
// Function to update button labels based on current status
function updateButtonLabels(status) {
    const deactivateBtn = document.getElementById('deactivateBtn');
    
    if (deactivateBtn) {
        deactivateBtn.textContent = status === 'active' ? 'Deactivate' : 'Activate';
    }
}
  
// Function to update TSP status (active/inactive)
function updateTspStatus(tspId, newStatus) {
    fetch('../../../../Server/api/adminTsp_Deactivate.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tspid: tspId,
            status: newStatus,
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update the displayed status text
                const statusElement = document.getElementById('tspStatuss');
                if (statusElement) {
                    statusElement.textContent = newStatus;
                    // Also update the CSS class for styling
                    statusElement.className = `status ${newStatus === 'active' ? 'active' : 'inactive'}`;
                }
          
                // Update button labels
                updateButtonLabels(newStatus);
          
                // Show success message
                alert(`TSP status has been updated to ${newStatus}`);
          
                // Close the modal
                closeDeactivateModal();
            } else {
                console.error('Failed to update TSP status:', data.message);
            }
        })
        .catch(error => console.error('Error updating TSP status:', error));
}