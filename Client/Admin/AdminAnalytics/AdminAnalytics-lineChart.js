const canvas = document.getElementById("lineChart");
const ctx = canvas.getContext("2d");

const config = {
  padding: 50,
  pointRadius: 5,
};

let data = {
  labels: [],
  values: [],
};

// Fetch data from PHP API
async function fetchUserGrowthData() {
    try {
    const response = await fetch("http://localhost/Traventure/Server/api/getUserGrowthByMonth.php");
    const result = await response.json();
    console.log("Fetched data:", result);


    if (result.success && result.data) {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
      data.labels = result.data.map(entry => {
        const monthIndex = parseInt(entry.month.split('-')[1], 10) - 1;
        return monthNames[monthIndex];
      });
    
      data.values = result.data.map(entry => Number(entry.user_count));
    
      resizeCanvas(); // Draw chart
    }else {
      console.error("No data found");
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}



function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  drawChart();
}

function getScalingFactors() {
  const maxValue = Math.max(...data.values);
  const scaleY = (canvas.height - 2 * config.padding) / maxValue;
  const scaleX = (canvas.width - 2 * config.padding) / (data.labels.length - 1);
  return { scaleX, scaleY };
}

function drawAxes() {
  ctx.beginPath();
  ctx.moveTo(config.padding, config.padding);
  ctx.lineTo(config.padding, canvas.height - config.padding);
  ctx.lineTo(canvas.width - config.padding, canvas.height - config.padding);
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;
  ctx.stroke();
}

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

function drawYAxisNumbers() {
  const numGridLines = 5;
  const maxValue = Math.max(...data.values);
  const gridSpacing = (canvas.height - 2 * config.padding) / numGridLines;
  const stepValue = maxValue / numGridLines;

  for (let i = 0; i <= numGridLines; i++) {
    const y = canvas.height - config.padding - i * gridSpacing;
    const value = (i * stepValue).toFixed(1);

    ctx.font = "12px Arial";
    ctx.fillStyle = "#333";
    ctx.textAlign = "right";
    ctx.fillText(value, config.padding - 10, y + 4);
  }
}

function drawPoints(scaleX, scaleY) {
  data.values.forEach((value, index) => {
    const x = config.padding + index * scaleX;
    const y = canvas.height - config.padding - value * scaleY;

    ctx.beginPath();
    ctx.arc(x, y, config.pointRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#007bff";
    ctx.fill();

    ctx.font = "12px Arial";
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    ctx.fillText(data.labels[index], x, canvas.height - config.padding + 20);
  });
}

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

function drawChart() {
  const { scaleX, scaleY } = getScalingFactors();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawAxes();
  drawGrid();
  drawYAxisNumbers();
  drawLine(scaleX, scaleY);
  drawPoints(scaleX, scaleY);
}

// Event Listener
window.addEventListener("resize", resizeCanvas);

  // Start it off
fetchUserGrowthData();