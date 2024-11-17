// Sample Data
const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  values: [10, 20, 15, 25, 30, 40],
};

// Select the canvas element
const canvas = document.getElementById("lineChart2");
const ctx = canvas.getContext("2d");

// Chart Config (responsive dimensions)
const config = {
  padding: 50,
  pointRadius: 5,
};

// Redraw the chart on window resize
function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  drawChart(); // Redraw the chart
}

// Calculate Scaling Factors
function getScalingFactors() {
  const maxValue = Math.max(...data.values);
  const scaleY = (canvas.height - 2 * config.padding) / maxValue;
  const scaleX = (canvas.width - 2 * config.padding) / (data.labels.length - 1);
  return { scaleX, scaleY };
}

// Draw Axes
function drawAxes() {
  ctx.beginPath();
  ctx.moveTo(config.padding, config.padding);
  ctx.lineTo(config.padding, canvas.height - config.padding);
  ctx.lineTo(canvas.width - config.padding, canvas.height - config.padding);
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;
  ctx.stroke();
}

// Draw Grid
function drawGrid() {
  const numGridLines = 5;
  const gridSpacing = (canvas.height - 2 * config.padding) / numGridLines;

  for (let i = 1; i <= numGridLines; i++) {
    ctx.beginPath();
    ctx.moveTo(config.padding, canvas.height - config.padding - i * gridSpacing);
    ctx.lineTo(canvas.width - config.padding, canvas.height - config.padding - i * gridSpacing);
    ctx.strokeStyle = "#ddd";
    ctx.stroke();
  }
}

// Draw Y-axis Numbers
function drawYAxisNumbers() {
  const numGridLines = 5; // Number of grid lines
  const maxValue = Math.max(...data.values); // Maximum value
  const gridSpacing = (canvas.height - 2 * config.padding) / numGridLines; // Space between grid lines
  const stepValue = maxValue / numGridLines; // Value increment per grid line

  for (let i = 0; i <= numGridLines; i++) {
    const y = canvas.height - config.padding - i * gridSpacing;
    const value = Math.round(i * stepValue); // Calculate the corresponding value

    // Draw the Y-axis label
    ctx.font = "12px Arial";
    ctx.fillStyle = "#333";
    ctx.textAlign = "right";
    ctx.fillText(value, config.padding - 10, y + 4); // Adjusted for alignment
  }
}

// Plot Points
function drawPoints(scaleX, scaleY) {
  data.values.forEach((value, index) => {
    const x = config.padding + index * scaleX;
    const y = canvas.height - config.padding - value * scaleY;

    // Draw Point
    ctx.beginPath();
    ctx.arc(x, y, config.pointRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#007bff";
    ctx.fill();

    // Draw Label
    ctx.font = "12px Arial";
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    ctx.fillText(data.labels[index], x, canvas.height - config.padding + 20);
  });
}

// Draw Line
function drawLine(scaleX, scaleY) {
  ctx.beginPath();
  data.values.forEach((value, index) => {
    const x = config.padding + index * scaleX;
    const y = canvas.height - config.padding - value * scaleY;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.strokeStyle = "#007bff";
  ctx.lineWidth = 2;
  ctx.stroke();
}

// Draw Chart
function drawChart() {
  const { scaleX, scaleY } = getScalingFactors();
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
  drawAxes();
  drawGrid();
  drawYAxisNumbers(); // Draw Y-axis numbers
  drawLine(scaleX, scaleY);
  drawPoints(scaleX, scaleY);
}

// Initialize and Add Event Listener
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
