document.addEventListener("DOMContentLoaded", () => {
    const selectedTrain = JSON.parse(localStorage.getItem("selectedTrain"));
    const startStation = localStorage.getItem("startStation");
    const endStation = localStorage.getItem("endStation");

    console.log("Retrieved Train Data:", selectedTrain);
    console.log("Retrieved Start Station:", startStation);
    console.log("Retrieved End Station:", endStation);

    if (!selectedTrain) {
        alert("No train selected. Redirecting to train schedule.");
        window.location.href = "../train schedule/trainschedule.html";
        return;
    }

    let fromStationId = startStation || selectedTrain.startStationId;
    let toStationId = endStation || selectedTrain.endStationId;

    console.log("Using Start Station ID:", fromStationId);
    console.log("Using End Station ID:", toStationId);

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

    const passengerCountInput = document.getElementById("passenger-count");
    const kidsCountInput = document.getElementById("kids-count");
    const classSelect = document.getElementById("class");
    const totalAmountDisplay = document.getElementById("total-amount");

    async function calculateTotalAmount() {
        const passengerCount = passengerCountInput.value === "" ? 1 : parseInt(passengerCountInput.value);
        const kidsCount = kidsCountInput.value === "" ? 0 : parseInt(kidsCountInput.value);

        if (passengerCount < 0 || kidsCount < 0) {
            totalAmountDisplay.textContent = "Passenger counts cannot be negative.";
            return;
        }

        const selectedClass = classSelect.value;

        if (!fromStationId || !toStationId) {
            console.error("Missing station IDs for fare calculation");
            totalAmountDisplay.textContent = "Error: Missing station information";
            return;
        }

        try {
            const response = await fetch(`http://localhost/Traventure/Server/api/calculateFare.php?from=${fromStationId}&to=${toStationId}&class=${selectedClass}`);
            
            if (response.ok) {
                const data = await response.json();

                if (data && "total_fare" in data) {
                    const totalFare = data.total_fare * (passengerCount + kidsCount * 0.5);
                    totalAmountDisplay.textContent = totalFare.toLocaleString('en-LK', {
                        style: 'currency',
                        currency: 'LKR'
                    });
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

    passengerCountInput.addEventListener("input", calculateTotalAmount);
    classSelect.addEventListener("change", calculateTotalAmount);
    kidsCountInput.addEventListener("input", calculateTotalAmount);
    calculateTotalAmount();

    const bookingForm = document.getElementById("booking-form");
    bookingForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const passengerCount = parseInt(passengerCountInput.value);
        if (!passengerCount || passengerCount <= 0) {
            alert("Please enter a valid passenger count.");
            return;
        }

        const paymentOption = document.getElementById("payment-option").value;
        const finalAmount = totalAmountDisplay.textContent.replace(/[^\d.]/g, '');
        const finalAmountInNum = parseFloat(finalAmount);
        const kidsCount = parseInt(kidsCountInput.value) || 0;

        const bookingDetails = {
            userID: localStorage.getItem("userID"),
            trainID: selectedTrain.trainID,
            start_station: fromStationId,
            destination_station: toStationId,
            class: classSelect.value,
            no_of_passengers: passengerCount, 
            kidsCount: kidsCount,
            total_fare: finalAmountInNum,
            paymentMethod: paymentOption,
            paymentStatus: paymentOption === "cash" ? "Pending" : "Processing",
            bookingDate: new Date().toISOString().split("T")[0]
        };

        localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));

        if (paymentOption === "card") {
            window.location.href = "../Payment/CardPayment/cardpayment.html";
        } else if (paymentOption === "cash") {
            window.location.href = "../Payment/CashPayment/cashpayment.html";
        }
    });
});
