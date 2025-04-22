let typingTimeout, erasingTimeout;

function typeWriter(text, i, fnCallback) {
  if (i < text.length) {
    document.getElementById("animated-text").innerHTML =
      text.substring(0, i + 1) + '<span aria-hidden="true"></span>';
    typingTimeout = setTimeout(function () {
      typeWriter(text, i + 1, fnCallback);
    }, 50);
  } else if (typeof fnCallback === "function") {
    setTimeout(fnCallback, 1500);
  }
}

function eraseText(i, fnCallback) {
  const element = document.getElementById("animated-text");
  if (i > 0) {
    element.innerHTML =
      element.innerHTML.substring(0, i - 1) +
      '<span aria-hidden="true"></span>';
    erasingTimeout = setTimeout(function () {
      eraseText(i - 1, fnCallback);
    }, 30);
  } else if (typeof fnCallback === "function") {
    setTimeout(fnCallback, 500);
  }
}

function resetAnimation(text1, text2) {
  clearTimeout(typingTimeout);
  clearTimeout(erasingTimeout);
  document.getElementById("animated-text").innerHTML = "";
  animateAlternatingText(text1, text2);
}

function animateAlternatingText(text1, text2) {
  typeWriter(text1, 0, function () {
    eraseText(text1.length, function () {
      typeWriter(text2, 0, function () {
        eraseText(text2.length, function () {
          animateAlternatingText(text1, text2);
        });
      });
    });
  });
}

function switchTab(tab) {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const loginTab = document.querySelector(".tab:nth-child(2)");
  const signupTab = document.querySelector(".tab:nth-child(1)");

  clearTimeout(typingTimeout);
  clearTimeout(erasingTimeout);

  document.getElementById("animated-text").innerHTML = "";
  typingTimeout = null;
  erasingTimeout = null;

  if (tab === "signup") {
    loginForm.style.display = "none";
    signupForm.style.display = "block";
    loginTab.classList.remove("active");
    signupTab.classList.add("active");
    resetAnimation("Sign up with us", "Let's start your journey");
  } else {
    loginForm.style.display = "block";
    signupForm.style.display = "none";
    loginTab.classList.add("active");
    signupTab.classList.remove("active");
    resetAnimation("Login to Traventure", "Continue your journey");
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

// Start the animation with initial texts
animateAlternatingText("Welcome to Traventure", "Your adventure starts here");
