const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");

menuBtn.addEventListener('click', ()=>{
  sideMenu.style.display = 'block';
})

closeBtn.addEventListener('click', ()=>{
  sideMenu.style.display = 'none';
})

document.addEventListener('DOMContentLoaded', function() {
  // Fetch Fare Rates
  fetchFareRates();
  
  // Fetch Destination Types
  fetchDestinationTypes();
  
  
  // Event Listeners for Forms
  document.getElementById('fareRatesForm').addEventListener('submit', updateFareRate);
  document.getElementById('destinationTypesForm').addEventListener('submit', addDestinationType);
});



// Fetch Functions
function fetchFareRates() {
  const fareRatesList = document.getElementById('fareRatesList');
  fareRatesList.innerHTML = '<p class="loading">Loading fare rates...</p>';
  
  fetch('http://localhost/Traventure/Server/api/getAllFare.php')
    .then(response => response.json())
    .then(data => {
      if (data.success && Array.isArray(data.data)) {
        let fareRatesHTML = '';
        
        data.data.forEach(fare => {
          fareRatesHTML += `
            <div class="rate-item">
              <span class="rate-type">${fare.class}</span>
              <span class="rate-value">Base: LKR ${parseFloat(fare.base_fare).toFixed(2)}</span>
              <span class="rate-value">Per km: LKR ${parseFloat(fare.per_km_rate).toFixed(2)}</span>
            </div>
          `;
        });
        
        fareRatesList.innerHTML = fareRatesHTML;
      } else {
        fareRatesList.innerHTML = '<p class="error">Failed to load fare rates.</p>';
      }
    })
    .catch(error => {
      console.error('Error fetching fare rates:', error);
      fareRatesList.innerHTML = '<p class="error">Error loading fare rates. Please try again later.</p>';
    });
}

// Form Submit Functions
function updateFareRate(e) {
  e.preventDefault();
  const fareClass = document.getElementById('rateType').value;
  const baseFare = document.getElementById('baseFare').value;
  const perKmRate = document.getElementById('perKmRate').value;
  
  // Create the request data
  const requestData = {
    class: fareClass,
    base_fare: baseFare,
    per_km_rate: perKmRate
  };
  
  // Send the update request to the server
  fetch('http://localhost/Traventure/Server/api/updateFare.php', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert(`Fare rate for ${fareClass} updated successfully!`);
      fetchFareRates(); // Refresh the fare rates list
    } else {
      alert(`Failed to update fare rate: ${data.message || 'Unknown error'}`);
    }
  })
  .catch(error => {
    console.error('Error updating fare rate:', error);
    alert('Error updating fare rate. Please try again later.');
  });
  
  // Reset form
  document.getElementById('fareRatesForm').reset();
}

function fetchDestinationTypes() {
  const destinationTypesList = document.getElementById('destinationTypesList');
  destinationTypesList.innerHTML = '<p class="loading">Loading destination types...</p>';
  
  fetch('http://localhost/Traventure/Server/api/getDestinationTypes.php')
    .then(response => response.json())
    .then(data => {
      if (data.success && Array.isArray(data.types)) {
        let destinationTypesHTML = '';
        
        data.types.forEach(destType => {
          destinationTypesHTML += `
            <div class="destination-item">
              <span class="destination-name">${destType.type}</span>
            </div>
          `;
        });
        
        destinationTypesList.innerHTML = destinationTypesHTML;
      } else {
        destinationTypesList.innerHTML = '<p class="error">Failed to load destination types.</p>';
      }
    })
    .catch(error => {
      console.error('Error fetching destination types:', error);
      destinationTypesList.innerHTML = '<p class="error">Error loading destination types. Please try again later.</p>';
    });
}

function addDestinationType(e) {
  e.preventDefault();
  
  const destType = document.getElementById('destType').value;
  const destPhoto = document.getElementById('destPhoto').files[0];
  
  if (!destType || !destPhoto) {
    alert('Please fill in all required fields');
    return;
  }
  
  // Create FormData object for file upload
  const formData = new FormData();
  formData.append('name', destType);
  formData.append('photo', destPhoto);
  
  // Show loading state
  const submitButton = e.target.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;
  submitButton.textContent = 'Adding...';
  submitButton.disabled = true;
  
  // Send the data to the server
  fetch('http://localhost/Traventure/Server/api/addDestinationTypes.php', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert(`Destination type "${destType}" added successfully!`);
      fetchDestinationTypes(); 
    } else {
      alert(`Failed to add destination type: ${data.message || 'Unknown error'}`);
    }
  })
  .catch(error => {
    console.error('Error adding destination type:', error);
    alert('Error adding destination type. Please try again later.');
  })
  .finally(() => {
    // Reset button state
    submitButton.textContent = originalButtonText;
    submitButton.disabled = false;
    
    // Reset form
    document.getElementById('destinationTypesForm').reset();
  });
}
