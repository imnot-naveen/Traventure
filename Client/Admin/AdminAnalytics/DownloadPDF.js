document.addEventListener('DOMContentLoaded', function() {
  const downloadButton = document.getElementById('downloadReport');
  
  if (downloadButton) {
    downloadButton.addEventListener('click', generateAndDownloadReport);
  }
});

async function generateAndDownloadReport() {
  try {
    // Display loading indicator
    showLoadingIndicator();
    
    // Fetch data from all three APIs in parallel
    const [tripData, revenueData, bookingData] = await Promise.all([
      fetchReportData('http://localhost/Traventure/Server/api/getlastmonthTripCount.php'),
      fetchReportData('http://localhost/Traventure/Server/api/revenuelastmonth.php'),
      fetchReportData('http://localhost/Traventure/Server/api/getBookingCountByMonth.php')
    ]);
    
    // Capture the canvas charts as images
    const chartImages = await captureChartImages();
    
    // Combine all data
    const combinedData = {
      bookingDetails: bookingData.bookings || [],
      chartImages: chartImages
    };
    
    // Generate report HTML
    const reportHTML = generateReportHTML(combinedData);
    
    // Create a hidden iframe to print from
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    // Write report HTML to iframe
    iframe.contentDocument.write(reportHTML);
    iframe.contentDocument.close();
    
    // Wait for content to load
    setTimeout(() => {
      // Hide loading indicator
      hideLoadingIndicator();
      
      // Print the iframe content
      iframe.contentWindow.print();
      
      // Remove iframe after printing
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 100);
    }, 1000);
  } catch (error) {
    console.error('Error generating report:', error);
    hideLoadingIndicator();
    alert('Failed to generate report. Please try again later.');
  }
}

function fetchReportData(apiUrl) {
  // This function makes an AJAX request to your server
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', apiUrl, true);
    
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } catch (e) {
          reject(new Error(`Invalid response from ${apiUrl}`));
        }
      } else {
        reject(new Error(`Failed to fetch data from ${apiUrl}`));
      }
    };
    
    xhr.onerror = function() {
      reject(new Error(`Network error occurred when fetching from ${apiUrl}`));
    };
    
    xhr.send();
  });
}

function captureChartImages() {
  return new Promise((resolve) => {
    // Get the canvas elements
    const bookingChart = document.getElementById('bookingChart');
    const userChart = document.getElementById('userChart');
    
    // Convert canvases to data URLs
    const bookingChartImage = bookingChart ? bookingChart.toDataURL('image/png') : null;
    const userChartImage = userChart ? userChart.toDataURL('image/png') : null;
    
    resolve({
      bookingChart: bookingChartImage,
      userChart: userChartImage
    });
  });
}

function showLoadingIndicator() {
  // Create loading indicator if doesn't exist
  if (!document.getElementById('reportLoadingIndicator')) {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'reportLoadingIndicator';
    loadingDiv.style.position = 'fixed';
    loadingDiv.style.top = '0';
    loadingDiv.style.left = '0';
    loadingDiv.style.width = '100%';
    loadingDiv.style.height = '100%';
    loadingDiv.style.backgroundColor = 'rgba(0,0,0,0.5)';
    loadingDiv.style.display = 'flex';
    loadingDiv.style.justifyContent = 'center';
    loadingDiv.style.alignItems = 'center';
    loadingDiv.style.zIndex = '9999';
    
    const loadingContent = document.createElement('div');
    loadingContent.style.backgroundColor = 'white';
    loadingContent.style.padding = '20px';
    loadingContent.style.borderRadius = '5px';
    loadingContent.style.textAlign = 'center';
    
    loadingContent.innerHTML = `
      <p style="margin: 0 0 10px 0; font-weight: bold;">Generating Report</p>
      <div class="loading-spinner" style="border: 4px solid #f3f3f3; 
                                        border-top: 4px solid #3498db; 
                                        border-radius: 50%;
                                        width: 30px;
                                        height: 30px;
                                        margin: 0 auto;
                                        animation: spin 2s linear infinite;"></div>
    `;
    
    // Add keyframe animation for spinner
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    
    loadingDiv.appendChild(loadingContent);
    document.body.appendChild(loadingDiv);
  } else {
    document.getElementById('reportLoadingIndicator').style.display = 'flex';
  }
}

function hideLoadingIndicator() {
  const loadingIndicator = document.getElementById('reportLoadingIndicator');
  if (loadingIndicator) {
    loadingIndicator.style.display = 'none';
  }
}

function generateReportHTML(data) {
  // Get current date for filename
  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const monthName = lastMonth.toLocaleString('default', { month: 'long' });
  const year = lastMonth.getFullYear();
  

  
  // Prepare charts section HTML
  let chartsHTML = '';
  if (data.chartImages && (data.chartImages.bookingChart || data.chartImages.userChart)) {
    chartsHTML = `
      <div class="charts-section">
        <div class="charts-title">Analytics Charts</div>
        <div class="charts-grid">
          ${data.chartImages.bookingChart ? 
            `<div class="chart-container">
               <h3>Yearly Booking Trend</h3>
               <img src="${data.chartImages.bookingChart}" alt="Booking Trend Chart" style="width: 100%; max-width: 600px;">
             </div>` : ''}
          
          ${data.chartImages.userChart ? 
            `<div class="chart-container">
               <h3>Yearly User Growth</h3>
               <img src="${data.chartImages.userChart}" alt="User Growth Chart" style="width: 100%; max-width: 600px;">
             </div>` : ''}
        </div>
      </div>
    `;
  }
  
  // Create complete HTML document with CSS for printing
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Monthly Report - ${data.reportDate || monthName + ' ' + year}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .report-header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 10px;
          border-bottom: 2px solid #ddd;
        }
        .report-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .report-date {
          font-size: 16px;
          color: #666;
        }
        .summary-section {
          margin-bottom: 30px;
          padding: 15px;
          background-color: #f5f5f5;
          border-radius: 5px;
        }
        .summary-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
        .summary-item {
          padding: 10px;
          background-color: white;
          border-radius: 5px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .summary-label {
          font-size: 14px;
          color: #666;
        }
        .summary-value {
          font-size: 20px;
          font-weight: bold;
          color: #333;
        }
        .details-section, .charts-section {
          margin-bottom: 30px;
        }
        .details-title, .charts-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
        }
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 20px;
        }
        @media (min-width: 768px) {
          .charts-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .chart-container {
          text-align: center;
          background-color: white;
          padding: 15px;
          border-radius: 5px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .chart-container h3 {
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 16px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f0f0f0;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .report-footer {
          margin-top: 30px;
          padding-top: 10px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #666;
          text-align: center;
        }
        @media print {
          body {
            padding: 0;
          }
          .no-print {
            display: none;
          }
          .page-break {
            page-break-before: always;
          }
        }
      </style>
    </head>
    <body>
      <div class="report-header">
        <div class="report-title">Monthly Analytics Report</div>
        <div class="report-date">${data.reportDate || monthName + ' ' + year}</div>
      </div>
      
      <div class="summary-section">
        <div class="summary-title">Monthly Summary</div>
        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-label">Total Bookings</div>
            <div class="summary-value">${data.booking_count || '0'}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">New Users</div>
            <div class="summary-value">${data.userCount || '0'}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Total Trips</div>
            <div class="summary-value">${data.tripCount || '0'}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Total Revenue</div>
            <div class="summary-value">$${data.revenue || '0.00'}</div>
          </div>
        </div>
      </div>
      
      ${chartsHTML}
      
      <div class="page-break"></div>
      
      <div class="report-footer">
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
        <p>This is an automatically generated report for internal use only.</p>
      </div>
      
      <div class="no-print">
        <button onclick="window.print()">Print Report</button>
        <button onclick="window.close()">Close</button>
      </div>
    </body>
    </html>
  `;
}