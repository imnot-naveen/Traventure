document
  .getElementById("verification-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const verificationCode = document.getElementById("verification-code").value;

    try {
      const response = await fetch("/traventure/server/api/verifycode.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ verification_code: verificationCode }),
      });

      const result = await response.json();

      if (result.status === "success") {
        alert(result.message);
        window.location.href = "../reset password/resetpassword.html";
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("An error occurred while verifying the code.");
      console.error(error);
    }
  });
