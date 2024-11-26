const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");

menuBtn.addEventListener('click', ()=>{
  sideMenu.style.display = 'block';
})

closeBtn.addEventListener('click', ()=>{
  sideMenu.style.display = 'none';
})

function filterUsers() {
  const searchValue = document.getElementById("searchBar").value.toLowerCase();
  const rows = document.querySelectorAll("#userTable tbody tr");

  rows.forEach((row) => {
    const name = row.querySelector("td:nth-child(3)").innerText.toLowerCase();
    if (name.includes(searchValue)) {
      row.style.display = ""; // Show row
    } else {
      row.style.display = "none"; // Hide row
    }
  });
}

