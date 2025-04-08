document.addEventListener("DOMContentLoaded", () => {
    // Retrieve all necessary data from localStorage
    const selectedTrain = JSON.parse(localStorage.getItem("selectedTrain"));
    const startStation = localStorage.getItem("startStation");
    const endStation = localStorage.getItem("endStation");
    
    console.log("Retrieved Train Data:", selectedTrain);
    console.log("Retrieved Start Station:", startStation);
    console.log("Retrieved End Station:", endStation);

    // If no train is selected, redirect back to the train schedule page
    if (!selectedTrain) {
        alert("No train selected. Redirecting to train schedule.");
        window.location.href = "../train schedule/trainschedule.html";
        return;
    }

    // Get station information
    let fromStationId = startStation || selectedTrain.startStationId;
    let toStationId = endStation || selectedTrain.endStationId;
    
    console.log("Using Start Station ID:", fromStationId);
    console.log("Using End Station ID:", toStationId);

    // Display the selected train's details
    const trainDetailsDiv = document.getElementById("train-details");
    trainDetailsDiv.innerHTML = `
        <h3>Selected Train</h3>
        <p><strong>Train No:</strong> ${selectedTrain.trainID}</p>
        <p><strong>Departure:</strong> ${new Date(selectedTrain.departureTime).toLocaleTimeString()}</p>
        <p><strong>Arrival:</strong> ${new Date(selectedTrain.arrivalTime).toLocaleTimeString()}</p>
        <p><strong>Duration:</strong> ${selectedTrain.duration}</p>
        <p><strong>From:</strong> Station ${fromStationId}</p>
        <p><strong>To:</strong> Station ${toStationId}</p>
    `;

    // Get references to form elements
    const passengerCountInput = document.getElementById("passenger-count");
    const classSelect = document.getElementById("class");
    const totalAmountDisplay = document.getElementById("total-amount");

    // Function to calculate the total amount based on the selected class and number of passengers
    async function calculateTotalAmount() {
        const passengerCount = parseInt(passengerCountInput.value) || 1;  // Default to 1 if empty
        const selectedClass = classSelect.value;

        // Ensure we have the station IDs
        if (!fromStationId || !toStationId) {
            console.error("Missing station IDs for fare calculation");
            totalAmountDisplay.textContent = "Error: Missing station information";
            return;
        }

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
                    console.error('Error: No fare details returned.');
                    totalAmountDisplay.textContent = "Error calculating fare";
                }
            } else {
                try {
                    const error = await response.json();
                    console.error("API Error:", error.message || 'Error calculating fare.');
                    totalAmountDisplay.textContent = "Error calculating fare";
                } catch (e) {
                    console.error("Could not parse error response:", e);
                    totalAmountDisplay.textContent = "Error calculating fare";
                }
            }
        } catch (error) {
            console.error("Error:", error);
            totalAmountDisplay.textContent = "Error calculating fare";
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

        // Get the final calculated amount (remove $ sign if needed)
        const finalAmount = totalAmountDisplay.textContent.replace('$', '');

        // Store booking details in localStorage before redirecting to the payment page
        const bookingDetails = {
            selectedTrain,
            fromStationId,
            toStationId,
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