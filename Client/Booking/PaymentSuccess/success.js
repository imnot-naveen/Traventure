document.addEventListener("DOMContentLoaded", async () => {
    const bookingDetails = JSON.parse(localStorage.getItem("bookingDetails"));
    bookingDetails.paymentStatus = "Paid";

    if (!bookingDetails) {
        alert("Booking details not found.");
        return;
    }
  
    try {
        const response = await fetch("http://localhost/Traventure/Server/api/createBookings.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bookingDetails),
        });
  
        const data = await response.json();
  
        if (data.success) {
            // Store the booking ID in localStorage
            if (data.bookingId) {
                localStorage.setItem("bookingId", data.bookingID);
                console.log("Booking ID saved:", data.bookingID);
            }
            
            alert("Booking successful!");
            localStorage.removeItem("bookingDetails"); 
        } else {
            alert("Booking failed: " + data.message);
            console.error("Booking error:", data);
        }
    } catch (err) {
        console.error("Fetch error:", err);
        alert("Error submitting booking.");
    }
  });