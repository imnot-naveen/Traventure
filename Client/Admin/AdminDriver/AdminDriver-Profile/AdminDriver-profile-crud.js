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
            const driver = data.data.data; // <<< Fix here
    
            document.getElementById('driverName').textContent = `${driver.firstName} ${driver.lastName}`;
            document.getElementById('driverEmail').textContent = driver.email;
            document.getElementById('driverContact').textContent = driver.contactNo;
            document.getElementById('driverid').textContent = driver.id;
            document.getElementById('driverStatus').textContent = driver.status;
    
            const statusButton = document.getElementById('confirmDeactivateBtn');
            const activeBtn = document.getElementById('deactivateBtn');
    
            if (statusButton) {
                if (driver.status === 'Active') {
                    statusButton.textContent = 'Deactivate';
                    activeBtn.textContent = 'Deactivate';
                } else {
                    statusButton.textContent = 'Activate';
                    activeBtn.textContent = 'Activate';
                }
    
                statusButton.addEventListener('click', function () {
                    const newStatus = (driver.status === 'Active') ? 'Inactive' : 'Active';
                    updatedriverStatus(driver.id, newStatus);
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
  fetch('../../../../Server/api/deactivatedriver.php', {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          driverid: driverId,
          status: newStatus
      })
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          alert(`driver status has been updated to ${newStatus}`);
          document.getElementById('driverStatus').textContent = newStatus; 
          document.getElementById('updateStatusButton').textContent = (newStatus === 'active') ? 'Deactivate' : 'Activate'; // Update the button text
      } else {
          console.error('Failed to update driver status:', data.message);
      }
  })
  .catch(error => console.error('Error updating driver status:', error));
}
