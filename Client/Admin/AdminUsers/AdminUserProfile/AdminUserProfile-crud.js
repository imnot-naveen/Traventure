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

  if (deactivateBtn && deactivateModal) {
    deactivateBtn.addEventListener('click', function () {
      // Update modal button text based on current status
      const currentStatus = document.getElementById('userStatus').textContent.trim();
      if (confirmDeactivateBtn) {
        confirmDeactivateBtn.textContent = currentStatus === 'active' ? 'Deactivate' : 'Activate';
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
      const userId = document.getElementById('userid').textContent.trim();
      const currentStatus = document.getElementById('userStatus').textContent.trim();
      // Toggle to the opposite status
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      updateUserStatus(userId, newStatus);
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

// Fetch User Data based on Query Parameter (userid)
const userId = getQueryParam('userid');
if (userId) {
  fetch(`http://localhost/Traventure/Server/api/getUserById.php?userid=${userId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        const userData = data.data;

        // Populate the profile details
        document.getElementById('userName').textContent = `${userData.first_name} ${userData.last_name}`;
        document.getElementById('userEmail').textContent = userData.email;
        document.getElementById('userContact').textContent = userData.contact_number;
        document.getElementById('userid').textContent = userData.userid;
        document.getElementById('userStatus').textContent = userData.status;

        const deactivateBtn = document.getElementById('deactivateBtn');
        
        if (deactivateBtn) {
          // Set initial button text based on current status
          updateButtonLabels(userData.status);
        }
      } else {
        console.error('User not found:', data.message);
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
    deactivateBtn.textContent = status === 'Active' ? 'Deactivate' : 'Activate';
  }
}

// Function to update user status (active/inactive)
function updateUserStatus(userId, newStatus) {
  fetch('../../../../Server/api/deactivateUser.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userid: userId,
      status: newStatus,
    }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Update the displayed status
        document.getElementById('userStatus').textContent = newStatus;
        
        // Update button labels
        updateButtonLabels(newStatus);
        
        // Show success message
        alert(`User status has been updated to ${newStatus}`);
        
        // Close the modal
        closeDeactivateModal();
      } else {
        console.error('Failed to update user status:', data.message);
      }
    })
    .catch(error => console.error('Error updating user status:', error));
}