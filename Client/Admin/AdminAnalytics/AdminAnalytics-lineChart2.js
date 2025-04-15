// // Select the canvas1 element
// const canvas1 = document.getElementById("lineChart2");
// const ctx1 = canvas1.getContext("2d");

// // Chart config1 (responsive dimensions)
// const config1 = {
//   padding: 50,
//   pointRadius: 5,
// };

// // Initialize the empty data1 object
// let data1 = {
//   labels: [],
//   values: [],
// };

// // Redraw the chart on window resize
// function resizecanvas1() {
//   canvas1.width = canvas1.offsetWidth;
//   canvas1.height = canvas1.offsetHeight;
//   drawChart(); // Redraw the chart
// }

// // Calculate Scaling Factors
// function getScalingFactors() {
//   const maxValue = Math.max(...data1.values);
//   const scaleY = (canvas1.height - 2 * config1.padding) / maxValue;
//   const scaleX = (canvas1.width - 2 * config1.padding) / (data1.labels.length - 1);
//   return { scaleX, scaleY };
// }

// // Draw Axes
// function drawAxes() {
//   ctx1.beginPath();
//   ctx1.moveTo(config1.padding, config1.padding);
//   ctx1.lineTo(config1.padding, canvas1.height - config1.padding);
//   ctx1.lineTo(canvas1.width - config1.padding, canvas1.height - config1.padding);
//   ctx1.strokeStyle = "#333";
//   ctx1.lineWidth = 1;
//   ctx1.stroke();
// }

// // Draw Grid
// function drawGrid() {
//   const numGridLines = 5;
//   const gridSpacing = (canvas1.height - 2 * config1.padding) / numGridLines;

//   for (let i = 1; i <= numGridLines; i++) {
//     ctx1.beginPath();
//     ctx1.moveTo(config1.padding, canvas1.height - config1.padding - i * gridSpacing);
//     ctx1.lineTo(canvas1.width - config1.padding, canvas1.height - config1.padding - i * gridSpacing);
//     ctx1.strokeStyle = "#ddd";
//     ctx1.stroke();
//   }
// }

// // Draw Y-axis Numbers
// function drawYAxisNumbers() {
//   const numGridLines = 5; // Number of grid lines
//   const maxValue = Math.max(...data1.values); // Maximum value
//   const gridSpacing = (canvas1.height - 2 * config1.padding) / numGridLines; // Space between grid lines
//   const stepValue = maxValue / numGridLines; // Value increment per grid line

//   for (let i = 0; i <= numGridLines; i++) {
//     const y = canvas1.height - config1.padding - i * gridSpacing;
//     const value = Math.round(i * stepValue); // Calculate the corresponding value

//     // Draw the Y-axis label
//     ctx1.font = "12px Arial";
//     ctx1.fillStyle = "#333";
//     ctx1.textAlign = "right";
//     ctx1.fillText(value, config1.padding - 10, y + 4); // Adjusted for alignment
//   }
// }

// // Plot Points
// function drawPoints(scaleX, scaleY) {
//   data1.values.forEach((value, index) => {
//     const x = config1.padding + index * scaleX;
//     const y = canvas1.height - config1.padding - value * scaleY;

//     // Draw Point
//     ctx1.beginPath();
//     ctx1.arc(x, y, config1.pointRadius, 0, Math.PI * 2);
//     ctx1.fillStyle = "#007bff";
//     ctx1.fill();

//     // Draw Label
//     ctx1.font = "12px Arial";
//     ctx1.fillStyle = "#333";
//     ctx1.textAlign = "center";
//     ctx1.fillText(data1.labels[index], x, canvas1.height - config1.padding + 20);
//   });
// }

// // Draw Line
// function drawLine(scaleX, scaleY) {
//   ctx1.beginPath();
//   data1.values.forEach((value, index) => {
//     const x = config1.padding + index * scaleX;
//     const y = canvas1.height - config1.padding - value * scaleY;

//     if (index === 0) {
//       ctx1.moveTo(x, y);
//     } else {
//       ctx1.lineTo(x, y);
//     }
//   });

//   ctx1.strokeStyle = "#007bff";
//   ctx1.lineWidth = 2;
//   ctx1.stroke();
// }

// // Draw Chart
// function drawChart() {
//   const { scaleX, scaleY } = getScalingFactors();
//   ctx1.clearRect(0, 0, canvas1.width, canvas1.height); // Clear canvas1
//   drawAxes();
//   drawGrid();
//   drawYAxisNumbers(); // Draw Y-axis numbers
//   drawLine(scaleX, scaleY);
//   drawPoints(scaleX, scaleY);
// }

// // Fetch data1 from the API
// function fetchdata1() {
//   fetch("http://localhost/Traventure/Server/api/getBookingCountByMonth.php") // Replace with your actual API URL
//     .then((response) => response.json())
//     .then((data1FromAPI) => {
//       data1 = data1FromAPI; // Update the chart data1
//       drawChart(); // Redraw the chart with the updated data1
//     })
//     .catch((error) => {
//       console.error("Error fetching booking data1:", error);
//     });
// }

// // Initialize and Add Event Listener
// resizecanvas1();
// window.addEventListener("resize", resizecanvas1);

// // Call the fetchdata1 function when the page loads to populate the chart
// fetchdata1();
