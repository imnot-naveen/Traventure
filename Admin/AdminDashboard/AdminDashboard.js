document.addEventListener("DOMContentLoaded", function () {
  const tabLinks = document.querySelectorAll(".tab-link");
  const tabContents = document.querySelectorAll(".tab-content");

  function showTabContent(tabId) {
      tabContents.forEach(content => {
          content.style.display = "none";
      });
      document.getElementById(tabId).style.display = "block";
  }

  tabLinks.forEach(link => {
      link.addEventListener("click", function (e) {
          e.preventDefault();
          const tabId = this.getAttribute("data-tab");

          tabLinks.forEach(link => link.classList.remove("active"));
          this.classList.add("active");

          showTabContent(tabId);
      });
  });

  // Show the default content (Admin Details) on page load
  showTabContent("admin-details");
  tabLinks[0].classList.add("active");
});
