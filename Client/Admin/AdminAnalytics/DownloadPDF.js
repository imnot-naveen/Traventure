document.addEventListener('DOMContentLoaded', function() {
  const downloadBtn = document.getElementById('downloadReport');
  
  // Create status and preview elements if they don't exist
  let statusDiv = document.getElementById('status');
  if (!statusDiv) {
    statusDiv = document.createElement('div');
    statusDiv.id = 'status';
    document.querySelector('.Downloads').appendChild(statusDiv);
  }
  
  let previewContainer = document.getElementById('previewContainer');
  if (!previewContainer) {
    previewContainer = document.createElement('div');
    previewContainer.id = 'previewContainer';
    document.querySelector('.Downloads').appendChild(previewContainer);
  }
  
  const apiUrl = 'http://localhost/Traventure/Server/api/lastmonthbookings.php';
  
  let bookingData = null;
  
  downloadBtn.addEventListener('click', function() {
      if (bookingData) {
          // If we already have the data, create and download the CSV
          downloadCSV(bookingData);
      } else {
          // Otherwise fetch the data first
          fetchBookingData();
      }
  });
  
  function fetchBookingData() {
    statusDiv.textContent = 'Fetching booking data...';
    statusDiv.className = '';
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(response => {
            console.log("API response:", response); // For debugging
            
            // Check if the response has the expected structure
            if (!response || !response.success || !response.data) {
                throw new Error('Invalid response format');
            }
            
            // Store the data array, not the whole response
            bookingData = response.data;
            
            if (!Array.isArray(bookingData) || bookingData.length === 0) {
                statusDiv.textContent = 'No booking data available.';
                statusDiv.className = 'warning';
                previewContainer.innerHTML = '<p>No data available for preview.</p>';
                return;
            }
            
            statusDiv.textContent = 'Data loaded successfully!';
            statusDiv.className = 'success';
            // Auto-download after fetching
            downloadCSV(bookingData);
        })
        .catch(error => {
            statusDiv.textContent = `Error fetching data: ${error.message}`;
            statusDiv.className = 'error';
            console.error('Error:', error);
        });
}
  
  function downloadCSV(data) {
      if (!data || data.length === 0) {
          statusDiv.textContent = 'No data available for download.';
          statusDiv.className = 'error';
          return;
      }
      
      // Get headers from the first object
      const headers = Object.keys(data[0]);
      
      // Create CSV content
      let csvContent = headers.join(',') + '\n';
      
      // Add data rows
      data.forEach(item => {
          const row = headers.map(header => {
              // Handle values that need quotes (commas, quotes, newlines)
              let value = item[header];
              if (value === null || value === undefined) {
                  value = '';
              } else {
                  value = String(value);
              }
              
              // Escape quotes by doubling them and wrap in quotes if needed
              if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                  value = '"' + value.replace(/"/g, '""') + '"';
              }
              return value;
          }).join(',');
          csvContent += row + '\n';
      });
      
      // Create a Blob with the CSV content
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Create download link
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'last_month_bookings.csv');
      link.style.visibility = 'hidden';
      
      // Append the link, trigger the download, and remove the link
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      statusDiv.textContent = 'CSV file downloaded successfully!';
      statusDiv.className = 'success';
  }
  
});