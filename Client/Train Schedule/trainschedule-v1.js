// document.addEventListener("DOMContentLoaded", () => {
//   const trainData = JSON.parse(localStorage.getItem("trainData"));

//   if (!trainData || trainData.length === 0) {
//       document.getElementById("train-results").innerHTML = "<tr><td colspan='6'>No trains available.</td></tr>";
//       return;
//   }

//   trainData.forEach((train) => {
//       const row = document.createElement("tr");
//       row.innerHTML = `
//           <td>${train.departureTime}</td>
//           <td>${train.arrivalTime}</td>
//           <td>${train.duration}</td>
//           <td>${train.endStation}</td>
//           <td>${train.trainID}</td>
//           <td>${train.type}</td>
//       `;

//       row.addEventListener("click", () => {
//           localStorage.setItem("selectedTrain", JSON.stringify(train)); 
//           window.location.href = "../Booking/Booking Form/booking_form.html";
//       });

//       document.getElementById("train-results").appendChild(row);
//   });
// });


document.addEventListener("DOMContentLoaded", () => {
  // Retrieve train data
  const trainData = JSON.parse(localStorage.getItem("trainData"));
  
  // Also retrieve station information
  const startStation = localStorage.getItem("startStation");
  const endStation = localStorage.getItem("endStation");
  
  console.log("Retrieved Start Station:", startStation);
  console.log("Retrieved End Station:", endStation);
  
  // If journey details were stored as a single object (from the fixed code)
  const journeyDetails = JSON.parse(localStorage.getItem("journeyDetails"));
  console.log("Journey Details:", journeyDetails);
  
  // Display station information at the top if available
  // if (startStation && endStation) {
  //   // Create and prepend a header section showing the journey details
  //   const headerSection = document.createElement("div");
  //   headerSection.className = "journey-header";
  //   headerSection.innerHTML = `
  //     <h2>Journey Details</h2>
  //     <p>From: ${startStation}</p>
  //     <p>To: ${endStation}</p>
  //   `;
    
  //   // Insert before the table
  //   document.querySelector("h1").insertAdjacentElement("afterend", headerSection);
  // } else if (journeyDetails) {
  //   // Use the comprehensive journeyDetails object if available
  //   const headerSection = document.createElement("div");
  //   headerSection.className = "journey-header";
  //   headerSection.innerHTML = `
  //     <h2>Journey Details</h2>
  //     <p>From: ${journeyDetails.startStation}</p>
  //     <p>To: ${journeyDetails.endStation}</p>
  //     <p>Date: ${journeyDetails.searchDate}</p>
  //   `;
    
  //   // Insert before the table
  //   document.querySelector("h1").insertAdjacentElement("afterend", headerSection);
  // }

  // If no train data is available
  if (!trainData || trainData.length === 0) {
    document.getElementById("train-results").innerHTML = "<tr><td colspan='7'>No trains available.</td></tr>";
    return;
  }

  trainData.forEach((train) => {
    const row = document.createElement("tr");
    
    // Formatting times (if not in the desired format, add logic for time formatting)
    // const formattedDepartureTime = new Date(train.departureTime).toLocaleTimeString();
    // const formattedArrivalTime = new Date(train.arrivalTime).toLocaleTimeString();
    
    row.innerHTML = `
      <td>${train.departureTime}</td>
      <td>${train.arrivalTime}</td>
      <td>${train.duration}</td>
      <td>${train.endStation}</td>
      <td>${train.trainID}</td>
      <td>${train.type}</td>
      <td><button class="select-train-btn" data-train-id="${train.trainID}">Select</button></td>
    `;

    // Add event listener to select button
    const selectButton = row.querySelector(".select-train-btn");
    selectButton.addEventListener("click", () => {
      // Store selected train in localStorage
      localStorage.setItem("selectedTrain", JSON.stringify(train));
      
      // Also ensure station data is preserved when moving to the next page
      // This can be handled by either using the existing data:
      if (startStation && endStation) {
        // We already have the data in localStorage
      } else if (journeyDetails) {
        // Or use the comprehensive journey details
        localStorage.setItem("startStation", journeyDetails.startStation);
        localStorage.setItem("endStation", journeyDetails.endStation);
      }

      // Redirect to the booking form page
      window.location.href = "../Booking/Booking Form/booking_form.html";
    });

    document.getElementById("train-results").appendChild(row);
  });
});