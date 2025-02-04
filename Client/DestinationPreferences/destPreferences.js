document.addEventListener("DOMContentLoaded", function () {
  fetch("../../server/api/getDestinationTypes.php")
    .then((response) => response.json())
    .then((data) => {
      let destinations = data.types;
      if (!Array.isArray(destinations)) {
        throw new Error("Invalid data format: Expected an array");
      }

      let container = document.getElementById("destinationList");
      destinations.forEach((dest) => {
        let label = document.createElement("label");
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = dest.type_id;
        checkbox.name = "destination";
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(dest.type));
        container.appendChild(label);
        container.appendChild(document.createElement("br"));
      });
    })
    .catch((error) => console.error("Error fetching destinations:", error));

  document
    .getElementById("preferenceForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      let selectedDestinations = Array.from(
        document.querySelectorAll('input[name="destination"]:checked')
      ).map((cb) => cb.value);

      fetch("../../server/api/saveUserDestinations.php", {
        method: "POST",
        body: JSON.stringify({ destinations: selectedDestinations }),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          window.location.href = "../home/home.html"; // Redirect after saving
        });
    });
});
