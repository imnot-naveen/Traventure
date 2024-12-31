document
  .getElementById("reset-password-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    try {
      const response = await fetch("/traventure/server/api/resetpassword.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        alert(result.message);
        window.location.href = "LoginPage.html";
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("An error occurred while resetting the password.");
      console.error(error);
    }
  });
