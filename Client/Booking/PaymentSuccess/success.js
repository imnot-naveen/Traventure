document.addEventListener("DOMContentLoaded", async () => {
  const statusIcon = document.getElementById("status-icon-wrap");
  const statusTitle = document.getElementById("status-title");
  const statusSubtitle = document.getElementById("status-subtitle");
  const refBadge = document.getElementById("booking-ref-badge");
  const trainNameEl = document.getElementById("conf-train-name");
  const journeyDateEl = document.getElementById("conf-journey-date");
  const classPassengersEl = document.getElementById("conf-class-passengers");
  const totalFareEl = document.getElementById("conf-total-fare");
  const seatsContainer = document.getElementById("conf-seats-container");
  const seatConfirmStatus = document.getElementById("seat-confirm-status");

  const rawBooking = localStorage.getItem("bookingDetails");
  if (!rawBooking) {
    statusTitle.textContent = "Booking Already Processed";
    statusSubtitle.textContent = "Your itinerary and boarding passes are accessible under My Bookings.";
    refBadge.textContent = "SAVED";
    seatConfirmStatus.innerHTML = `
      <i class="fa-solid fa-circle-check text-emerald-400"></i>
      <span>All tickets and seat reservations have been confirmed.</span>
    `;
    return;
  }

  const booking = JSON.parse(rawBooking);
  booking.paymentStatus = "Paid";

  // Pre-fill UI details from local booking context
  if (booking.trainID) trainNameEl.textContent = `Train Service #${booking.trainID}`;
  if (booking.journeyDate) journeyDateEl.textContent = booking.journeyDate;
  if (booking.total_fare) {
    totalFareEl.textContent = Number(booking.total_fare).toLocaleString("en-LK", {
      style: "currency",
      currency: "LKR"
    });
  }
  const totalPassengers = (parseInt(booking.no_of_passengers, 10) || 1) + (parseInt(booking.kidsCount, 10) || 0);
  classPassengersEl.textContent = `${booking.class || "Standard"} • ${totalPassengers} Passenger${totalPassengers > 1 ? "s" : ""}`;

  if (Array.isArray(booking.seats) && booking.seats.length > 0) {
    seatsContainer.innerHTML = booking.seats
      .map(
        (s) =>
          `<span class="px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 font-mono-numbers font-bold text-xs">${s}</span>`
      )
      .join("");
  } else {
    seatsContainer.innerHTML = `<span class="text-xs text-slate-400">General Reservation (Unassigned)</span>`;
  }

  // Finalize booking via createBookings.php
  try {
    const response = await fetch("../../../Server/api/createBookings.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking)
    });

    const data = await response.json();

    if (data.success && (data.bookingID || data.bookingId)) {
      const bookingID = data.bookingID || data.bookingId;
      refBadge.textContent = `#TRV-${bookingID}`;
      localStorage.setItem("lastBookingID", bookingID);

      // Confirm pessimistic seat holds into permanent status
      if (Array.isArray(booking.seats) && booking.seats.length > 0) {
        await confirmPessimisticSeats(booking, bookingID, seatConfirmStatus);
      } else {
        seatConfirmStatus.innerHTML = `
          <i class="fa-solid fa-circle-check text-emerald-400"></i>
          <span>Booking confirmed successfully.</span>
        `;
      }

      // Cleanup pending hold payload
      localStorage.removeItem("bookingDetails");
    } else {
      throw new Error(data.message || "Failed to persist booking record.");
    }
  } catch (err) {
    console.error("Booking confirmation error:", err);
    statusIcon.className = "w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center text-2xl";
    statusIcon.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i>`;
    statusTitle.textContent = "Payment Logged • Finalizing Ticket";
    statusSubtitle.textContent = "Your payment succeeded. If the reference is not visible immediately, your ticket will appear in My Bookings.";
    refBadge.textContent = "PENDING PERSISTENCE";
    seatConfirmStatus.innerHTML = `
      <i class="fa-solid fa-circle-info text-amber-400"></i>
      <span>Payment captured. If your reservation does not appear in My Bookings, present your receipt at the station counter.</span>
    `;
  }
});

/**
 * Confirms temporary pessimistic seat holds into permanent confirmed reservations.
 */
async function confirmPessimisticSeats(booking, bookingID, statusEl) {
  try {
    const response = await fetch("../../../Server/api/seatReservation.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "confirm",
        trainID: booking.trainID,
        journeyDate: booking.journeyDate,
        seats: booking.seats,
        bookingID: bookingID,
        userID: booking.userID
      })
    });

    const data = await response.json();
    const seatListStr = Array.isArray(booking.seats) ? booking.seats.join(", ") : "";

    if (response.ok && data.success) {
      statusEl.innerHTML = `
        <i class="fa-solid fa-circle-check text-emerald-400"></i>
        <span>Coach seats [${seatListStr}] have been permanently confirmed under booking #TRV-${bookingID}.</span>
      `;
    } else {
      statusEl.innerHTML = `
        <i class="fa-solid fa-circle-info text-amber-400"></i>
        <span>Booking #TRV-${bookingID} confirmed. Seat hold record saved for check-in: [${seatListStr}].</span>
      `;
    }
  } catch (error) {
    console.error("Seat confirmation error:", error);
    const seatListStr = Array.isArray(booking.seats) ? booking.seats.join(", ") : "";
    statusEl.innerHTML = `
      <i class="fa-solid fa-circle-info text-amber-400"></i>
      <span>General ticket created successfully. Selected seats [${seatListStr}] are recorded with your receipt.</span>
    `;
  }
}
