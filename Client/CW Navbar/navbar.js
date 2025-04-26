document.addEventListener("DOMContentLoaded", function () {
  // Initialize menu toggle for responsive behavior
  document.getElementById("menu-toggle").addEventListener("click", function () {
    const navMenu = document.getElementById("nav-menu");
    navMenu.classList.toggle("active");
  });
});
