const itemsPerPage = 5;
document.addEventListener('DOMContentLoaded', function() {
  // Initialize pagination
  let currentPage = 1;
  
  let allInquiries = [];
  
  // Fetch inquiries when page loads
  fetchAllInquiries();
  
  // Setup pagination controls
  document.getElementById('prev-page').addEventListener('click', function() {
    if (currentPage > 1) {
      currentPage--;
      displayInquiries(currentPage);
      updatePaginationControls();
    }
  });
  
  document.getElementById('next-page').addEventListener('click', function() {
    const maxPages = Math.ceil(allInquiries.length / itemsPerPage);
    if (currentPage < maxPages) {
      currentPage++;
      displayInquiries(currentPage);
      updatePaginationControls();
    }
  });
});

// Fetch all inquiries
function fetchAllInquiries() {
  const container = document.querySelector('.inquiries-container');
  container.innerHTML = '<div class="loading">Loading inquiries...</div>';
  
  // Use fetch API to get inquiries from server
  fetch('http://localhost/Traventure/Server/api/getcontact.php')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Parsed data:', data);
      if (data.status === 'success') {
        // Store all inquiries
        allInquiries = data.data || [];
        
        // Filter out any hidden inquiries from local storage
        filterHiddenInquiries();
        
        if (allInquiries.length > 0) {
          // Display first page of inquiries
          displayInquiries(1);
          updatePaginationControls();
        } else {
          container.innerHTML = '<div class="no-inquiries">No inquiries found</div>';
          document.querySelector('.pagination').style.display = 'none';
        }
      } else {
        container.innerHTML = `<div class="error">${data.message || 'Failed to load inquiries'}</div>`;
        document.querySelector('.pagination').style.display = 'none';
      }
    })
    .catch(error => {
      console.error('Error fetching inquiries:', error);
      container.innerHTML = '<div class="error">Failed to load inquiries. Please try again.</div>';
      document.querySelector('.pagination').style.display = 'none';
    });
}

// Filter out hidden inquiries
function filterHiddenInquiries() {
  // Get hidden inquiry IDs from local storage
  const hiddenInquiries = JSON.parse(localStorage.getItem('hiddenInquiries') || '[]');
  
  // Filter allInquiries to exclude hidden ones
  allInquiries = allInquiries.filter(inquiry => !hiddenInquiries.includes(inquiry.contactID.toString()));
}

// Display a specific page of inquiries
function displayInquiries(page) {
  const container = document.querySelector('.inquiries-container');
  container.innerHTML = '';
  
  // Calculate start and end index for the current page
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, allInquiries.length);
  
  // Get current page inquiries
  const currentInquiries = allInquiries.slice(startIndex, endIndex);

  // Display each inquiry
  currentInquiries.forEach(inquiry => {
    container.appendChild(createInquiryCard(inquiry));
  });
  
  // Update page indicator
  document.getElementById('current-page').textContent = page;
}

// Create inquiry card
function createInquiryCard(inquiry) {
  const card = document.createElement('div');
  card.className = 'inquiry-card';
  card.setAttribute('data-id', inquiry.contactID);
  
  // Get formatted date or N/A
  const createdDate = inquiry.created_at ? formatDate(inquiry.created_at) : 'N/A';
  
  card.innerHTML = `
    <h3>Contact Inquiry</h3>
    <div class="inquiry-meta">
      <div class="inquiry-sender">
        <strong>From:</strong> ${inquiry.name}
      </div>
      <div class="inquiry-contact">
        <strong>Email:</strong> ${inquiry.email}<br>
        <strong>Phone:</strong> ${inquiry.phone || 'N/A'}
      </div>
    </div>
    <div class="inquiry-content">
      <p>${inquiry.message}</p>
    </div>
    <div class="inquiry-actions">
      <button class="btn btn-read" data-id="${inquiry.contactID}">Mark as Read</button>
    </div>
  `;
  
  // Add event listeners for buttons
  card.querySelector('.btn-read').addEventListener('click', function(e) {
    e.stopPropagation(); // Prevent card click event
    markAsRead(inquiry.contactID, card);
  });
  
  
  return card;
}

// Update pagination controls
function updatePaginationControls() {
  const totalPages = Math.ceil(allInquiries.length / itemsPerPage);
  document.getElementById('total-pages').textContent = totalPages;
  
  // Enable/disable prev/next buttons
  const currentPage = parseInt(document.getElementById('current-page').textContent);
  document.getElementById('prev-page').disabled = currentPage <= 1;
  document.getElementById('next-page').disabled = currentPage >= totalPages;
  
  // Hide pagination if no pages
  document.querySelector('.pagination').style.display = totalPages > 0 ? 'flex' : 'none';
}

// Mark inquiry as read
function markAsRead(inquiryId, cardElement) {
  // Get current hidden inquiries from local storage
  const hiddenInquiries = JSON.parse(localStorage.getItem('hiddenInquiries') || '[]');
  
  // Add this inquiry ID to the hidden list if not already there
  if (!hiddenInquiries.includes(inquiryId.toString())) {
    hiddenInquiries.push(inquiryId.toString());
    localStorage.setItem('hiddenInquiries', JSON.stringify(hiddenInquiries));
  }
  
  // Add fade-out animation
  cardElement.classList.add('fade-out');
  
  // Remove card after animation completes
  setTimeout(() => {
    // Remove from DOM
    cardElement.remove();
    
    // Also remove from our array
    allInquiries = allInquiries.filter(inquiry => inquiry.contactID.toString() !== inquiryId.toString());
    
    // Update pagination
    const currentPage = parseInt(document.getElementById('current-page').textContent);
    displayInquiries(currentPage);
    updatePaginationControls();
    
    // If current page is now empty and not the first page, go to previous page
    if (currentPage > 1 && document.querySelectorAll('.inquiry-card').length === 0) {
      document.getElementById('prev-page').click();
    }
  }, 500); // Match this timing with the CSS animation duration
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}