// manage.js
document.addEventListener("DOMContentLoaded", () => {
  loadDestinations();

  document
    .getElementById("create-destination-btn")
    .addEventListener("click", () => {
      window.location.href = "../add destination/addDestination.html"; // Redirect to create form
    });
});

function loadDestinations() {
  fetch("../../server/api/getDestinations.php")
    .then((response) => response.json())
    .then((data) => renderDestinationList(data))
    .catch((error) => console.error("Error:", error));
}

function renderDestinationList(destinations) {
  const destinationList = document.getElementById("destination-list");
  destinationList.innerHTML = "";

  destinations.forEach((destination) => {
    const destinationItem = document.createElement("div");
    destinationItem.className = "destination-item";
    destinationItem.innerHTML = `
        <h3>${destination.name}</h3>
        <p>${destination.description}</p>
        <div class="actions">
          <button class="edit-btn" data-id="${destination.id}">Edit</button>
          <button class="delete-btn" data-id="${destination.id}">Delete</button>
        </div>
      `;

    destinationItem.querySelector(".edit-btn").addEventListener("click", () => {
      window.location.href = `../edit destination/editDestination.html?id=${destination.id}`;
    });

    destinationItem
      .querySelector(".delete-btn")
      .addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this destination?")) {
          deleteDestination(destination.id);
        }
      });

    destinationList.appendChild(destinationItem);
  });
}

function deleteDestination(destinationId) {
  fetch(`../../server/api/deleteDestination.php?id=${destinationId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        alert("Destination deleted successfully!");
        loadDestinations();
      } else {
        alert("Failed to delete destination.");
      }
    })
    .catch((error) => console.error("Error:", error));
}
