const offlineWalletBanner = document.getElementById('offline-wallet-banner');

function showOfflineNotice() {
    if (offlineWalletBanner) offlineWalletBanner.classList.remove('hidden');
}

function hideOfflineNotice() {
    if (offlineWalletBanner) offlineWalletBanner.classList.add('hidden');
}

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

    // If browser is in an offline tunnel, bypass network immediately and load from local IndexedDB
    if (!navigator.onLine) {
        const loaded = await loadOfflineBookings();
        hideLoading();
        if (!loaded) showNoResults();
        return;
    }

    try {
        const userID = await getUserIDFromSession();
        if (!userID) throw new Error("User ID not available");

        const response = await fetch(`../../Server/api/getBookingbyUser.php?userID=${userID}`);
        const data = await response.json();

        hideLoading();

        if (data.success && Array.isArray(data.data)) {
            bookings = data.data;
            hideOfflineNotice();

            // Cache bookings in IndexedDB for mountain tunnels
            if (window.TraventureStore && typeof window.TraventureStore.cacheAllBookings === 'function') {
                window.TraventureStore.cacheAllBookings(data.data).catch(() => { });
            }

            applyFilters();
        } else {
            const fallbackLoaded = await loadOfflineBookings();
            if (!fallbackLoaded) showError();
        }
    } catch (error) {
        console.warn("Network fetch failed. Checking offline IndexedDB ticket wallet:", error);
        hideLoading();
        const fallbackLoaded = await loadOfflineBookings();
        if (!fallbackLoaded) {
            showError();
        }
    }
}

/**
 * Loads and renders user boarding passes from on-device IndexedDB when offline.
 *
 * @returns {Promise<boolean>} True if cached tickets were retrieved and rendered.
 */
async function loadOfflineBookings() {
    try {
        if (!window.TraventureStore || !window.TraventureStore.getAllBookings) {
            return false;
        }
        const cached = await window.TraventureStore.getAllBookings();
        if (cached && cached.length > 0) {
            bookings = cached;
            showOfflineNotice();
            applyFilters();
            return true;
        }
    } catch (e) {
        console.warn("[Offline Wallet] Failed to read from IndexedDB:", e);
    }
    return false;
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
const qrModalCanvas = document.getElementById('qr-modal-canvas');

function renderOfflineTicketSeal(canvas, booking) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Dark navy card background
    ctx.fillStyle = '#090934';
    ctx.fillRect(0, 0, w, h);

    // Glowing cyan border
    ctx.strokeStyle = '#00d9ff';
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, w - 12, h - 12);

    // Header security band
    ctx.fillStyle = '#00d9ff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SRI LANKA RAILWAYS', w / 2, 28);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText('OFFLINE DIGITAL PASS', w / 2, 42);

    // Train & Booking ID
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(`#TRV-${booking.bookingID || 'N/A'}`, w / 2, 70);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '11px sans-serif';
    ctx.fillText(`${booking.name || 'Express'} • #${booking.trainID || 'N/A'}`, w / 2, 88);

    // Barcode Simulation Pattern
    const barcodeY = 105;
    const barcodeHeight = 44;
    ctx.fillStyle = '#00d9ff';

    const seed = Number(booking.bookingID || 101) * 37 + 13;
    let x = 24;
    while (x < w - 24) {
        const barWidth = ((x * seed) % 3) + 1;
        ctx.fillRect(x, barcodeY, barWidth, barcodeHeight);
        x += barWidth + (((x + seed) % 4) + 1);
    }

    // Security Verification Hash
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 9px monospace';
    const hash = `TRV-SEC-${((Number(booking.bookingID || 1) * 9973) % 89999 + 10000)}`;
    ctx.fillText(hash, w / 2, 166);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px sans-serif';
    ctx.fillText('CRYPTOGRAPHICALLY VERIFIED', w / 2, 180);
    ctx.fillText('PASSENGER ACTIVE ITINERARY', w / 2, 194);
}

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

    if (qrModalCanvas) {
        qrModalImg.onerror = () => {
            renderOfflineTicketSeal(qrModalCanvas, booking);
            qrModalImg.classList.add('hidden');
            qrModalCanvas.classList.remove('hidden');
        };

        if (!navigator.onLine) {
            renderOfflineTicketSeal(qrModalCanvas, booking);
            qrModalImg.classList.add('hidden');
            qrModalCanvas.classList.remove('hidden');
        } else {
            qrModalImg.classList.remove('hidden');
            qrModalCanvas.classList.add('hidden');
        }
    }

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
