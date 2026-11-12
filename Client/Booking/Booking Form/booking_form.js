async function getUserIDFromSession() {
  if (window.TRAVENTURE_BOOKING_CTX && window.TRAVENTURE_BOOKING_CTX.userID > 0) {
    return window.TRAVENTURE_BOOKING_CTX.userID;
  }

  try {
    const response = await fetch("../../../Server/api/getUserId.php", {
      method: "GET",
      credentials: "include"
    });
    const data = await response.json();
    if (response.ok && data.success) {
      return data.userID;
    }
    throw new Error(data.message || "Not logged in");
  } catch (error) {
    console.error("Error fetching user ID:", error);
    return null;
  }
}

function resolveTrainContext() {
  const params = new URLSearchParams(window.location.search);
  const storedTrain = JSON.parse(localStorage.getItem("selectedTrain") || "null");

  const trainID = params.get("trainID") || (storedTrain && storedTrain.trainID);
  if (!trainID) {
    window.location.href = "../../Train Schedule Form/scheduleForm.html";
    return null;
  }

  const todayStr = new Date().toISOString().split("T")[0];
  return {
    trainID: trainID,
    trainName: params.get("trainName") || (storedTrain && storedTrain.trainName) || `Train #${trainID}`,
    departureTime: params.get("dep") || (storedTrain && storedTrain.departureTime) || "--:--",
    arrivalTime: params.get("arr") || (storedTrain && storedTrain.arrivalTime) || "--:--",
    duration: params.get("duration") || (storedTrain && storedTrain.duration) || "--",
    fromStationId: params.get("from") || localStorage.getItem("startStation") || (storedTrain && storedTrain.startStationId) || "",
    toStationId: params.get("to") || localStorage.getItem("endStation") || (storedTrain && storedTrain.endStationId) || "",
    fromStationName: params.get("fromName") || localStorage.getItem("startStationName") || "Origin Station",
    toStationName: params.get("toName") || localStorage.getItem("endStationName") || "Destination Station",
    journeyDate: params.get("date") || localStorage.getItem("journeyDate") || todayStr
  };
}

document.addEventListener("DOMContentLoaded", async () => {
  const ctx = resolveTrainContext();
  if (!ctx) return;

  const userID = await getUserIDFromSession();

  const trainDetailsDiv = document.getElementById("train-details");
  trainDetailsDiv.innerHTML = `
    <div class="flex items-center justify-between gap-2 pb-3 border-b border-slate-800">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-800/50 flex items-center justify-center text-cyan-400">
          <i class="fa-solid fa-train"></i>
        </div>
        <div>
          <h3 class="text-base font-extrabold text-white">${ctx.trainName}</h3>
          <span class="text-xs font-mono-numbers text-slate-400">Service #${ctx.trainID}</span>
        </div>
      </div>
      <span class="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-[11px] font-semibold">
        Scheduled
      </span>
    </div>

    <div class="flex items-center justify-between gap-3 pt-1">
      <div>
        <div class="text-xl font-bold font-mono-numbers text-white">${String(ctx.departureTime).slice(0, 5)}</div>
        <div class="text-xs text-slate-400">${ctx.fromStationName}</div>
      </div>

      <div class="flex-1 flex flex-col items-center px-2">
        <span class="text-[11px] font-semibold text-cyan-400 mb-1">${ctx.duration}</span>
        <div class="w-full flex items-center">
          <div class="w-2 h-2 rounded-full bg-cyan-400"></div>
          <div class="h-0.5 flex-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
          <div class="w-2 h-2 rounded-full bg-blue-500"></div>
        </div>
      </div>

      <div class="text-right">
        <div class="text-xl font-bold font-mono-numbers text-white">${String(ctx.arrivalTime).slice(0, 5)}</div>
        <div class="text-xs text-slate-400">${ctx.toStationName}</div>
      </div>
    </div>
  `;

  if (window.SeatSelector) {
    window.SeatSelector.init({
      trainID: ctx.trainID,
      journeyDate: ctx.journeyDate,
      userID: userID
    });
  }

  const passengerCountInput = document.getElementById("passenger-count");
  const kidsCountInput = document.getElementById("kids-count");
  const classSelect = document.getElementById("class");
  const totalAmountDisplay = document.getElementById("total-amount");

  let latestTotalFare = 0;

  async function calculateTotalAmount() {
    const passengerCount = passengerCountInput.value === "" ? 1 : parseInt(passengerCountInput.value, 10);
    const kidsCount = kidsCountInput.value === "" ? 0 : parseInt(kidsCountInput.value, 10);

    if (passengerCount < 1 || kidsCount < 0) {
      totalAmountDisplay.textContent = "Invalid count";
      latestTotalFare = 0;
      return;
    }

    if (!ctx.fromStationId || !ctx.toStationId) {
      totalAmountDisplay.textContent = "LKR 0.00";
      latestTotalFare = 0;
      return;
    }

    try {
      const response = await fetch(
        `../../../Server/api/calculateFare.php?from=${encodeURIComponent(ctx.fromStationId)}&to=${encodeURIComponent(ctx.toStationId)}&class=${encodeURIComponent(classSelect.value)}`,
        { credentials: "include" }
      );
      const data = await response.json();

      if (response.ok && data && "total_fare" in data) {
        latestTotalFare = Number(data.total_fare) * (passengerCount + kidsCount * 0.5);
        totalAmountDisplay.textContent = latestTotalFare.toLocaleString("en-LK", {
          style: "currency",
          currency: "LKR"
        });
      } else {
        totalAmountDisplay.textContent = "Fare unavailable";
      }
    } catch (error) {
      console.error("Fare calculation error:", error);
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

    const passengerCount = parseInt(passengerCountInput.value, 10);
    if (!passengerCount || passengerCount <= 0) {
      alert("Please enter a valid passenger count.");
      return;
    }

    const heldSeats = window.SeatSelector ? window.SeatSelector.getHeldSeats() : [];
    const kidsCount = parseInt(kidsCountInput.value, 10) || 0;
    if (heldSeats.length !== passengerCount + kidsCount) {
      alert("Please lock your selected seats first before proceeding to payment.");
      return;
    }

    const paymentOption = document.getElementById("payment-option").value;
    const finalAmountInNum = latestTotalFare > 0
      ? latestTotalFare
      : parseFloat(totalAmountDisplay.textContent.replace(/[^\d.]/g, "")) || 0;

    const bookingDetails = {
      userID: userID || (await getUserIDFromSession()),
      trainID: ctx.trainID,
      journeyDate: window.SeatSelector ? window.SeatSelector.getJourneyDate() : ctx.journeyDate,
      seats: heldSeats,
      start_station: ctx.fromStationId,
      destination_station: ctx.toStationId,
      class: classSelect.value,
      no_of_passengers: passengerCount,
      kidsCount: kidsCount,
      total_fare: finalAmountInNum,
      paymentMethod: paymentOption,
      paymentStatus: false,
      bookingDate: new Date().toISOString().split("T")[0]
    };

    localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));

    if (paymentOption === "Card") {
      const stripe = Stripe("pk_test_51RCy68QwgaoFWhBRVwTGwX9QkMDGiSKTNE1QGHYnM4YqSSTeIgdIlCTw34rqwYcIJxKT1jfXr6fkl5SM3ABac2mY00iwkPeUmO");
      try {
        const response = await fetch("../../../Server/api/create_checkout_session.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ amount: finalAmountInNum })
        });
        const data = await response.json();

        if (data.id) {
          stripe.redirectToCheckout({ sessionId: data.id });
        } else {
          alert("Payment session creation failed. Try again.");
          console.error("Stripe session creation failed", data);
        }
      } catch (error) {
        console.error("Stripe Checkout error:", error);
        alert("Something went wrong with the payment.");
      }
    }
  });
});
