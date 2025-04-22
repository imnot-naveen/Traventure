//handle form submission
document.getElementById("type-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", document.getElementById("name").value);
  formData.append("photo", document.getElementById("photo").files[0]);

  fetch("../../server/api/addDestinationTypes.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Type adding successful");
        location.reload();
      } else {
        alert(`Error: ${data.message}`);
      }
    });
});
