const trainList = document.getElementById("train-list");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const currentPageElement = document.getElementById("current-page");

let currentPage = 1;
const trainsPerPage = 10;
let currentTrainToDelete = null;
let actionType = "disable"; // disable or activate

// Modals
const disableModal = document.getElementById("disableModal");
const activateModal = document.getElementById("activateModal");

// Disable modal buttons
const confirmDisableBtn = document.getElementById("confirmDisable");
const cancelDisableBtn = document.getElementById("cancelDisable");

// Activate modal buttons
const confirmActivateBtn = document.getElementById("confirmActivate");
const cancelActivateBtn = document.getElementById("cancelActivate");

// Fetch trains
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

// Populate table
function populateTrainList(trains) {
  trainList.innerHTML = "";
  trains.forEach((train) => {
    const row = document.createElement("tr");

    let toSet = "Disable";
    if (train.status === "Disabled") {
      toSet = "Activate";
    }

    row.innerHTML = `
      <td>${train.trainID}</td>
      <td>${train.name}</td>
      <td>
        <a href="../train details/trainDetails.html?trainNo=${train.trainID}" class="view">View</a>
        <a href="../edit trains/editTrains.php?trainNo=${train.trainID}" class="edit">Edit</a>
        <button class="${toSet}" data-train-id="${train.trainID}">${toSet}</button>
      </td>
    `;
    trainList.appendChild(row);
  });
}

// Listen for button clicks
document.addEventListener("click", function (e) {
  if (
    e.target &&
    (e.target.classList.contains("Disable") ||
      e.target.classList.contains("Activate"))
  ) {
    e.preventDefault();
    currentTrainToDelete = e.target.dataset.trainId;

    if (e.target.classList.contains("Disable")) {
      actionType = "disable";
      disableModal.style.display = "block";
    } else if (e.target.classList.contains("Activate")) {
      actionType = "activate";
      activateModal.style.display = "block";
    }
  }
});

// Cancel buttons
cancelDisableBtn.addEventListener("click", function () {
  disableModal.style.display = "none";
  currentTrainToDelete = null;
});

cancelActivateBtn.addEventListener("click", function () {
  activateModal.style.display = "none";
  currentTrainToDelete = null;
});

// Close modals when clicking outside
window.addEventListener("click", function (e) {
  if (e.target === disableModal) {
    disableModal.style.display = "none";
    currentTrainToDelete = null;
  }
  if (e.target === activateModal) {
    activateModal.style.display = "none";
    currentTrainToDelete = null;
  }
});

// Confirm disable
confirmDisableBtn.addEventListener("click", function () {
  if (currentTrainToDelete) {
    updateTrainStatus(currentTrainToDelete, "Disabled");
    disableModal.style.display = "none";
  }
});

// Confirm activate
confirmActivateBtn.addEventListener("click", function () {
  if (currentTrainToDelete) {
    updateTrainStatus(currentTrainToDelete, "Active");
    activateModal.style.display = "none";
  }
});

// Update train status
function updateTrainStatus(trainID, status) {
  fetch("../../server/api/updatetrainstatus.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trainID: trainID, status: status }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        fetchTrains(currentPage);
        alert(`Train ${status.toLowerCase()}d successfully`);
      } else {
        alert("Error updating train: " + data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error updating train. Please try again.");
    })
    .finally(() => {
      currentTrainToDelete = null;
    });
}

// Pagination
function togglePagination(totalTrains) {
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage * trainsPerPage >= totalTrains;
}

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
