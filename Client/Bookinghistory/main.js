// Configuration
const ITEMS_PER_PAGE = 5;

// DOM Elements
const loadingSpinner = document.getElementById('loading-spinner');
const errorMessage = document.getElementById('error-message');
const noResults = document.getElementById('no-results');
const bookingList = document.getElementById('booking-list');
const bookingTemplate = document.getElementById('booking-template');
const userDisplayName = document.getElementById('user-display-name');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const filterStatus = document.getElementById('filter-status');
const dateFrom = document.getElementById('date-from');
const dateTo = document.getElementById('date-to');
const applyDateFilter = document.getElementById('apply-date-filter');
const retryBtn = document.getElementById('retry-btn');

// State variables
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

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Set default date filters (last 3 months)
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    
    dateTo.valueAsDate = today;
    dateFrom.valueAsDate = threeMonthsAgo;
    
    currentFilters.dateFrom = formatDateForAPI(threeMonthsAgo);
    currentFilters.dateTo = formatDateForAPI(today);
    
    // Load initial data
    fetchBookingHistory();
    
    // Set up event listeners
    setupEventListeners();
});

// Set up all event listeners
function setupEventListeners() {
    // Search functionality
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Filter by status
    filterStatus.addEventListener('change', () => {
        currentFilters.status = filterStatus.value;
        applyFilters();
    });
    
    // Date filters
    applyDateFilter.addEventListener('click', () => {
        if (dateFrom.value && dateTo.value) {
            currentFilters.dateFrom = dateFrom.value;
            currentFilters.dateTo = dateTo.value;
            applyFilters();
        } else {
            alert('Please select both start and end dates');
        }
    });
    
    // Pagination
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
    
    // Retry button
    retryBtn.addEventListener('click', fetchBookingHistory);
}

// Handle search functionality
function handleSearch() {
    currentFilters.search = searchInput.value.trim();
    applyFilters();
}

// Apply all filters to the bookings
function applyFilters() {
    currentPage = 1; // Reset to first page when filters change
    
    filteredBookings = bookings.filter(booking => {
        // Search filter
        const searchMatch = currentFilters.search === '' || 
            booking.trainName.toLowerCase().includes(currentFilters.search.toLowerCase()) || 
            booking.trainNumber.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
            booking.fromStation.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
            booking.toStation.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
            booking.bookingId.toLowerCase().includes(currentFilters.search.toLowerCase());
        
        // Status filter
        const statusMatch = currentFilters.status === 'all' || booking.status === currentFilters.status;
        
        // Date filter
        const bookingDate = new Date(booking.journeyDate);
        const fromDate = new Date(currentFilters.dateFrom);
        const toDate = new Date(currentFilters.dateTo);
        toDate.setDate(toDate.getDate() + 1); // Include the end date
        
        const dateMatch = bookingDate >= fromDate && bookingDate < toDate;
        
        return searchMatch && statusMatch && dateMatch;
    });
    
    renderBookings();
}

// Format date for API
function formatDateForAPI(date) {
    return date.toISOString().split('T')[0];
}

// Format date for display
function formatDateForDisplay(dateString) {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Show error message
function showError() {
    loadingSpinner.classList.add('hidden');
    errorMessage.classList.remove('hidden');
    noResults.classList.add('hidden');
    bookingList.classList.add('hidden');
}

// Show no results message
function showNoResults() {
    loadingSpinner.classList.add('hidden');
    errorMessage.classList.add('hidden');
    noResults.classList.remove('hidden');
    bookingList.classList.add('hidden');
}

// Show booking list
function showBookingList() {
    loadingSpinner.classList.add('hidden');
    errorMessage.classList.add('hidden');
    noResults.classList.add('hidden');
    bookingList.classList.remove('hidden');
}

// Render paginated bookings
function renderBookings() {
    if (filteredBookings.length === 0) {
        showNoResults();
        updatePagination();
        return;
    }
    
    // Calculate pagination
    totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
    
    if (currentPage > totalPages) {
        currentPage = totalPages;
    }
    
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredBookings.length);
    const bookingsToDisplay = filteredBookings.slice(startIndex, endIndex);
    
    // Clear current bookings
    bookingList.innerHTML = '';
    
    showBookingList();
    updatePagination();
}
