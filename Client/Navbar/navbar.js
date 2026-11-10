// Global Traventure Navbar Controller
document.addEventListener("DOMContentLoaded", () => {
  setupNavbarToggle();
});

function setupNavbarToggle() {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const drawer = document.getElementById("mobile-nav-drawer");

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener("click", () => {
      drawer.classList.toggle("hidden");
      const icon = toggleBtn.querySelector("i");
      if (icon) {
        if (drawer.classList.contains("hidden")) {
          icon.className = "fa-solid fa-bars text-sm";
        } else {
          icon.className = "fa-solid fa-xmark text-sm";
        }
      }
    });
  }
}

// Support for dynamically injected navbar placeholders
window.setupNavbarToggle = setupNavbarToggle;
