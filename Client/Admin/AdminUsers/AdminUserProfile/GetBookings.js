const urlParam = new URLSearchParams(window.location.search);
const userID = urlParam.get('userid')

fetch(`http://localhost/Traventure/Server/api/getBookingbyUser.php?userID=${userID}`).then(response => response.json()).then(data=>{
  if(data.success && Array.isArray(data.data)){
    const tableBody = document.getElementById('BookingTableBody');
    tableBody.innerHTML = "";
    data.data.forEach(booking => {
      const row = tableBody.insertRow();
      row.insertCell(0).textContent = booking.bookingID  || "N/A";
      row.insertCell(1).textContent = booking.start_station_name || "N/A";
      row.insertCell(2).textContent = booking.destination_station_name|| "N/A";
      row.insertCell(3).textContent = booking.class|| "N/A";
      row.insertCell(4).textContent = booking.no_of_passengers|| "N/A";
      row.insertCell(5).textContent = booking.kidsCount|| "N/A";
      row.insertCell(6).textContent = booking.total_fare|| "N/A";
      row.insertCell(7).textContent = booking.paymentMethod || "N/A";
      row.insertCell(8).textContent = booking.bookingDate || "N/A";
      row.insertCell(9).textContent = booking.name || "N/A";
      
    });
    // Reinitialize pagination after rows are added
    displayTable();
  }else {
    console.error('Error: Unexpected response format or no success flag');
    document.getElementById('BookingTableBody').innerHTML = "<tr><td colspan='6'>No data available</td></tr>";
  }
}).catch(error => console.error('Error fetching Booking data:', error));


// Pagination logic
let currentPage = 1;
const rowsPerPage = 3;

function displayTable() {
    const tableBody = document.getElementById("BookingTableBody");
    const rows = Array.from(tableBody.getElementsByTagName("tr"));
    const totalRows = rows.length;

    // Calculate start and end indices
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    rows.forEach((row, index) => {
        row.style.display = index >= start && index < end ? "" : "none";
    });

    // Update pagination info
    document.getElementById("pageInfo").innerText = `Page ${currentPage} of ${Math.ceil(totalRows / rowsPerPage)}`;
    document.getElementById("prevBtn").disabled = currentPage === 1;
    document.getElementById("nextBtn").disabled = currentPage === Math.ceil(totalRows / rowsPerPage);
}

function nextPage() {
    currentPage++;
    displayTable();
}

function prevPage() {
    currentPage--;
    displayTable();
}

// Initialize pagination on page load
document.addEventListener("DOMContentLoaded", () => {
    currentPage = 1;
    displayTable();
});
