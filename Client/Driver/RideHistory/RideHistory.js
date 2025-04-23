document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost/Traventure/Server/api/getRideHistoryByDriver.php', {
    method: 'GET',
    credentials: 'include' // to send session cookies
  })
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('history-container');

      if (data.success) {
        if (data.data.length === 0) {
          container.innerHTML = '<p>No ride history found.</p>';
          return;
        }

        data.data.forEach(ride => {
          const rideDiv = document.createElement('div');
          rideDiv.classList.add('ride-entry');

          rideDiv.innerHTML = `
            <h3>Request ID: ${ride.id}</h3>
            <p><strong>Date:</strong> ${ride.rideDate}</p>
            <p><strong>Time:</strong> ${ride.rideTime}</p>
            <p><strong>Pickup:</strong> ${ride.pickupPoint}</p>
            <p><strong>Drop:</strong> ${ride.dropPoint}</p>
          `;

          container.appendChild(rideDiv);
        });
      } else {
        container.innerHTML = `<p class="error-msg">${data.message}</p>`;
      }
    })
    .catch(err => {
      console.error('Fetch error:', err);
      document.getElementById('history-container').innerHTML = '<p class="error-msg">Error loading ride history.</p>';
    });
});
