function showLoading() {
    document.getElementById("loading-spinner").classList.remove("hidden");
    document.getElementById("booking-list").classList.add("hidden");
    document.getElementById("error-message").classList.add("hidden");
    document.getElementById("no-results").classList.add("hidden");
}

function hideLoading() {
    document.getElementById("loading-spinner").classList.add("hidden");
}

function showError() {
    hideLoading();
    errorMessage.classList.remove('hidden');
    noResults.classList.add('hidden');
    bookingList.classList.add('hidden');
}

function showNoResults() {
    hideLoading();
    errorMessage.classList.add('hidden');
    noResults.classList.remove('hidden');
    bookingList.classList.add('hidden');
}

function showBookingList() {
    hideLoading();
    errorMessage.classList.add('hidden');
    noResults.classList.add('hidden');
    bookingList.classList.remove('hidden');
}

function formatDateForAPI(date) {
    return date.toISOString().split('T')[0];
}

function formatDateForDisplay(dateString) {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

async function getUserIDFromSession() {
    try {
        const response = await fetch('../../Server/api/getUserId.php', {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok && data.success) {
            return data.userID;
        } else {
            throw new Error(data.message || "Not logged in");
        }
    } catch (error) {
        console.error("Error fetching user ID:", error);
        return null;
    }
}

function displayBookingCards(bookingsToDisplay) {
    bookingList.innerHTML = "";
    const template = bookingTemplate;

    bookingsToDisplay.forEach(booking => {
        const clone = template.content.cloneNode(true);

        clone.querySelector(".booking-id-value").textContent = booking.bookingID ?? "N/A";
        clone.querySelector(".booking-status").textContent = booking.paymentStatus ?? "N/A";
        clone.querySelector(".train-name").textContent = booking.name ?? "Train Name";
        clone.querySelector(".train-number").textContent = `#${booking.trainID ?? "N/A"}`;
        clone.querySelector(".journey-date-value").textContent = new Date(booking.bookingDate).toLocaleDateString() ?? "N/A";
        clone.querySelector(".departure-time").textContent = "--:--";
        clone.querySelector(".arrival-time").textContent = "--:--";
        clone.querySelector(".from-station-name").textContent = booking.start_station_name ?? "N/A";
        clone.querySelector(".to-station-name").textContent = booking.destination_station_name ?? "N/A";
        clone.querySelector(".passenger-count-value").textContent = booking.no_of_passengers ?? "0";
        clone.querySelector(".class-value").textContent = booking.class ?? "N/A";
        clone.querySelector(".price-value").textContent = `Rs. ${booking.total_fare ?? "0.00"}`;

        // QR Code Button Trigger
        const qrBtn = clone.querySelector(".view-qr-btn");
        if (qrBtn) {
            qrBtn.addEventListener("click", () => {
                openBoardingQrModal(booking);
            });
        }

        bookingList.appendChild(clone);
    });
}

async function fetchBookingHistory() {
    showLoading();

    try {
        const userID = await getUserIDFromSession();
        if (!userID) throw new Error("User ID not available");

        const response = await fetch(`../../Server/api/getBookingbyUser.php?userID=${userID}`);
        const data = await response.json();

        hideLoading();

        if (data.success && Array.isArray(data.data)) {
            bookings = data.data;
            applyFilters();
        } else {
            showError();
        }
    } catch (error) {
        console.error("Error fetching booking history:", error);
        showError();
    }
}

function handleSearch() {
    currentFilters.search = searchInput.value.trim();
    applyFilters();
}

function applyFilters() {
    currentPage = 1;

    filteredBookings = bookings.filter(booking => {
        const searchMatch = currentFilters.search === '' ||
            (booking.name && booking.name.toLowerCase().includes(currentFilters.search.toLowerCase())) ||
            (booking.trainID && booking.trainID.toLowerCase().includes(currentFilters.search.toLowerCase())) ||
            (booking.start_station_name && booking.start_station_name.toLowerCase().includes(currentFilters.search.toLowerCase())) ||
            (booking.destination_station_name && booking.destination_station_name.toLowerCase().includes(currentFilters.search.toLowerCase())) ||
            (booking.bookingID && booking.bookingID.toLowerCase().includes(currentFilters.search.toLowerCase()));

        const statusMatch = currentFilters.status === 'all' || booking.paymentStatus === currentFilters.status;

        const bookingDate = new Date(booking.bookingDate);
        const fromDate = new Date(currentFilters.dateFrom);
        const toDate = new Date(currentFilters.dateTo);
        toDate.setDate(toDate.getDate() + 1);

        const dateMatch = bookingDate >= fromDate && bookingDate < toDate;

        return searchMatch && statusMatch && dateMatch;
    });

    renderBookings();
}

function renderBookings() {
    if (filteredBookings.length === 0) {
        showNoResults();
        updatePagination();
        return;
    }

    totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);

    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredBookings.length);
    const bookingsToDisplay = filteredBookings.slice(startIndex, endIndex);

    displayBookingCards(bookingsToDisplay);
    showBookingList();
    updatePagination();
}

function updatePagination() {
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
}

function setupEventListeners() {
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    filterStatus.addEventListener('change', () => {
        currentFilters.status = filterStatus.value;
        applyFilters();
    });



    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderBookings();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderBookings();
        }
    });

    retryBtn.addEventListener('click', fetchBookingHistory);
}

// Configuration & State
const ITEMS_PER_PAGE = 5;

const loadingSpinner = document.getElementById('loading-spinner');
const errorMessage = document.getElementById('error-message');
const noResults = document.getElementById('no-results');
const bookingList = document.getElementById('booking-list');
const bookingTemplate = document.getElementById('booking-template');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');
const retryBtn = document.getElementById('retry-btn');

// QR Modal DOM Elements
const qrModal = document.getElementById('qr-modal');
const closeQrModalBtn = document.getElementById('close-qr-modal-btn');
const qrModalBookingId = document.getElementById('qr-modal-booking-id');
const qrModalTrainInfo = document.getElementById('qr-modal-train-info');
const qrModalPassengerInfo = document.getElementById('qr-modal-passenger-info');
const qrModalImg = document.getElementById('qr-modal-img');

if (closeQrModalBtn) {
    closeQrModalBtn.addEventListener('click', () => {
        qrModal.classList.add('hidden');
    });
}
if (qrModal) {
    qrModal.addEventListener('click', (e) => {
        if (e.target === qrModal) {
            qrModal.classList.add('hidden');
        }
    });
}

/**
 * Populates and reveals the digital boarding pass verification QR modal.
 *
 * @param {Object} booking - The booking object { bookingID, trainID, name, bookingDate, paymentStatus, no_of_passengers }
 */
function openBoardingQrModal(booking) {
    qrModalBookingId.textContent = `Booking ID: #${booking.bookingID || 'N/A'}`;
    qrModalTrainInfo.textContent = `${booking.name || 'Train'} (#${booking.trainID || 'N/A'})`;
    qrModalPassengerInfo.textContent = `${booking.no_of_passengers || 1} Passenger(s) • ${booking.paymentStatus || 'Confirmed'}`;

    const payload = JSON.stringify({
        bid: booking.bookingID,
        tid: booking.trainID,
        pax: booking.no_of_passengers,
        date: booking.bookingDate,
        v: "TRV-VERIFIED"
    });

    qrModalImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(payload)}&bgcolor=090934&color=00d9ff&margin=2`;

    qrModal.classList.remove('hidden');
}

let bookings = [];
let filteredBookings = [];
let currentPage = 1;
let totalPages = 1;
let currentFilters = {
    search: '',
    status: 'all',
    dateFrom: '',
    dateTo: ''
};

// Init
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);

    dateTo.valueAsDate = today;
    dateFrom.valueAsDate = threeMonthsAgo;

    currentFilters.dateFrom = formatDateForAPI(threeMonthsAgo);
    currentFilters.dateTo = formatDateForAPI(today);

    fetchBookingHistory();
    setupEventListeners();
});
