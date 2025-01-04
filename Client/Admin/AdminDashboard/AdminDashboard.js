const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");

menuBtn.addEventListener('click', ()=>{
  sideMenu.style.display = 'block';
})

closeBtn.addEventListener('click', ()=>{
  sideMenu.style.display = 'none';
})


// // Function to extract query parameter by name
// function getQueryParam(param) {
//   const urlParams = new URLSearchParams(window.location.search);
//   return urlParams.get(param);
// }

// // Fetch the admin ID from the URL
// const adminId = getQueryParam('adminid');

// if (adminId) {
//   // Fetch Admin details using the ID
//   fetch(`../api/getAdminDetails.php?adminid=${adminId}`)
//       .then(response => response.json())
//       .then(data => {
//           if (data.success) {
//               // Populate the profile page with admin details
//               document.getElementById('adminName').textContent = `${data.data.first_name} ${data.data.last_name}`;
//               document.getElementById('adminRole').textContent = data.data.role || 'Admin';
//               document.getElementById('adminStatus').textContent = data.data.active_status;
//               document.getElementById('adminEmail').textContent = `Email: ${data.data.email}`;
//               document.getElementById('adminPhone').textContent = `Phone: ${data.data.contact_number}`;
//               document.getElementById('adminRoleDetail').textContent = `Role: ${data.data.role}`;
//               document.getElementById('adminUsername').textContent = `Username: ${data.data.username}`;

//               // Update status button
//               const statusButton = document.getElementById('confirmDeactivateBtn');
//               if (data.data.active_status.toLowerCase() === 'active') {
//                   statusButton.textContent = 'Deactivate';
//               } else {
//                   statusButton.textContent = 'Activate';
//               }

//               // Add event listener to toggle status
//               statusButton.addEventListener('click', function () {
//                   const newStatus = (data.data.active_status.toLowerCase() === 'active') ? 'inactive' : 'active';
//                   updateAdminStatus(adminId, newStatus);
//               });
//           } else {
//               console.error('Admin not found:', data.message);
//           }
//       })
//       .catch(error => console.error('Error fetching admin details:', error));
// } else {
//   console.error('No Admin ID provided in the URL');
// }

// // Function to update Admin status
// function updateAdminStatus(adminId, newStatus) {
//   fetch(`../api/updateAdminStatus.php`, {
//       method: 'POST',
//       headers: {
//           'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ adminid: adminId, status: newStatus }),
//   })
//       .then(response => response.json())
//       .then(data => {
//           if (data.success) {
//               alert(`Status updated to ${newStatus}`);
//               // Refresh the page or update the status dynamically
//               document.getElementById('adminStatus').textContent = newStatus;
//           } else {
//               console.error('Error updating status:', data.message);
//           }
//       })
//       .catch(error => console.error('Error updating status:', error));
// }


// // Function to extract query parameter by name
// function getQueryParam(param) {
//   const urlParams = new URLSearchParams(window.location.search);
//   return urlParams.get(param);
// }

// // Fetch the admin ID from the URL
// const adminId = getQueryParam('adminid');

// if (adminId) {
//   // Fetch Admin details using the ID
//   fetch(`../../../Server/api/getAdminDetails.php?adminid=${adminId}`)
//       .then(response => response.json())
//       .then(data => {
//           if (data.success) {
//               // Populate the profile page with admin details
//               document.getElementById('adminName').textContent = `${data.data.first_name} ${data.data.last_name}`;
//               document.getElementById('adminRole').textContent = data.data.role || 'Admin';
//               document.getElementById('adminEmail').textContent = `Email: ${data.data.email}`;
//               document.getElementById('adminPhone').textContent = `Phone: ${data.data.contact_number}`;
//               document.getElementById('adminRoleDetail').textContent = `Role: ${data.data.role}`;
//               document.getElementById('adminUsername').textContent = `Username: ${data.data.username}`;
//               // You can set profile picture dynamically if needed
//               // document.getElementById('adminPicture').src = data.data.profile_picture || '../../assets/img/AvatarMaker.png';
//           } else {
//               console.error('Admin not found:', data.message);
//           }
//       })
//       .catch(error => {
//           console.error('Error fetching admin details:', error);
//       });
// } else {
//   console.error('No Admin ID provided in the URL');
// }
