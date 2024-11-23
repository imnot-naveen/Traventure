const trainList = document.getElementById("train-list");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const currentPageElement = document.getElementById("current-page");

let currentPage = 1;
const trainsPerPage = 10;

// Fetch trains data dynamically
async function fetchTrains(page) {
  const offset = (page - 1) * trainsPerPage;

  try {
    const response = await fetch(
      `../../server/api/getalltrains.php?limit=${trainsPerPage}&offset=${offset}`
    );
    if (!response.ok) throw new Error("Failed to fetch train data.");

    const data = await response.json();
    populateTrainList(data.trains);
    togglePagination(data.totalTrains);
  } catch (error) {
    console.error(error);
  }
}

let currentTrainToDelete = null; // Store the train ID to be deleted

function populateTrainList(trains) {
  trainList.innerHTML = "";

  trains.forEach((train) => {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${train.trainID}</td>
            <td>${train.name}</td>
            <td>
                <a href="trainDetails.html?trainNo=${train.trainID}" class="view">View</a>
                <a href="../edit trains/editTrains.html?trainNo=${train.trainID}" class="edit">Edit</a>
                <button class="delete" data-train-id="${train.trainID}">Delete</button>
            </td>
        `;

    trainList.appendChild(row);
  });
}

// Modal handling
const modal = document.getElementById("deleteModal");
const confirmDeleteBtn = document.getElementById("confirmDelete");
const cancelDeleteBtn = document.getElementById("cancelDelete");

// Delete button click handler
document.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("delete")) {
    e.preventDefault();
    currentTrainToDelete = e.target.dataset.trainId;
    modal.style.display = "block";
  }
});

// Cancel delete
cancelDeleteBtn.addEventListener("click", function () {
  modal.style.display = "none";
  currentTrainToDelete = null;
});

// Close modal if clicked outside
window.addEventListener("click", function (e) {
  if (e.target === modal) {
    modal.style.display = "none";
    currentTrainToDelete = null;
  }
});

// Confirm delete
confirmDeleteBtn.addEventListener("click", function () {
  if (currentTrainToDelete) {
    deleteTrain(currentTrainToDelete);
  }
});

// Delete train function
function deleteTrain(trainID) {
  fetch("../../server/api/deletetrain.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      trainID: trainID,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      modal.style.display = "none";
      if (data.success) {
        // Refresh the train list
        fetchTrains(currentPage);
        alert("Train deleted successfully");
      } else {
        alert("Error deleting train: " + data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error deleting train. Please try again.");
    })
    .finally(() => {
      currentTrainToDelete = null;
    });
}
// Toggle pagination buttons
function togglePagination(totalTrains) {
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage * trainsPerPage >= totalTrains;
}

// Event listeners for pagination
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    currentPageElement.textContent = currentPage;
    fetchTrains(currentPage);
  }
});

nextBtn.addEventListener("click", () => {
  currentPage++;
  currentPageElement.textContent = currentPage;
  fetchTrains(currentPage);
});

// Initial fetch
fetchTrains(currentPage);
