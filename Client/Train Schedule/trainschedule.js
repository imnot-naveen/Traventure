document.addEventListener("DOMContentLoaded", () => {
  // Fetch train data from localStorage
  const trainData = JSON.parse(localStorage.getItem("trainData"));

  const trainResultsContainer = document.getElementById("train-results");

  if (!trainData || trainData.length === 0) {
    trainResultsContainer.innerHTML =
      "<tr><td colspan='6'>No trains available.</td></tr>";
    return;
  }

  // Loop through the train data and populate the table
  trainData.forEach((train) => {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${train.departureTime}</td>
            <td>${train.arrivalTime}</td>
            <td>${train.duration}</td>
            <td>${train.endStation}</td>
            <td>${train.trainID}</td>
            <td>${train.type}</td>
        `;

    trainResultsContainer.appendChild(row);
  });
});
