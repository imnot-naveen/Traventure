const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");

menuBtn.addEventListener('click', ()=>{
  sideMenu.style.display = 'block';
})

closeBtn.addEventListener('click', ()=>{
  sideMenu.style.display = 'none';
})

fetch('http://localhost/Traventure/Server/api/getMonthlyRev.php')
    .then(response => response.json())
    .then(data => {
        if (data.success && typeof data.revenue === 'number') {
            const countElement = document.getElementById('revenue');
            countElement.textContent = `${data.revenue}`;
        } else {
            console.error('Error: Unexpected response format or no count field');
            document.getElementById('revenue').textContent = "0";
        }
    })
    .catch(error => console.error('Error fetching Revenue count:', error)); 