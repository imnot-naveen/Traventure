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

    // Prices for different classes
    const classPrices = {
        firstClass: 100,  // Example price for First Class
        secondClass: 60,  // Example price for Second Class
        thirdClass: 30    // Example price for Third Class
    };

    // Get references to form elements
    const passengerCountInput = document.getElementById("passenger-count");
    const classSelect = document.getElementById("class");
    const totalAmountDisplay = document.getElementById("total-amount");

    // Function to calculate the total amount based on the selected class and number of passengers
    function calculateTotalAmount() {
        const passengerCount = parseInt(passengerCountInput.value) || 1;  // Default to 1 if empty
        const selectedClass = classSelect.value;
        const pricePerPassenger = classPrices[selectedClass];

        const totalAmount = pricePerPassenger * passengerCount;
        totalAmountDisplay.textContent = `$${totalAmount}`;
    }

    // Recalculate the total amount whenever the passenger count or class selection changes
    passengerCountInput.addEventListener("input", calculateTotalAmount);
    classSelect.addEventListener("change", calculateTotalAmount);

    // Initial calculation
    calculateTotalAmount();

    // Handle form submission
    const bookingForm = document.getElementById("booking-form");
    bookingForm.addEventListener("submit", (event) => {
        event.preventDefault();  // Prevent form from submitting

        // Get selected payment option
        const paymentOption = document.getElementById("payment-option").value;

        // Store booking details in localStorage before redirecting to the payment page
        const bookingDetails = {
            selectedTrain,
            passengerCount: parseInt(passengerCountInput.value),
            selectedClass: classSelect.value,
            paymentOption,
            totalAmount: totalAmountDisplay.textContent
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
