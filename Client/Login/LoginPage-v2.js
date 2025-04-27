let typingTimeout, erasingTimeout;

function switchTab(tab) {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const loginTab = document.querySelector(".tab:nth-child(2)");
  const signupTab = document.querySelector(".tab:nth-child(1)");

  if (tab === "signup") {
    loginForm.style.display = "none";
    signupForm.style.display = "block";
    loginTab.classList.remove("active");
    signupTab.classList.add("active");
  } else {
    loginForm.style.display = "block";
    signupForm.style.display = "none";
    loginTab.classList.add("active");
    signupTab.classList.remove("active");
  }
}

// Handle login form submission
document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("/traventure/server/api/login.php", {
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
              window.location.href =
                "../Admin/AdminDashboard/AdminDashboard.php";
              break;
            case "Traveller":
              window.location.href = "../home/home.html";
              break;
            case "TSP":
              window.location.href = "../TSP Dashboard/dashboard.php";
              break;
            case "CW":
              window.location.href = "../CW Home/home.php";
              break;
            case "Driver":
              window.location.href = "../Driver/Dashboard/Dashboard.php";
              break;
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

// Handle signup form submission
document
  .getElementById("signup-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Clear previous error messages
    document
      .querySelectorAll(".error-message")
      .forEach((el) => (el.textContent = ""));

    const username = document.getElementById("new-username").value;
    const firstName = document.getElementById("new-firstName").value;
    const lastName = document.getElementById("new-lastName").value;
    const id_number = document.getElementById("new-idNumber").value;
    const contactNumber = document.getElementById("new-contact").value;
    const email = document.getElementById("email").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const userType = "Traveller";

    let valid = true;

    // Validate contact number (10 digits)
    if (contactNumber.length !== 10) {
      document.getElementById("contact-error").textContent =
        "Contact number must be exactly 10 digits.";
      valid = false;
    } else if (!/^\d+$/.test(contactNumber)) {
      document.getElementById("contact-error").textContent =
        "Contact number must contain only digits.";
      valid = false;
    }

    // Check if email is not empty
    if (!email) {
      document.getElementById("email-error").textContent = "Email is required.";
      valid = false;
    }

    //validate id number
    if (!(id_number.length < 15)) {
      alert("Invalid id_number");
      valid = false;
    }

    // password validation requirements
    let strength = 0;
    let messages = [];
    const requirements = {
      minLength: 8,
      requireUpper: true,
      requireLower: true,
      requireNumber: true,
      requireSpecialChar: true,
    };

    if (password.length < requirements.minLength) {
      document.getElementById("password-error") = `Password must be at least ${requirements.minLength} characters`;
    } else {
      strength += 1;
    }

    if (requirements.requireUpper && !/[A-Z]/.test(password)) {
      document.getElementById("password-error").textContent =
        "Password must be have at least one uppercase letter";
    } else {
      strength += 1;
    }

    if (requirements.requireLower && !/[a-z]/.test(password)) {
      document.getElementById("password-error").textContent =
        "Password must have at least one lowercase letter";
    } else {
      strength += 1;
    }

    if (requirements.requireNumber && !/\d/.test(password)) {
      document.getElementById("password-error").textContent =
        "Password must have at least one number";
    } else {
      strength += 1;
    }

    if (
      requirements.requireSpecialChar &&
      !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    ) {
      document.getElementById("password-error").textContent = "Password is too weak. Password should have at least one uppercase letter, one lowercase letter, one number and one special character";
    } else {
      strength += 1;
    }

    if(strength < 5){
      valid = false;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      document.getElementById("confirm-password-error").textContent =
        "Passwords do not match. Please try again.";
      valid = false;
    }

    // If validation fails, stop the submission
    if (!valid) {
      return;
    }

    // Proceed with form submission if valid
    fetch("/traventure/server/api/signup.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        first_name: firstName,
        last_name: lastName,
        id_number: id_number,
        email: email,
        contact_number: contactNumber,
        password: newPassword,
        user_type: userType,
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
          alert(jsonData.message || "Signup successful! User logged In..");
          // Redirect to preffered destinations page
          window.location.href =
            "../DestinationPreferences/destPreferences.html";
        } else {
          alert(jsonData.message || "Signup failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
      });
  });

// Real-time validation for contact number
document.getElementById("new-contact").addEventListener("input", function () {
  const contactNumber = this.value;
  const contactError = document.getElementById("contact-error");

  // Clear previous error message
  contactError.textContent = "";

  // Validate contact number
  if (contactNumber.length > 10) {
    contactError.textContent = "Contact number must be exactly 10 digits.";
  } else if (!/^\d*$/.test(contactNumber)) {
    contactError.textContent = "Contact number must contain only digits.";
  }
});

// Real-time validation for email
document.getElementById("email").addEventListener("input", function () {
  const email = this.value;
  const emailError = document.getElementById("email-error");

  // Clear previous error message
  emailError.textContent = "";

  // Check if email is empty
  if (!email) {
    emailError.textContent = "Email is required.";
  }
});

function goBack() {
  window.history.back();
}
