(function () {
  const API_URL = "../../../Server/api/seatReservation.php";
  const HOLD_DURATION_SECONDS = 300; // 5 minutes

  const state = {
    trainID: 0,
    journeyDate: "",
    userID: 0,
    coachClass: "1st Class",
    seatsData: [],
    selectedSeats: [],
    activeHold: null, // { seats: string[], expiresAt: string }
    holdTimerInterval: null
  };

  // DOM Elements
  const els = {};

  function cacheDom() {
    els.coachGrid = document.getElementById("coach-seat-grid");
    els.coachLoading = document.getElementById("coach-loading");
    els.coachClassBadge = document.getElementById("coach-class-badge");
    els.journeyDateInput = document.getElementById("journey-date-input");
    els.refreshBtn = document.getElementById("refresh-seats-btn");
    els.lockBtn = document.getElementById("lock-seats-btn");
    els.proceedBtn = document.getElementById("proceed-payment-btn");
    els.selectedSummary = document.getElementById("selected-seats-summary");
    els.requirementHint = document.getElementById("seat-requirement-hint");
    els.passengerCount = document.getElementById("passenger-count");
    els.kidsCount = document.getElementById("kids-count");
    els.classSelect = document.getElementById("class");

    els.holdBanner = document.getElementById("hold-countdown-banner");
    els.holdTimerDisplay = document.getElementById("hold-timer-display");
    els.holdSeatsBadges = document.getElementById("hold-seats-badges");
    els.holdProgressBar = document.getElementById("hold-progress-bar");

    els.alertBanner = document.getElementById("seat-alert-banner");
    els.alertTitle = document.getElementById("seat-alert-title");
    els.alertMessage = document.getElementById("seat-alert-message");
    els.alertClose = document.getElementById("seat-alert-close");
  }

  function getRequiredSeatCount() {
    const adults = Math.max(1, parseInt(els.passengerCount?.value || "1", 10) || 1);
    const kids = Math.max(0, parseInt(els.kidsCount?.value || "0", 10) || 0);
    return adults + kids;
  }

  function mapClassLabel(classValue) {
    switch (classValue) {
      case "first":
        return "1st Class Observation Car";
      case "second":
        return "2nd Class Reserved";
      default:
        return "3rd Class Standard";
    }
  }

  function showAlert(title, message) {
    if (!els.alertBanner) return;
    els.alertTitle.textContent = title;
    els.alertMessage.textContent = message;
    els.alertBanner.classList.remove("hidden");
  }

  function hideAlert() {
    if (els.alertBanner) {
      els.alertBanner.classList.add("hidden");
    }
  }

  function showHoldBanner(seats) {
    if (!els.holdBanner) return;
    els.holdSeatsBadges.innerHTML = seats
      .map(
        (seat) =>
          `<span class="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 text-xs font-mono-numbers font-bold">${seat}</span>`
      )
      .join("");
    els.holdBanner.classList.remove("hidden");
  }

  function hideHoldBanner() {
    if (els.holdBanner) {
      els.holdBanner.classList.add("hidden");
    }
  }

  function formatMMSS(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  async function loadSeatMap() {
    if (!state.trainID || !state.journeyDate) return;

    els.coachLoading.classList.remove("hidden");
    els.coachGrid.classList.add("hidden");

    try {
      const url = `${API_URL}?trainID=${encodeURIComponent(state.trainID)}&date=${encodeURIComponent(state.journeyDate)}`;
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Could not load seat availability.");
      }

      state.seatsData = data.seats || [];

      // Restore user's existing active hold if they reload the page
      const myHeldSeats = state.seatsData.filter(
        (s) => s.status === "HELD" && Number(s.heldByUserId) === Number(state.userID)
      );

      if (myHeldSeats.length > 0 && myHeldSeats[0].expiresAt) {
        state.activeHold = {
          seats: myHeldSeats.map((s) => s.seatNumber),
          expiresAt: myHeldSeats[0].expiresAt
        };
        state.selectedSeats = [...state.activeHold.seats];
        showHoldBanner(state.activeHold.seats);
        startHoldCountdown(state.activeHold.expiresAt);
      } else {
        // Filter out any locally selected seats that are no longer available
        const availableSet = new Set(
          state.seatsData.filter((s) => s.status === "AVAILABLE").map((s) => s.seatNumber)
        );
        state.selectedSeats = state.selectedSeats.filter((sn) => availableSet.has(sn));
      }

      renderCoachGrid();
      syncUIState();
    } catch (err) {
      console.error("Seat map load error:", err);
      showAlert("Unable to Load Seat Map", err.message || "Network error while fetching coach layout.");
    } finally {
      els.coachLoading.classList.add("hidden");
      els.coachGrid.classList.remove("hidden");
    }
  }

  function renderCoachGrid() {
    if (!els.coachGrid) return;
    els.coachGrid.innerHTML = "";

    // Group 32 seats by row (1..8)
    const rows = new Map();
    state.seatsData.forEach((seat) => {
      if (!rows.has(seat.row)) rows.set(seat.row, {});
      rows.get(seat.row)[seat.col] = seat;
    });

    const sortedRowNums = Array.from(rows.keys()).sort((a, b) => a - b);

    sortedRowNums.forEach((rowNum) => {
      const rowSeats = rows.get(rowNum);
      const rowEl = document.createElement("div");
      rowEl.className = "grid grid-cols-5 gap-2.5 items-center";

      ["A", "B", "AISLE", "C", "D"].forEach((slot) => {
        if (slot === "AISLE") {
          const aisleMarker = document.createElement("div");
          aisleMarker.className = "text-center text-xs font-mono-numbers font-bold text-slate-600 select-none";
          aisleMarker.textContent = String(rowNum).padStart(2, "0");
          rowEl.appendChild(aisleMarker);
          return;
        }

        const seat = rowSeats[slot];
        if (!seat) {
          rowEl.appendChild(document.createElement("div"));
          return;
        }

        const isSelected = state.selectedSeats.includes(seat.seatNumber);
        const isHeldByMe =
          seat.status === "HELD" && Number(seat.heldByUserId) === Number(state.userID);
        const isHeldByOther = seat.status === "HELD" && !isHeldByMe;
        const isConfirmed = seat.status === "CONFIRMED";

        const btn = document.createElement("button");
        btn.type = "button";
        btn.dataset.seat = seat.seatNumber;

        let seatClass =
          "relative h-12 rounded-xl border font-mono-numbers text-xs font-bold transition duration-150 flex flex-col items-center justify-center ";

        if (isConfirmed) {
          seatClass += "bg-slate-800/70 border-slate-700/60 text-slate-500 opacity-50 cursor-not-allowed";
          btn.disabled = true;
          btn.title = `${seat.seatNumber} • Already Booked`;
        } else if (isHeldByOther) {
          seatClass += "bg-amber-500/15 border-amber-500/50 text-amber-300 cursor-not-allowed";
          btn.disabled = true;
          btn.title = `${seat.seatNumber} • Temporarily Held by Another Passenger`;
        } else if (isHeldByMe) {
          seatClass += "bg-emerald-500/20 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/30";
          btn.title = `${seat.seatNumber} • Locked by You`;
        } else if (isSelected) {
          seatClass += "bg-[#00d9ff] border-cyan-300 text-slate-950 shadow-md shadow-cyan-500/25 scale-[1.03]";
          btn.title = `${seat.seatNumber} • Selected`;
        } else {
          seatClass += "bg-[#090934] border-slate-700 text-slate-200 hover:border-cyan-400 hover:text-cyan-300 active:scale-95";
          btn.title = `${seat.seatNumber} • ${seat.isWindow ? "Window" : "Aisle"} Seat`;
        }

        btn.className = seatClass;

        const subIcon = isConfirmed
          ? '<i class="fa-solid fa-xmark text-[9px] text-slate-500"></i>'
          : isHeldByOther || isHeldByMe
            ? '<i class="fa-solid fa-lock text-[9px]"></i>'
            : seat.isWindow
              ? '<span class="text-[9px] font-sans font-semibold opacity-75">WIN</span>'
              : '<span class="text-[9px] font-sans opacity-60">AISLE</span>';

        btn.innerHTML = `
          <span>${seat.seatNumber}</span>
          ${subIcon}
        `;

        if (!btn.disabled && !isHeldByMe) {
          btn.addEventListener("click", () => handleSeatToggle(seat.seatNumber));
        }

        rowEl.appendChild(btn);
      });

      els.coachGrid.appendChild(rowEl);
    });
  }

  function handleSeatToggle(seatNumber) {
    hideAlert();
    const required = getRequiredSeatCount();
    const idx = state.selectedSeats.indexOf(seatNumber);

    if (idx !== -1) {
      state.selectedSeats.splice(idx, 1);
    } else {
      if (state.selectedSeats.length >= required) {
        showAlert(
          "Passenger Seat Limit Reached",
          `You have ${required} passenger${required > 1 ? "s" : ""} selected. Deselect a seat or increase passenger count to choose more.`
        );
        return;
      }
      state.selectedSeats.push(seatNumber);
    }

    renderCoachGrid();
    syncUIState();
  }

  function syncUIState() {
    const required = getRequiredSeatCount();
    const chosenCount = state.selectedSeats.length;

    if (els.requirementHint) {
      els.requirementHint.textContent = `${chosenCount} / ${required} seats chosen`;
      els.requirementHint.className =
        chosenCount === required
          ? "text-emerald-400 font-semibold"
          : "text-cyan-400 font-semibold";
    }

    if (els.selectedSummary) {
      if (chosenCount === 0) {
        els.selectedSummary.innerHTML =
          '<span class="text-xs text-slate-500 italic">Click seats on the coach map to select</span>';
      } else {
        els.selectedSummary.innerHTML = state.selectedSeats
          .map((sn) => {
            const seatObj = state.seatsData.find((s) => s.seatNumber === sn);
            const tag = seatObj?.isWindow ? "Window" : "Aisle";
            return `<span class="px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 text-xs font-mono-numbers font-bold">${sn} <span class="font-sans font-normal text-[10px] text-cyan-400/80">(${tag})</span></span>`;
          })
          .join("");
      }
    }

    const holdMatchesSelection =
      state.activeHold !== null &&
      state.activeHold.seats.length === required &&
      state.selectedSeats.every((s) => state.activeHold.seats.includes(s));

    if (els.lockBtn) {
      els.lockBtn.disabled = chosenCount !== required || holdMatchesSelection;
    }

    if (els.proceedBtn) {
      els.proceedBtn.disabled = !holdMatchesSelection;
    }
  }

  /**
   * Acquires a 5-minute pessimistic database lock for the currently selected seats.
   */
  async function lockSelectedSeats() {
    hideAlert();
    if (state.selectedSeats.length !== getRequiredSeatCount()) {
      showAlert(
        "Select Your Seats",
        `Please select exactly ${getRequiredSeatCount()} seat(s) before locking.`
      );
      return;
    }

    if (els.lockBtn) {
      els.lockBtn.disabled = true;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          action: "hold",
          trainID: state.trainID,
          journeyDate: state.journeyDate,
          seats: state.selectedSeats,
          coachClass: mapClassLabel(els.classSelect?.value || "first"),
          userID: state.userID
        })
      });

      const data = await response.json();

      if (response.status === 409 || !response.ok || !data.success) {
        showAlert(
          "Seat Conflict Detected",
          data.message || "One or more selected seats were just claimed."
        );
        await loadSeatMap();
        return;
      }

      state.activeHold = {
        seats: [...state.selectedSeats],
        expiresAt: data.expiresAt
      };
      showHoldBanner(state.activeHold.seats);
      startHoldCountdown(data.expiresAt);
      await loadSeatMap();
    } catch (error) {
      console.error("Lock seats error:", error);
      showAlert("Reservation Error", "Could not lock seats. Please check your connection and try again.");
    } finally {
      syncUIState();
    }
  }

  /**
   * Runs a live 1-second MM:SS countdown for the active seat reservation hold.
   */
  function startHoldCountdown(expiresAt) {
    if (state.holdTimerInterval) {
      clearInterval(state.holdTimerInterval);
      state.holdTimerInterval = null;
    }

    if (!expiresAt) return;
    const targetMs = new Date(String(expiresAt).replace(" ", "T")).getTime();

    const tick = () => {
      const remainingSeconds = Math.max(0, Math.floor((targetMs - Date.now()) / 1000));

      if (els.holdTimerDisplay) {
        els.holdTimerDisplay.textContent = formatMMSS(remainingSeconds);
        if (remainingSeconds <= 60) {
          els.holdTimerDisplay.classList.remove("text-cyan-400");
          els.holdTimerDisplay.classList.add("text-amber-400");
        } else {
          els.holdTimerDisplay.classList.remove("text-amber-400");
          els.holdTimerDisplay.classList.add("text-cyan-400");
        }
      }

      if (els.holdProgressBar) {
        const pct = Math.min(100, (remainingSeconds / HOLD_DURATION_SECONDS) * 100);
        els.holdProgressBar.style.width = `${pct}%`;
      }

      if (remainingSeconds <= 0) {
        clearInterval(state.holdTimerInterval);
        state.holdTimerInterval = null;
        state.activeHold = null;
        hideHoldBanner();
        showAlert(
          "Reservation Hold Expired",
          "Your 5-minute hold expired. Please re-select and lock seats again."
        );
        loadSeatMap();
        syncUIState();
      }
    };

    tick();
    state.holdTimerInterval = setInterval(tick, 1000);
  }

  function init(config) {
    cacheDom();
    state.trainID = Number(config.trainID || 0);
    state.journeyDate = config.journeyDate;
    state.userID = Number(config.userID || 0);

    if (els.journeyDateInput) {
      els.journeyDateInput.value = state.journeyDate;
      els.journeyDateInput.addEventListener("change", () => {
        state.journeyDate = els.journeyDateInput.value;
        state.selectedSeats = [];
        state.activeHold = null;
        if (state.holdTimerInterval) clearInterval(state.holdTimerInterval);
        hideHoldBanner();
        hideAlert();
        loadSeatMap();
      });
    }

    if (els.classSelect && els.coachClassBadge) {
      els.coachClassBadge.textContent = mapClassLabel(els.classSelect.value);
      els.classSelect.addEventListener("change", () => {
        els.coachClassBadge.textContent = mapClassLabel(els.classSelect.value);
      });
    }

    [els.passengerCount, els.kidsCount].forEach((input) => {
      if (!input) return;
      input.addEventListener("input", () => {
        const required = getRequiredSeatCount();
        if (state.selectedSeats.length > required) {
          state.selectedSeats = state.selectedSeats.slice(0, required);
        }
        renderCoachGrid();
        syncUIState();
      });
    });

    if (els.refreshBtn) {
      els.refreshBtn.addEventListener("click", () => {
        hideAlert();
        loadSeatMap();
      });
    }

    if (els.lockBtn) {
      els.lockBtn.addEventListener("click", lockSelectedSeats);
    }

    if (els.alertClose) {
      els.alertClose.addEventListener("click", hideAlert);
    }

    loadSeatMap();
  }

  window.SeatSelector = {
    init,
    loadSeatMap,
    getHeldSeats: () => (state.activeHold ? [...state.activeHold.seats] : []),
    getSelectedSeats: () => [...state.selectedSeats],
    getJourneyDate: () => state.journeyDate
  };
})();

