// Get train number from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const trainNo = urlParams.get("trainNo");

// Function to format time
function formatTime(timeString) {
  if (!timeString) return "N/A";
  const time = new Date(`2000-01-01T${timeString}`);
  return time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

async function fetchTrainDetails() {
  try {
    const response = await fetch(
      `../../server/api/gettrain.php?trainNo=${trainNo}`
    );
    if (!response.ok) throw new Error("Failed to fetch train details");

    const data = await response.json();
    console.log("API Response:", data);

    if (data.error) {
      document.getElementById("train-details").innerHTML = `
                <div class="train-info">
                    <h2>Error</h2>
                    <p>${data.error}</p>
                </div>
            `;
      return;
    }

    // Create the HTML for train details
    const detailsHTML = `
            <div class="train-info">
                <h2>${data.name} (Train No: ${data.trainID})</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Train Type</div>
                        <div class="info-value">${data.type || "N/A"}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Running Days</div>
                        <div class="info-value">${data.days || "N/A"}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Start Station</div>
                        <div class="info-value">${
                          data.startStation || "N/A"
                        }</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">End Station</div>
                        <div class="info-value">${
                          data.endStation || "N/A"
                        }</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Departure Time</div>
                        <div class="info-value">${formatTime(
                          data.departureTime
                        )}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Arrival Time</div>
                        <div class="info-value">${formatTime(
                          data.arrivalTime
                        )}</div>
                    </div>
                </div>
            </div>

            <div class="stops-section">
                <h3>Train Stops</h3>
                <table class="stops-table">
                    <thead>
                        <tr>
                            <th>Station ID</th>
                            <th>Station Name</th>
                            <th>Arrival</th>
                            <th>Departure</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${
                          data.stops && data.stops.length > 0
                            ? data.stops
                                .map(
                                  (stop) => `
                                <tr>
                                    <td>${stop.stationID || "N/A"}</td>
                                    <td>${stop.name || "N/A"}</td>
                                    <td>${formatTime(stop.arrivalTime)}</td>
                                    <td>${formatTime(stop.departureTime)}</td>
                                </tr>
                            `
                                )
                                .join("")
                            : '<tr><td colspan="4">No stops information available</td></tr>'
                        }
                    </tbody>
                </table>
            </div>
        `;

    document.getElementById("train-details").innerHTML = detailsHTML;
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("train-details").innerHTML = `
            <div class="train-info">
                <h2>Error</h2>
                <p>Failed to load train details. Please try again later.</p>
            </div>
        `;
  }
}

// Initial load
fetchTrainDetails();
