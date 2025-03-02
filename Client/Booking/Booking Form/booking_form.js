document.addEventListener("DOMContentLoaded", () => {
    // Retrieve the selected train data from localStorage
    const selectedTrain = JSON.parse(localStorage.getItem("selectedTrain"));

    // If no train is selected, redirect back to the train schedule page
    if (!selectedTrain) {
        window.location.href = "../TrainSchedule/trainschedule.html";
        return;
    }

    // Display the selected train's details
    const trainDetailsDiv = document.getElementById("train-details");
    trainDetailsDiv.innerHTML = `
        <h3>Selected Train</h3>
        <p><strong>Train No:</strong> ${selectedTrain.trainID}</p>
        <p><strong>Departure:</strong> ${selectedTrain.departureTime}</p>
        <p><strong>Arrival:</strong> ${selectedTrain.arrivalTime}</p>
        <p><strong>Duration:</strong> ${selectedTrain.duration}</p>
        <p><strong>Ends At:</strong> ${selectedTrain.endStation}</p>
    `;

    // Get references to form elements
    const passengerCountInput = document.getElementById("passenger-count");
    const classSelect = document.getElementById("class");
    const totalAmountDisplay = document.getElementById("total-amount");

    // Function to calculate the total amount based on the selected class and number of passengers
    async function calculateTotalAmount() {
        const passengerCount = parseInt(passengerCountInput.value) || 1;  // Default to 1 if empty
        const selectedClass = classSelect.value;

        const fromStationId = selectedTrain.startStationId;  // Assuming `selectedTrain` has startStationId
        const toStationId = selectedTrain.endStationId;      // Assuming `selectedTrain` has endStationId

        try {
            // Make the API call to the PHP backend to calculate fare
            const response = await fetch(`http://localhost/Traventure/Server/api/calculateFare.php?from=${fromStationId}&to=${toStationId}&class=${selectedClass}`);
            
            if (response.ok) {
                const data = await response.json();

                // Handle the data returned by the API
                if (data.total_fare) {
                    const totalFare = data.total_fare * passengerCount; // Multiply by passenger count
                    totalAmountDisplay.textContent = `$${totalFare.toFixed(2)}`;  // Display total fare
                } else {
                    alert('Error: No fare details returned.');
                }
            } else {
                const error = await response.json();
                alert(error.message || 'Error calculating fare.');
            }
        } catch (error) {
            alert("An error occurred while calculating the fare.");
            console.error("Error:", error);
        }
    }

    // Recalculate the total amount whenever the passenger count or class selection changes
    passengerCountInput.addEventListener("input", calculateTotalAmount);
    classSelect.addEventListener("change", calculateTotalAmount);

    // Initial calculation
    calculateTotalAmount();

    // Handle form submission
    const bookingForm = document.getElementById("booking-form");
    bookingForm.addEventListener("submit", async (event) => {
        event.preventDefault();  // Prevent form from submitting

        const paymentOption = document.getElementById("payment-option").value;

        // Get the final calculated amount
        const finalAmount = totalAmountDisplay.textContent;

        // Store booking details in localStorage before redirecting to the payment page
        const bookingDetails = {
            selectedTrain,
            passengerCount: parseInt(passengerCountInput.value),
            selectedClass: classSelect.value,
            paymentOption,
            totalAmount: finalAmount
        };

        localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));

        // Redirect based on selected payment option
        if (paymentOption === "card") {
            window.location.href = "../Payment/CardPayment/cardpayment.html";
        } else if (paymentOption === "cash") {
            window.location.href = "../Payment/CashPayment/cashpayment.html";
        }
    });
});
