document.addEventListener("DOMContentLoaded", () => {
  // Get trip data from localStorage
  const tripData = JSON.parse(localStorage.getItem("tripData")) || {};

  // Initialize selectedTrains array from localStorage
  let selectedTrains = JSON.parse(localStorage.getItem("selectedTrains")) || [];
  console.log(selectedTrains);

  // Check if we have the necessary data to proceed
  if (
    !tripData.trainID ||
    !tripData.stopovers ||
    tripData.stopovers.length === 0
  ) {
    alert("Missing trip information! Please start from the beginning.");
    window.location.href = "../select train/selecttrain.html";
    return;
  }

  console.log(tripData);

  // Determine which segment we're planning
  const currentSegmentIndex = tripData.currentSegment || 0;

  // If all segments are planned, redirect to itinerary
  if (currentSegmentIndex >= tripData.stopovers.length) {
    window.location.href = "../view itinerary/viewitinerary.html";
    return;
  }

  // Get origin and destination stations for current segment
  let originStationID;
  let destinationStationID;

  if (currentSegmentIndex == 0) {
    // First segment after initial selection
    originStationID = tripData.stopovers[0].nearestStation;
    destinationStationID =
      tripData.stopovers.length > 1
        ? tripData.stopovers[1].nearestStation
        : tripData.endStation; // Final destination if only one stopover
  } else {
    // Subsequent segments
    originStationID = tripData.stopovers[currentSegmentIndex].nearestStation;
    destinationStationID =
      currentSegmentIndex < tripData.stopovers.length - 1
        ? tripData.stopovers[currentSegmentIndex + 1].nearestStation
        : tripData.endStation; // Final destination if last segment
  }

  // Get station names for display
  const originName =
    currentSegmentIndex == 0
      ? tripData.stopovers[0].name
      : tripData.stopovers[currentSegmentIndex].name;

  const destinationName =
    currentSegmentIndex < tripData.stopovers.length - 1
      ? tripData.stopovers[currentSegmentIndex + 1].name
      : "Final Destination"; // This should ideally be the real name

  // Update UI to show current segment info
  const segmentInfoElement = document.getElementById("segment-info");
  if (segmentInfoElement) {
    segmentInfoElement.textContent = `Planning segment: ${originName} → ${destinationName}`;
  }

  // NEW CODE: Update journey info display
  const journeyInfoElement = document.getElementById("journey-info");
  if (journeyInfoElement) {
    // Create journey summary HTML
    let journeyHTML = "";

    // Start location and first train
    journeyHTML += `<div class="journey-step completed">
      <div class="step-icon"><i class="bx bxs-train"></i></div>
      <div class="step-details">
        <p class="step-title">Starting Train</p>
        <p class="step-info">Train ${tripData.trainID} selected</p>
      </div>
    </div>`;

    // Show stopovers and their status
    tripData.stopovers.forEach((stopover, index) => {
      const isCompleted = index < currentSegmentIndex;
      const isCurrent = index === currentSegmentIndex;
      const statusClass = isCompleted
        ? "completed"
        : isCurrent
        ? "current"
        : "pending";

      journeyHTML += `<div class="journey-step ${statusClass}">
        <div class="step-icon"><i class="bx bx-map-pin"></i></div>
        <div class="step-details">
          <p class="step-title">Stopover ${index + 1}: ${stopover.name}</p>
          <p class="step-info">`;

      if (isCompleted && tripData.segments && tripData.segments[index]) {
        journeyHTML += `Connected by Train ${tripData.segments[index].trainID}`;
      } else if (isCurrent) {
        journeyHTML += `Selecting connecting train now...`;
      } else {
        journeyHTML += `Pending selection`;
      }

      journeyHTML += `</p>
        </div>
      </div>`;
    });

    // Final destination
    const finalDestinationStatus =
      currentSegmentIndex >= tripData.stopovers.length ? "current" : "pending";
    journeyHTML += `<div class="journey-step ${finalDestinationStatus}">
      <div class="step-icon"><i class="bx bxs-flag-checkered"></i></div>
      <div class="step-details">
        <p class="step-title">Final Destination</p>
        <p class="step-info">End of journey</p>
      </div>
    </div>`;

    journeyInfoElement.innerHTML = journeyHTML;
  }

  // Get train results container reference
  const trainResultsContainer = document.getElementById("train-results");

  // First, get the arrival time of the previous train at the origin station
  const previousTrainID = tripData.segments
    ? tripData.segments[currentSegmentIndex - 1]?.trainID
    : tripData.trainID;

  // Fetch arrival time of previous train at current origin
  fetch(
    `../../server/api/getArrivalTime.php?trainID=${previousTrainID}&stationID=${originStationID}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        throw new Error(data.error);
      }

      // Get the arrival time to use as minimum departure time for next train
      const arrivalTime = data.arrivalTime;

      // Now fetch available trains for this segment that depart after the arrival time
      return fetch(
        `../../server/api/getNextTrains.php?startStationID=${originStationID}&endStationID=${destinationStationID}&departureTime=${arrivalTime}`
      );
    })
    .then((response) => response.json())
    .then((data) => {
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch trains");
      }

      // Render the available trains
      renderTrains(data.trains);
    })
    .catch((error) => {
      console.error("Error:", error);
      trainResultsContainer.innerHTML = `<tr><td colspan="7">Error: ${
        error.message || "Failed to load trains"
      }</td></tr>`;
    });

  // Function to render trains in the table
  const renderTrains = (trains) => {
    trainResultsContainer.innerHTML = ""; // Clear existing rows

    if (!trains || trains.length === 0) {
      trainResultsContainer.innerHTML =
        "<tr><td colspan='7'>No trains available for this segment.</td></tr>";
      return;
    }

    // Loop through the train data and populate the table
    trains.forEach((train) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${train.departureTime}</td>
        <td>${train.arrivalTime}</td>
        <td>${train.duration}</td>
        <td>${train.endStation}</td>
        <td>${train.trainID}</td>
        <td>${train.type}</td>
        <td>
          <button class="select-train-btn" data-trainid="${train.trainID}" data-departure="${train.departureTime}" data-name="${train.name}">
            Select
          </button>
        </td>
      `;

      trainResultsContainer.appendChild(row);
    });

    // Add event listeners for "Select" buttons
    const selectButtons = document.querySelectorAll(".select-train-btn");
    selectButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const trainID = e.target.getAttribute("data-trainid");
        const departureTime = e.target.getAttribute("data-departure");
        const name = e.target.getAttribute("data-name");
        console.log(trainID);

        if (trainID) {
          // Add selected train to the selectedTrains array
          selectedTrains.push({
            trainID: trainID,
            departureTime: departureTime,
            name: name,
          });

          // Save the updated array to localStorage
          localStorage.setItem(
            "selectedTrains",
            JSON.stringify(selectedTrains)
          );

          // Save selected train to localStorage for this segment
          if (!tripData.segments) {
            tripData.segments = [];
          }

          // Find the selected train's full details
          const selectedTrain = trains.find(
            (train) => train.trainID == trainID
          );

          console.log(selectedTrain);

          // Store the segment information
          tripData.segments[currentSegmentIndex] = {
            trainID: trainID,
            originStationID: originStationID,
            destinationStationID: destinationStationID,
            departureTime: selectedTrain.departureTime,
            arrivalTime: selectedTrain.arrivalTime,
            duration: selectedTrain.duration,
            type: selectedTrain.type,
          };

          // Update current segment counter
          tripData.currentSegment = currentSegmentIndex + 1;

          // Save updated trip data
          localStorage.setItem("tripData", JSON.stringify(tripData));

          // Determine next page
          if (currentSegmentIndex + 1 >= tripData.stopovers.length) {
            // All segments planned, go to itinerary
            window.location.href = "../view itinerary/viewitinerary.html";
          } else {
            // More segments to plan, reload this page
            window.location.reload();
          }
        }
      });
    });
  };

  // Filter by train type (if this functionality is present)
  const filterSelect = document.getElementById("train-type-filter");
  if (filterSelect) {
    filterSelect.addEventListener("change", () => {
      // Reload trains with filter
      const selectedType = filterSelect.value;

      fetch(
        `../../server/api/getNextTrains.php?startStationID=${originStationID}&endStationID=${destinationStationID}&departureTime=${arrivalTime}&type=${selectedType}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            renderTrains(data.trains);
          } else {
            trainResultsContainer.innerHTML = `<tr><td colspan="7">${
              data.message || "No trains available"
            }</td></tr>`;
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  }

  // Sort by departure time (if this functionality is present)
  const sortDepartureBtn = document.getElementById("sort-departure");
  if (sortDepartureBtn) {
    sortDepartureBtn.addEventListener("click", () => {
      // Get current train data and sort it
      const trains = Array.from(
        trainResultsContainer.querySelectorAll("tr:not(:first-child)")
      )
        .map((row) => {
          const cells = row.querySelectorAll("td");
          return {
            departureTime: cells[0].textContent,
            arrivalTime: cells[1].textContent,
            duration: cells[2].textContent,
            endStation: cells[3].textContent,
            trainID: cells[4].textContent,
            type: cells[5].textContent,
          };
        })
        .sort(
          (a, b) =>
            new Date("1970/01/01 " + a.departureTime) -
            new Date("1970/01/01 " + b.departureTime)
        );

      renderTrains(trains);
    });
  }

  // Sort by arrival time (if this functionality is present)
  const sortArrivalBtn = document.getElementById("sort-arrival");
  if (sortArrivalBtn) {
    sortArrivalBtn.addEventListener("click", () => {
      // Get current train data and sort it
      const trains = Array.from(
        trainResultsContainer.querySelectorAll("tr:not(:first-child)")
      )
        .map((row) => {
          const cells = row.querySelectorAll("td");
          return {
            departureTime: cells[0].textContent,
            arrivalTime: cells[1].textContent,
            duration: cells[2].textContent,
            endStation: cells[3].textContent,
            trainID: cells[4].textContent,
            type: cells[5].textContent,
          };
        })
        .sort(
          (a, b) =>
            new Date("1970/01/01 " + a.arrivalTime) -
            new Date("1970/01/01 " + b.arrivalTime)
        );

      renderTrains(trains);
    });
  }
});
