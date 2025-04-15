function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

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

        document.getElementById('userName').textContent = `${userData.first_name} ${userData.last_name}`;
        document.getElementById('userEmail').textContent = userData.email;
        document.getElementById('userContact').textContent = userData.contact_number;
        document.getElementById('userid').textContent = userData.userid;
        document.getElementById('userStatus').textContent = userData.Active_status;

        // const statusButton = document.getElementById('confirmDeactivateBtn');
        // const activeBtn = document.getElementById('deactivateBtn');

        // if (statusButton && activeBtn) {
        //   // const isActive = userData.Active_status === 'active';

        //   // statusButton.textContent = isActive ? 'Deactivate' : 'Activate';
        //   // activeBtn.textContent = isActive ? 'Deactivate' : 'Activate';

        //   // statusButton.addEventListener('click', function () {
        //   //   const newStatus = isActive ? 'inactive' : 'active';
        //   //   updateUserStatus(userData.userid, newStatus); 
        //   // });
        // }
      } else {
        console.error('User not found:', data.message);
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}
