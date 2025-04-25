// Function to extract query parameter by name
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Fetch the Driver ID from the URL
const driverId = getQueryParam('driver');

if (driverId) {
    // Fetch Driver details using the ID
    fetch(`../../../../Server/api/getDriverbyID.php?driverID=${driverId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const driver = data.data.data;

                // Update driver details on the page
                document.getElementById('driverName').textContent = `${driver.firstName} ${driver.lastName}`;
                document.getElementById('driverEmail').textContent = driver.email;
                document.getElementById('driverContact').textContent = driver.contactNo;
                document.getElementById('driverid').textContent = driver.id;
                document.getElementById('driverStatus').textContent = driver.status;

                const statusButton = document.getElementById('confirmDeactivateBtn');
                const activeBtn = document.getElementById('deactivateBtn');
                const deactivateModal = document.getElementById('deactivateModal');
                const closeModalButton = document.getElementById('closeModal-d');
                const cancelDeactivateButton = document.getElementById('cancelDeactivateBtn');

                if (statusButton) {
                    // Set button text based on current status
                    if (driver.status === 'active') {
                        statusButton.textContent = 'Deactivate';
                        activeBtn.textContent = 'Deactivate';
                    } else {
                        statusButton.textContent = 'Activate';
                        activeBtn.textContent = 'Activate';
                    }

                    // Show modal on Deactivate button click
                    activeBtn.addEventListener('click', () => {
                        deactivateModal.style.display = 'block';
                    });

                    // Close the modal when cancel or close button is clicked
                    closeModalButton.addEventListener('click', () => {
                        deactivateModal.style.display = 'none';
                    });

                    cancelDeactivateButton.addEventListener('click', () => {
                        deactivateModal.style.display = 'none';
                    });

                    // Change the driver status when confirmed
                    statusButton.addEventListener('click', function () {
                        const newStatus = (driver.status === 'active') ? 'inactive' : 'active';
                        console.log('New Status:', newStatus); // Log the status for debugging
                        updatedriverStatus(driver.id, newStatus);
                        deactivateModal.style.display = 'none';
                    });
                }
            }
        })
        .catch(error => console.error('Error fetching driver details:', error));
} else {
    console.error('No driver ID provided in the URL');
}

// Function to update driver status
function updatedriverStatus(driverId, newStatus) {
    console.log('Sending request with data:', {
        id: driverId,
        status: newStatus
    });

    fetch('http://localhost/Traventure/Server/api/deactivateDriver.php', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: driverId,
            status: newStatus
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`Driver status has been updated to ${newStatus}`);
            // Update status on the page
            document.getElementById('driverStatus').textContent = newStatus;
            document.getElementById('confirmDeactivateBtn').textContent = (newStatus === 'active') ? 'Deactivate' : 'Activate';
        } else {
            console.error('Failed to update driver status:', data.message);
        }
    })
    .catch(error => console.error('Error updating driver status:', error));
}
