const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");

menuBtn.addEventListener('click', ()=>{
  sideMenu.style.display = 'block';
})

closeBtn.addEventListener('click', ()=>{
  sideMenu.style.display = 'none';
})

//Table row href
document.addEventListener("DOMContentLoaded", function() {
  const tableRows = document.querySelectorAll("#userTable tbody tr");

  tableRows.forEach(row => {
      // Add click event to each row
      row.addEventListener("click", function() {
          const userId = this.cells[0].textContent; 
          window.location.href = `/project-clone/grpprjct-myprt/Admin/Users/User/User.php`; 
      });
  });
});

//     document.addEventListener("DOMContentLoaded", function() {
//     const tableRows = document.querySelectorAll("#userTable tbody tr");

//     tableRows.forEach(row => {
//         row.style.cursor = "pointer"; 
//         // Add click event to each row
//         row.addEventListener("click", function() {
//             const userId = this.cells[0].textContent; // Assuming first cell has the User ID
//             window.location.href = `/Users/${userId}`;  // Replace with your URL structure
//         });
//     });
// });


function filterUsers() {
  const searchValue = document.getElementById("searchBar").value.toLowerCase();
  const rows = document.querySelectorAll("#userTable tbody tr");

  rows.forEach((row) => {
    const name = row.querySelector("td:nth-child(2)").innerText.toLowerCase();
    if (name.includes(searchValue)) {
      row.style.display = ""; // Show row
    } else {
      row.style.display = "none"; // Hide row
    }
  });
}

