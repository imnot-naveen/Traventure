document.addEventListener('DOMContentLoaded', function() {
    // Initialize menu toggle
    document.getElementById('menu-toggle').addEventListener('click', function() {
        const navMenu = document.getElementById('nav-menu');
        navMenu.classList.toggle('active');
    });
  
    // Handle login state (optional)
    updateNavbarState(false); // Set initial state (false means not logged in)
  });
  
  function handleLogin(event) {
    event.preventDefault();
    // Simulate login action
    updateNavbarState(true); // Set state to logged in
  }
  
  function handleLogout(event) {
    event.preventDefault();
    // Simulate logout action
    updateNavbarState(false); // Set state to logged out
  }
  
  function updateNavbarState(isLoggedIn) {
    if (isLoggedIn) {
        document.getElementById('login-link').classList.add('hidden');
        document.getElementById('user-icon').classList.remove('hidden');
    } else {
        document.getElementById('login-link').classList.remove('hidden');
        document.getElementById('user-icon').classList.add('hidden');
    }
  }
  