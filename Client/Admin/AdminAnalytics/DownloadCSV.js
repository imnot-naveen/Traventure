// Helper: Convert JSON array to CSV
function convertToCSV(data) {
  const array = [Object.keys(data[0])].concat(data.map(item => Object.values(item)));
  return array.map(row => row.join(',')).join('\n');
}

// Helper: Trigger CSV download
function downloadCSV(csvData, filename) {
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

// Common download function
function fetchDataAndDownload(apiUrl, filename) {
  const monthInput = document.getElementById('monthSelect').value;
  if (!monthInput) {
      alert('Please select a month.');
      return;
  }

  const [year, month] = monthInput.split('-');

  fetch(`${apiUrl}?year=${year}&month=${month}`)
      .then(res => res.json())
      .then(data => {
          if (data.success && data.data.length > 0) {
              const csv = convertToCSV(data.data);
              downloadCSV(csv, filename);
          } else {
              alert('No data available for selected month.');
          }
      })
      .catch(err => {
          console.error(err);
          alert('Failed to fetch data.');
      });
}

// Event listeners
document.getElementById('Booking').addEventListener('click', () => {
  fetchDataAndDownload('http://localhost/Traventure/Server/api/getBookingByMonth.php', 'Bookings.csv');
});

document.getElementById('Users').addEventListener('click', () => {
  fetchDataAndDownload('http://localhost/api/users_by_month.php', 'UserGrowth.csv');
});
