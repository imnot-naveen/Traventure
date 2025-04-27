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
            // Get current status and update modal text
            const currentStatus = document.getElementById('tspStatus').textContent.trim().toLowerCase();
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
            const currentStatus = document.getElementById('tspStatus').textContent.trim().toLowerCase();
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
console.log("TSP ID:", tspId); // Debug log

if (tspId) {
    // Add cache-busting parameter to prevent caching
    fetch(`http://localhost/Traventure/Server/api/getTspDetails.php?tspid=${tspId}&_=${new Date().getTime()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("TSP data received:", data); // Debug log
            if (data.success) {
                const tspData = data.data;
  
                // Populate the profile details
                document.getElementById('tspName').textContent = `${tspData.first_name} ${tspData.last_name}`;
                document.getElementById('tspEmail').textContent = tspData.email;
                document.getElementById('tspContact').textContent = tspData.contact_number;
                document.getElementById('tspid').textContent = tspData.tspid;
                
                // Handle status display
                const tspStatus = document.getElementById('tspStatus');
                tspStatus.textContent = tspData.Active_status;
                
                // Standardize status case and update class
                if (tspData.Active_status.toLowerCase() === 'active') {
                    tspStatus.className = 'status active';
                } else {
                    tspStatus.className = 'status inactive';
                }
  
                // Set initial button text based on current status
                const deactivateBtn = document.getElementById('deactivateBtn');
                const confirmDeactivateBtn = document.getElementById('confirmDeactivateBtn');
                
                if (deactivateBtn && confirmDeactivateBtn) {
                    if (tspData.Active_status.toLowerCase() === 'active') {
                        deactivateBtn.textContent = 'Deactivate';
                         if (confirmDeactivateBtn) confirmDeactivateBtn.textContent = 'Yes, Deactivate';
                    } else {
                        deactivateBtn.textContent = 'Activate';
                        if (confirmDeactivateBtn) confirmDeactivateBtn.textContent = 'Yes, Activate';
                    }
                }
            } else {
                console.error('TSP not found:', data.message);
                alert('TSP not found. Please check the ID and try again.');
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert('Failed to load TSP details. Please try again later.');
        });
}
  
// Function to update TSP status (active/inactive)
function updateTspStatus(tspId, newStatus) {
    console.log("Updating status for TSP ID:", tspId, "to:", newStatus); // Debug log
    
    // Changed from POST to PUT to match your API expectations
    fetch('../../../../Server/api/adminTsp_Deactivate.php', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tspid: tspId,
            status: newStatus,
        }),
    })
    .then(async (response) => {
        const data = await response.json(); // Always parse first
        if (!response.ok) {
            throw new Error(data.message || 'Failed to update status');
        }
        return data;
    })
    .then(data => {
        console.log("Status update response:", data);
    
        if (data.success) {
            // SUCCESS handling (already correct in your code)
            const statusElement = document.getElementById('tspStatus');
            if (statusElement) {
                statusElement.textContent = newStatus;
                statusElement.className = `status ${newStatus.toLowerCase()}`;
            }
    
            const deactivateBtn = document.getElementById('deactivateBtn');
            const confirmDeactivateBtn = document.getElementById('confirmDeactivateBtn');
    
            if (newStatus.toLowerCase() === 'active') {
                if (deactivateBtn) deactivateBtn.textContent = 'Deactivate';
                if (confirmDeactivateBtn) confirmDeactivateBtn.textContent = 'Yes, Deactivate';
            } else {
                if (deactivateBtn) deactivateBtn.textContent = 'Activate';
                if (confirmDeactivateBtn) confirmDeactivateBtn.textContent = 'Yes, Activate';
            }
    
            alert(`TSP status has been updated to ${newStatus}`);
            closeDeactivateModal();
        } else {
            throw new Error(data.message || 'Unknown error occurred');
        }
    })
    .catch(error => {
        console.error('Error updating TSP status:', error);
        alert(`Failed to update status: ${error.message}`);
    });    
}