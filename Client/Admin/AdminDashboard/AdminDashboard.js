// Function to fetch the logged-in username
async function fetchLoggedInUsername() {
  try {
    const response = await fetch('http://localhost/Traventure/Server/api/getUsername.php');
    const data = await response.json();
    
    if (data.success) {
      return data.username; // Return the username
    } else {
      // If the user is not logged in, handle the case
      console.error('Error:', data.message);
      return null; // Return null if not logged in
    }
  } catch (error) {
    console.error('Error fetching logged-in user:', error);
    return null; // Return null if there was an error
  }
}

const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");

menuBtn.addEventListener('click', () => {
  sideMenu.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
  sideMenu.style.display = 'none';
});

// Main function to get admin details using the username
async function getAdminDetails() {
  const username = await fetchLoggedInUsername(); // Wait for the username

  if (username) {
    fetch(`http://localhost/Traventure/Server/api/getAdminDetails.php?username=${username}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const admin = data.data;

          document.getElementById('adminName').textContent = `${admin.first_name} ${admin.last_name}`;
          document.getElementById('adminEmail').textContent = `Email: ${admin.email}`;
          document.getElementById('adminPhone').textContent = `Phone: ${admin.contact_number}`;
          document.getElementById('adminUsername').textContent = `Username: ${admin.username}`;

          // Optional status field (only if returned by backend)
          if (admin.active_status) {
            document.getElementById('adminStatus').textContent = admin.active_status;

            const statusButton = document.getElementById('confirmDeactivateBtn');
            statusButton.textContent = (admin.active_status.toLowerCase() === 'active') ? 'Deactivate' : 'Activate';

            statusButton.addEventListener('click', function () {
              const newStatus = (admin.active_status.toLowerCase() === 'active') ? 'inactive' : 'active';
              updateAdminStatus(username, newStatus);
            });
          }
        } else {
          console.error('Admin not found:', data.message);
        }
      })
      .catch(error => console.error('Error fetching admin details:', error));
  } else {
    console.error('No username provided or user not logged in');
  }
}

// Call the getAdminDetails function to fetch and display admin data
getAdminDetails();
