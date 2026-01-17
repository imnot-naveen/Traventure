document.addEventListener("DOMContentLoaded", () => {
  const bookingDetails = JSON.parse(localStorage.getItem("bookingDetails"));

  if (!bookingDetails) {
    alert("No booking details found.");
    return;
  }

  const qrData = `BookingID: ${bookingDetails.trainID}-${Date.now()}
Passenger: ${bookingDetails.no_of_passengers}
From: ${bookingDetails.start_station}
To: ${bookingDetails.destination_station}
Date: ${bookingDetails.bookingDate}
Fare: LKR ${bookingDetails.total_fare}`;

  // Generate QR code
  new QRCode(document.getElementById("qrcode"), {
    text: qrData,
    width: 200,
    height: 200
  });

  // Send to server to email QR and save booking
  async function handleBooking() {
    try {
      // Send email with QR
      const emailResponse = await fetch("http://localhost/Traventure/Server/api/send_qr_email.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingDetails, qrText: qrData })
      });
      
      const emailData = await emailResponse.json();
      if (emailResponse.ok) {
        console.log("Email sent:", emailData);
      } else {
        console.error("Email sending failed:", emailData.message);
      }

      // Save booking in database
      const bookingResponse = await fetch("http://localhost/Traventure/Server/api/createBookings.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingDetails)
      });

      const bookingData = await bookingResponse.json();
      if (bookingResponse.ok) {
        console.log("Booking saved:", bookingData);
        alert("Booking confirmed! QR code has been emailed to you.");
      } else {
        console.error("Booking save error:", bookingData.message);
        alert("Booking failed. Please try again.");
      }
    } catch (err) {
      console.error("Error during booking process:", err);
      alert("An error occurred while processing your booking. Please try again.");
    }
  }

  handleBooking();
});
