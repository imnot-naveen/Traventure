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
  const trainData = JSON.parse(localStorage.getItem("trainData"));

  if (!trainData || trainData.length === 0) {
      document.getElementById("train-results").innerHTML = "<tr><td colspan='7'>No trains available.</td></tr>";
      return;
  }

  trainData.forEach((train) => {
      const row = document.createElement("tr");
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
          
          // Redirect to the booking form page
          window.location.href = "../Booking/Booking Form/booking_form.html";
      });

      document.getElementById("train-results").appendChild(row);
  });
});


