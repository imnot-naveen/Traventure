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
  
  // Fetch Service Packages
  fetchServicePackages();
  
  // Fetch System Settings
  fetchSystemSettings();
  
  // Event Listeners for Forms
  document.getElementById('fareRatesForm').addEventListener('submit', updateFareRate);
  document.getElementById('destinationTypesForm').addEventListener('submit', addDestinationType);
  document.getElementById('servicePackagesForm').addEventListener('submit', addServicePackage);
  document.getElementById('systemSettingsForm').addEventListener('submit', updateSystemSetting);
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

function fetchDestinationTypes() {
}

function fetchServicePackages() {

}

function fetchSystemSettings() {

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

function addDestinationType(e) {
  e.preventDefault();
  const destType = document.getElementById('destType').value;
  const destDescription = document.getElementById('destDescription').value;
  
  // Here you would typically send this data to the server
  console.log(`Adding destination type: ${destType} with description: ${destDescription}`);
  
  // For demonstration, show a success message and refresh the list
  alert(`Destination type ${destType} added successfully!`);
  fetchDestinationTypes();
  
  // Reset form
  document.getElementById('destinationTypesForm').reset();
}

function addServicePackage(e) {
  e.preventDefault();
  const packageName = document.getElementById('packageName').value;
  const packagePrice = document.getElementById('packagePrice').value;
  
  // Here you would typically send this data to the server
  console.log(`Adding service package: ${packageName} with price: LKR ${packagePrice}`);
  
  // For demonstration, show a success message and refresh the list
  alert(`Service package ${packageName} added successfully!`);
  fetchServicePackages();
  
  // Reset form
  document.getElementById('servicePackagesForm').reset();
}

function updateSystemSetting(e) {
  e.preventDefault();
  const settingName = document.getElementById('settingName').value;
  const settingValue = document.getElementById('settingValue').value;
  
  // Here you would typically send this data to the server
  console.log(`Updating system setting: ${settingName} to value: ${settingValue}`);
  
  // For demonstration, show a success message and refresh the list
  alert(`System setting ${settingName} updated successfully!`);
  fetchSystemSettings();
  
  // Reset form
  document.getElementById('systemSettingsForm').reset();
}