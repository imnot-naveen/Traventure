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
          window.location.href = "../home/home.html";
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

    const username = document.getElementById("new-username").value;
    const firstName = document.getElementById("new-firstName").value;
    const lastName = document.getElementById("new-lastName").value;
    const contactNumber = document.getElementById("new-contact").value;
    const email = document.getElementById("email").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

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
      }),
    })
      .then((response) => response.json())
      .then((jsonData) => {
        if (jsonData.success) {
          alert("Signup successful! Please log in.");
          switchTab("login");
        } else {
          alert(jsonData.message || "Signup failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
      });
  });

// Start the animation with initial texts
animateAlternatingText("Welcome to Traventure", "Your adventure starts here");
