document
  .getElementById("forgot-password-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;

    try {
      const response = await fetch(
        "/traventure/server/api/forgotpassword.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        alert(result.message);
        window.location.href = "../Verify Code/VerifyCode.html";
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("An error occurred while sending the reset code.");
      console.error(error);
    }
  });
