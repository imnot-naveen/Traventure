async function renderUserChart() {
    try {
        const response = await fetch('http://localhost/Traventure/Server/api/getBookingMonthly.php');
        const json = await response.json();

        if (json.success) {
            const allMonths = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];

            // Initialize counts to 0
            const bookingCounts = Array(12).fill(0);

            // Log the response to debug
            console.log("API Data:", json.data);

            // Fill in counts for available months
            json.data.forEach(entry => {
                const monthIndex = entry.month - 1; // months are 1-based
                console.log(`Month: ${entry.month}, Booking Count: ${entry.booking_count}, Month Index: ${monthIndex}`);
                bookingCounts[monthIndex] = entry.booking_count;
            });

            // Get the chart context
            const ctx = document.getElementById('bookingChart').getContext('2d');

            // Render the Chart.js chart
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: allMonths,
                    datasets: [{
                        label: 'Booking Count',
                        data: bookingCounts,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            ticks: {
                                maxRotation: 45,
                                minRotation: 45
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                precision: 0
                            }
                        }
                    }
                }
            });

        } else {
            console.error("API Error: Data retrieval failed", json);
        }

    } catch (err) {
        console.error("Error loading chart data:", err);
    }
}

renderUserChart();
