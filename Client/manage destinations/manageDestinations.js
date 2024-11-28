document.addEventListener("DOMContentLoaded", () => {
  // Add go back functionality
  document.getElementById("go-back-btn").addEventListener("click", () => {
    window.location.href = "../TSP dashboard/dashboard.php"; // Adjust the path as needed
  });

  loadDestinations();

  document
    .getElementById("create-destination-btn")
    .addEventListener("click", () => {
      window.location.href = "../add destination/addDestination.php";
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
          <button class="btn edit-btn" data-id="${destination.id}">Edit</button>
          <button class="btn delete-btn" data-id="${destination.id}">Delete</button>
        </div>
      `;

    destinationItem.querySelector(".edit-btn").addEventListener("click", () => {
      window.location.href = `../edit destination/editDestination.php?id=${destination.id}`;
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
