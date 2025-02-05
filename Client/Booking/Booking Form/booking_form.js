document.getElementById("bookingForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const no_of_passengers = document.getElementById("no_of_passengers").value.trim();
    const payment_method = document.getElementById("payment_method").value;

    if (!no_of_passengers || !payment_method) {
        document.getElementById("response").innerHTML = "<p style='color: red;'>All fields are required!</p>";
        return;
    }

    const ticketPrice = 1000; // Example price per passenger
    const totalAmount = parseInt(no_of_passengers) * ticketPrice;

    const apiUrl = `http://localhost/Traventure/Server/api/createBooking.php?user_id=2`;

    const requestBody = {
        no_of_passengers: parseInt(no_of_passengers),
        payment_method: payment_method,
        amount: totalAmount
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById("response").innerHTML = `<p style='color: green;'>Success: ${data.message}</p>`;

            // Redirect based on payment method
            if (payment_method === "card") {
                window.location.href = `../Gateway/Gateway.html?amount=${totalAmount}&booking_id=${data.booking_id}`;
            } else if (payment_method === "cash") {
                window.location.href = `qr.html?amount=${totalAmount}&booking_id=${data.booking_id}`;
            }

        } else {
            document.getElementById("response").innerHTML = `<p style='color: red;'>Error: ${data.message}</p>`;
        }
    } catch (error) {
        document.getElementById("response").innerHTML = `<p style='color: red;'>Request failed. Check console.</p>`;
        console.error("Fetch error:", error);
    }
});
