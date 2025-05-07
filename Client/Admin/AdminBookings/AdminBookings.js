const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");

menuBtn.addEventListener("click", () => {
  sideMenu.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  sideMenu.style.display = "none";
});

function toggleDropdown(id) {
  const dropdown = document.getElementById(id);
  dropdown.classList.toggle("active");
}

let currentPage = 1;
const rowsPerPage = 6;
let bookings = [];

// Fetch bookings from API
function fetchBookings() {
  const tbody = document.getElementById("BookingTableBody");
  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Loading...</td></tr>`;
  }

  fetch("http://localhost/Traventure/Server/api/getAllBookings.php")
    .then(res => res.json())
    .then(data => {
      console.log("Fetched data:", data);

      bookings = Array.isArray(data) ? data : data.data || [];

   
      const totalRevenue = bookings.reduce((sum, booking) => sum + parseFloat(booking.total_fare || 0), 0);
      const totalBookings = bookings.length;

  
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const startOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
      const endOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);

      const lastMonthRevenue = bookings.reduce((sum, booking) => {
        const date = new Date(booking.bookingDate);
        if (date >= startOfLastMonth && date <= endOfLastMonth) {
          return sum + parseFloat(booking.total_fare || 0);
        }
        return sum;
      }, 0);

   
      document.getElementById("totalRevenue").innerText = `Rs. ${totalRevenue.toFixed(2)}`;
      document.getElementById("totalBookings").innerText = `${totalBookings}`;
      document.getElementById("lastMonthRevenue").innerText = `Rs. ${lastMonthRevenue.toFixed(2)}`;

   
      displayBookings();
      updatePagination();
    })
    .catch(err => {
      console.error("Error fetching bookings:", err);
      document.getElementById("totalRevenue").innerText = "Error loading revenue.";
      document.getElementById("totalBookings").innerText = "Error loading bookings.";
      document.getElementById("lastMonthRevenue").innerText = "Error loading last month revenue.";
    });
}

// Display bookings based on current page
function displayBookings() {
  const tbody = document.getElementById("BookingTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageData = bookings.slice(start, end);

  pageData.forEach((booking) => {
    const row = document.createElement("tr");

    row.onclick = () => {
      window.location.href = `bookingDetails.php?id=${booking.bookingID}`;
    };

    row.style.cursor = 'pointer';

    row.innerHTML = `
      <td>${booking.bookingID}</td>
      <td>${booking.userID}</td>
      <td>${booking.trainID}</td>
      <td>${booking.no_of_passengers + (parseInt(booking.kidsCount) || 0)}</td>
      <td>${booking.paymentStatus}</td>
      <td>${booking.bookingDate}</td>
      <td>Rs. ${booking.total_fare}</td>
    `;
    tbody.appendChild(row);
  });
}

// Pagination control
function updatePagination() {
  const totalPages = Math.ceil(bookings.length / rowsPerPage);
  document.getElementById("pageInfo").innerText = `Page ${currentPage} of ${totalPages}`;
  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage === totalPages;
}

function nextPage() {
  if (currentPage < Math.ceil(bookings.length / rowsPerPage)) {
    currentPage++;
    displayBookings();
    updatePagination();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    displayBookings();
    updatePagination();
  }
}

// Search functionality
function filterUsers() {
  const searchValue = document.getElementById("searchBar").value.toLowerCase();
  const tbody = document.getElementById("BookingTableBody");
  const rows = tbody.querySelectorAll("tr");
  let anyVisible = false;

  rows.forEach((row) => {
    if (row.id === "noResultRow") return;

    const userId = row.querySelector("td:nth-child(2)").innerText.toLowerCase();
    const isVisible = userId.includes(searchValue);
    row.style.display = isVisible ? "" : "none";
    if (isVisible) anyVisible = true;
  });

  const noResultRow = document.getElementById("noResultRow");

  if (!anyVisible) {
    if (!noResultRow) {
      const row = document.createElement("tr");
      row.id = "noResultRow";
      row.innerHTML = `<td colspan="7" style="text-align:center;">No bookings found</td>`;
      tbody.appendChild(row);
    }
  } else if (noResultRow) {
    noResultRow.remove();
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", fetchBookings);
