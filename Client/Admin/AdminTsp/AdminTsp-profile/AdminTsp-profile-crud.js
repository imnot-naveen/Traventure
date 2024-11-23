// Function to extract query parameter by name
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Fetch the TSP ID from the URL
const tspId = getQueryParam('tspid');

if (tspId) {
  // Fetch TSP details using the ID
  fetch(`../../../../Server/api/getTspDetails.php?tspid=${tspId}`)
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              // Populate the profile page with TSP details
              document.getElementById('tspName').textContent = `${data.data.first_name} ${data.data.last_name}`;
              document.getElementById('tspEmail').textContent = data.data.email;
              document.getElementById('tspContact').textContent = data.data.contact_number;
              document.getElementById('tspid').textContent = data.data.tspid;
              // Add more fields as needed
          } else {
              console.error('TSP not found:', data.message);
          }
      })
      .catch(error => console.error('Error fetching TSP details:', error));
} else {
  console.error('No TSP ID provided in the URL');
}
