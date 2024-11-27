// Get DOM elements
const modal = document.getElementById("userModal");
const openModalBtn = document.getElementById("Add-user");
const closeModalBtn = document.querySelector(".close");
const cancelBtn = document.getElementById("cancelBtn");

// Open Modal
openModalBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

// Close Modal
closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

cancelBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Close Modal when clicking outside content
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Handle Form Submission
document.getElementById("addUserForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const contactNumber = document.getElementById("contactNumber").value;

  console.log("New User Data:", {
    username,
    firstName,
    lastName,
    email,
    contactNumber,
  });

  modal.style.display = "none";
});

//Add user to database
document.getElementById("addUserForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent the default form submission

  // Collect form data
  const formData = new FormData(this);
  const formObject = Object.fromEntries(formData.entries());

  // Send the data to the backend
  fetch("../../../Server/api/adminAddUser.php", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(formObject),
  })
      .then((response) => response.json())
      .then((data) => {
          if (data.success) {
              alert("User added successfully!");
              this.reset(); // Clear the form
          } else {
              alert("Error adding user: " + data.error);
          }
      })
      .catch((error) => console.error("Error:", error));
});

