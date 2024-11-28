document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("../../Server/api/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((jsonData) => {
        if (jsonData.success) {
          alert(jsonData.message || "Login successful!");

          // Redirect based on userType
          switch (jsonData.userType) {
            case "Admin":
              window.location.href = "../Admin/AdminDashboard.php";
              break;
            case "Traveller":
              window.location.href = "../home/home.html";
              break;
            case "TSP":
              window.location.href = "../manage trains/managetrains.php";
              break;
            case "CW":
              window.location.href = "../CW Home/home.html";
            default:
              alert("Unknown user type. Contact support.");
              break;
          }
        } else {
          alert(jsonData.message || "Login failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
      });
  });
