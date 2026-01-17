document
  .getElementById("contact-us")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    //clear old errors
    document.getElementById("emailError").textContent = "";
    document.getElementById("phoneError").textContent = "";
    const firstName = document.getElementById("fName").value;
    const lastName = document.getElementById("lName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const message = document.getElementById("message").value;

    //validating input
    valid = true;

    if (!firstName || !lastName || !email || !phone || !message) {
      alert("One of the form elements is missing. Try again!");
      valid = false;
    }

    if (phone.length !== 10) {
      document.getElementById("phoneError").textContent =
        "Phone number must be 10 digits long!";
      valid = false;
    } else if (!/^\d+$/.test(phone)) {
      document.getElementById("phoneError").textContent =
        "Phone number must contain only digit";
      valid = false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      document.getElementById("emailError").textContent =
        "Enter a valid email.";
      valid = false;
    }

    let fullName = firstName + " " + lastName;

    if (valid) {
      fetch("/traventure/server/api/contactUs.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          phone_number: phone,
          email: email,
          message: message,
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
            alert(jsonData.message || "Thank you for contacting Traventure!");
            location.reload();
          } else {
            alert(jsonData.message || "Form submission. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("An error occurred. Please try again later.");
        });
    }
  });
