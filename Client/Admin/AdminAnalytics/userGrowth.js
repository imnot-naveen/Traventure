  async function renderUserChart() {
        try {
            const response = await fetch('http://localhost/Traventure/Server/api/getUserGrowthByMonth.php');
            const json = await response.json();

            const allMonths = [
                "Jan", "Feb", "March", "April", "May", "June",
                "July", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];

            // Initialize counts to 0
            const userCounts = Array(12).fill(0);

            // Fill in counts for available months
            json.data.forEach(entry => {
                const monthIndex = entry.month - 1; // months are 1-based
                userCounts[monthIndex] = entry.user_count;
            });

            const ctx = document.getElementById('userChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: allMonths,
                    datasets: [{
                        label: 'User Count',
                        data: userCounts,
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

        } catch (err) {
            console.error("Error loading chart data:", err);
        }
    }

    renderUserChart();

