fetch('http://localhost/Traventure/Server/api/getRequestByDriver.php', {
  method: 'GET',
  credentials: 'include'
})
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('requests-container');
    
    if (data.success) {
      const requests = data.data;

      if (requests.length === 0) {
        container.innerHTML = '<p>No upcoming ride requests found.</p>';
        return;
      }

      requests.forEach(req => {
        const div = document.createElement('div');
        div.classList.add('request-card');
        div.innerHTML = `
          <h3>Request ID: ${req.id}</h3>
          <p><strong>Passenger:</strong> ${req.passengerName || 'N/A'}</p>
          <p><strong>Date:</strong> ${req.rideDate}</p>
          <p><strong>Time:</strong> ${req.rideTime}</p>
          <p><strong>Pickup:</strong> ${req.pickupLocation}</p>
          <p><strong>Dropoff:</strong> ${req.dropoffLocation}</p>
        `;
        container.appendChild(div);
      });
    } else {
      container.innerHTML = `<p class="error">${data.message}</p>`;
    }
  })
  .catch(err => {
    document.getElementById('requests-container').innerHTML = `<p class="error">Fetch error: ${err}</p>`;
  });
