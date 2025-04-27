document.addEventListener("DOMContentLoaded", async () => {

  const bookingDetails = JSON.parse(localStorage.getItem("bookingDetails"));
  if (!bookingDetails) {
    alert("Booking details not found.");
    return;
  }
  try {
    const response = await fetch(
      "http://localhost/Traventure/Server/api/createBookings.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingDetails),
      }
    );
    const data = await response.json();
    if (data.success) {
      // Store the bookingID in localStorage or session for future use
      const bookingID = data.bookingID;
      localStorage.setItem("lastBookingID", bookingID);

      alert(`✅ Booking successful! Your booking ID is: ${bookingID}`);

      // Optionally redirect to a booking confirmation page
      window.location.href = `booking-confirmation.html?id=${bookingID}`;

      // Clear the booking details from localStorage
      localStorage.removeItem("bookingDetails");
    } else {
      alert("❌ Booking failed: " + data.message);
      console.error("Booking error:", data);
    }
  } catch (err) {
    console.error("Fetch error:", err);
    alert("Error submitting booking.");
  }
  //dimuthu
    // const bookingDetailsString = localStorage.getItem("bookingDetails");
    // const tripDataString = localStorage.getItem("tripData");

    // if (!bookingDetailsString) {
    //     alert("Booking details not found.");
    //     return;
    // }

    // const bookingDetails = JSON.parse(bookingDetailsString);
    // const tripData = tripDataString ? JSON.parse(tripDataString) : {};

    // bookingDetails.paymentStatus = "Paid"; // ✅ Now safe to access

    // try {
    //     const response = await fetch("http://localhost/Traventure/Server/api/createBookings.php", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(bookingDetails),
    //     });

    //     const data = await response.json();

    //     if (data.success) {
    //         if (data.bookingId) {
    //             console.log(data);
    //             console.log(data.bookingID);
    //             localStorage.setItem("bookingId", data.bookingID);
    //             console.log("Booking ID saved:", data.bookingID);
    //         }

    //         alert("Booking successful!");
    //         localStorage.removeItem("bookingDetails");
    //     } else {
    //         alert("Booking failed: " + data.message);
    //         console.error("Booking error:", data);
    //     }

    //     if (tripData.clicked) {
    //         document.getElementById("redirect-btn").textContent = "Go back to Itinerary";
    //         document.getElementById("redirect-btn").href = "../../view itinerary/viewitinerary.html";
    //     } else {
    //         document.getElementById("redirect-btn").textContent = "Go back to Home";
    //         document.getElementById("redirect-btn").href = "../../Home/home.html";
    //     }
    // } catch (err) {
    //     console.error("Fetch error:", err);
    //     alert("Error submitting booking.");
    // }
//dimuthu
});
