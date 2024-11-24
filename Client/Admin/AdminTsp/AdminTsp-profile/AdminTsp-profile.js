const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");

menuBtn.addEventListener('click', ()=>{
  sideMenu.style.display = 'block';
})

closeBtn.addEventListener('click', ()=>{
  sideMenu.style.display = 'none';
})

// Deactivate Modal
// Get elements
const deactivateBtn = document.getElementById('deactivateBtn');
const modal = document.getElementById('deactivateModal');
const closeModal = document.getElementById('closeModal-d'); // Ensure the ID matches
const confirmDeactivateBtn = document.getElementById('confirmDeactivateBtn');
const cancelDeactivateBtn = document.getElementById('cancelDeactivateBtn');

// Open modal when Deactivate button is clicked
deactivateBtn.addEventListener("click", function() {
    modal.style.display = "block";
});

// Close modal when 'x' is clicked
closeModal.addEventListener("click", function() {
    modal.style.display = "none";
});

// Close modal when 'Cancel' button is clicked
cancelDeactivateBtn.addEventListener("click", function() {
    modal.style.display = "none";
});

// Confirm Deactivation action
confirmDeactivateBtn.addEventListener("click", function() {
    modal.style.display = "none";
});

// Close modal if clicked outside the modal content
window.addEventListener("click", function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});
