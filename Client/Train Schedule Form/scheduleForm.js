// Traventure Advanced Transit Schedule Engine
document.addEventListener("DOMContentLoaded", () => {
  let stationsList = [];

  // DOM Elements
  const originInput = document.getElementById("origin-input");
  const originStationId = document.getElementById("origin-station-id");
  const originDropdown = document.getElementById("origin-dropdown");

  const destInput = document.getElementById("destination-input");
  const destStationId = document.getElementById("destination-station-id");
  const destDropdown = document.getElementById("destination-dropdown");

  const swapBtn = document.getElementById("swap-stations-btn");
  const journeyDateInput = document.getElementById("journey-date");
  const searchForm = document.getElementById("schedule-search-form");

  const loadingEl = document.getElementById("search-loading");
  const resultsWrapper = document.getElementById("results-wrapper");
  const noResultsEl = document.getElementById("no-results");

  const directContainer = document.getElementById("direct-cards-container");
  const transferContainer = document.getElementById("transfer-cards-container");
  const directSection = document.getElementById("direct-section");
  const transferSection = document.getElementById("transfer-section");

  const summaryRouteText = document.getElementById("summary-route-text");
  const summaryMetaText = document.getElementById("summary-meta-text");
  const countAll = document.getElementById("count-all");
  const countDirect = document.getElementById("count-direct");
  const countTransfers = document.getElementById("count-transfers");

  // Filter Buttons
  const filterAllBtn = document.getElementById("filter-all");
  const filterDirectBtn = document.getElementById("filter-direct");
  const filterTransfersBtn = document.getElementById("filter-transfers");

  // Initialize Default Date to Today
  const todayStr = new Date().toISOString().split("T")[0];
  journeyDateInput.value = todayStr;
  journeyDateInput.min = todayStr;

  // 1. Fetch Station Master List
  async function loadStations() {
    try {
      const res = await fetch("../../Server/api/getstations.php");
      if (!res.ok) throw new Error("Failed to load stations");
      stationsList = await res.json();
      console.log(`Loaded ${stationsList.length} stations.`);
    } catch (err) {
      console.error("Station loading error:", err);
    }
  }
  loadStations();

  // 2. Fuzzy Autocomplete Logic
  function setupAutocomplete(inputEl, idEl, dropdownEl) {
    let activeIndex = -1;

    function renderMatches(query) {
      dropdownEl.innerHTML = "";
      activeIndex = -1;
      const cleanQ = query.trim().toLowerCase();

      if (!cleanQ) {
        dropdownEl.classList.add("hidden");
        return;
      }

      const matches = stationsList.filter(st => {
        const name = (st.name || "").toLowerCase();
        const city = (st.city || "").toLowerCase();
        return name.includes(cleanQ) || city.includes(cleanQ);
      }).slice(0, 10);

      if (matches.length === 0) {
        dropdownEl.innerHTML = `<div class="px-4 py-3 text-xs text-slate-500">No stations match "${query}"</div>`;
        dropdownEl.classList.remove("hidden");
        return;
      }

      matches.forEach((st, idx) => {
        const item = document.createElement("div");
        item.className = "px-4 py-2.5 cursor-pointer hover:bg-slate-800 flex items-center justify-between text-sm transition";
        item.innerHTML = `
          <div>
            <span class="font-semibold text-white">${st.name}</span>
            <span class="text-xs text-slate-400 ml-1.5">${st.city ? `(${st.city})` : ""}</span>
          </div>
          <span class="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-1.5 py-0.5 rounded">#${st.StationID}</span>
        `;
        item.addEventListener("mousedown", (e) => {
          e.preventDefault();
          selectStation(st);
        });
        dropdownEl.appendChild(item);
      });

      dropdownEl.classList.remove("hidden");
    }

    function selectStation(st) {
      inputEl.value = st.name;
      idEl.value = st.StationID;
      dropdownEl.classList.add("hidden");
      inputEl.classList.remove("border-rose-500");
    }

    inputEl.addEventListener("input", (e) => {
      idEl.value = "";
      renderMatches(e.target.value);
    });

    inputEl.addEventListener("focus", (e) => {
      if (e.target.value.trim()) renderMatches(e.target.value);
    });

    inputEl.addEventListener("blur", () => {
      setTimeout(() => {
        dropdownEl.classList.add("hidden");
        // Auto-match exact match if user typed full name
        if (!idEl.value && inputEl.value.trim()) {
          const exact = stationsList.find(s => s.name.toLowerCase() === inputEl.value.trim().toLowerCase());
          if (exact) {
            idEl.value = exact.StationID;
            inputEl.value = exact.name;
          }
        }
      }, 200);
    });

    inputEl.addEventListener("keydown", (e) => {
      const items = dropdownEl.querySelectorAll("div.cursor-pointer");
      if (e.key === "ArrowDown") {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % items.length;
        updateActiveItem(items);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        activeIndex = (activeIndex - 1 + items.length) % items.length;
        updateActiveItem(items);
      } else if (e.key === "Enter" && activeIndex >= 0 && items[activeIndex]) {
        e.preventDefault();
        items[activeIndex].dispatchEvent(new MouseEvent("mousedown"));
      }
    });

    function updateActiveItem(items) {
      items.forEach((it, i) => {
        if (i === activeIndex) {
          it.classList.add("bg-slate-800", "border-l-2", "border-cyan-400");
          it.scrollIntoView({ block: "nearest" });
        } else {
          it.classList.remove("bg-slate-800", "border-l-2", "border-cyan-400");
        }
      });
    }
  }

  setupAutocomplete(originInput, originStationId, originDropdown);
  setupAutocomplete(destInput, destStationId, destDropdown);

  // 3. Swap Origin and Destination
  swapBtn.addEventListener("click", () => {
    const tempName = originInput.value;
    const tempId = originStationId.value;

    originInput.value = destInput.value;
    originStationId.value = destStationId.value;

    destInput.value = tempName;
    destStationId.value = tempId;
  });

  // 4. Quick Route Buttons
  document.querySelectorAll(".quick-route-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const fromName = btn.dataset.from;
      const toName = btn.dataset.to;

      const fromSt = stationsList.find(s => s.name.toLowerCase().includes(fromName.toLowerCase()));
      const toSt = stationsList.find(s => s.name.toLowerCase().includes(toName.toLowerCase()));

      if (fromSt) {
        originInput.value = fromSt.name;
        originStationId.value = fromSt.StationID;
      }
      if (toSt) {
        destInput.value = toSt.name;
        destStationId.value = toSt.StationID;
      }

      executeSearch();
    });
  });

  // 5. Search Form Submission
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    executeSearch();
  });

  async function executeSearch() {
    let fromId = originStationId.value;
    let toId = destStationId.value;

    // Fallback if typed without clicking dropdown
    if (!fromId && originInput.value.trim()) {
      const match = stationsList.find(s => s.name.toLowerCase() === originInput.value.trim().toLowerCase());
      if (match) {
        fromId = match.StationID;
        originStationId.value = match.StationID;
      }
    }
    if (!toId && destInput.value.trim()) {
      const match = stationsList.find(s => s.name.toLowerCase() === destInput.value.trim().toLowerCase());
      if (match) {
        toId = match.StationID;
        destStationId.value = match.StationID;
      }
    }

    if (!fromId) {
      originInput.focus();
      originInput.classList.add("border-rose-500");
      return;
    }
    if (!toId) {
      destInput.focus();
      destInput.classList.add("border-rose-500");
      return;
    }

    const searchDate = journeyDateInput.value || todayStr;

    // UI Updates
    resultsWrapper.classList.add("hidden");
    noResultsEl.classList.add("hidden");
    loadingEl.classList.remove("hidden");

    try {
      const res = await fetch("../../Server/api/searchTransitSchedule.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startStation: fromId,
          endStation: toId,
          searchDate: searchDate
        })
      });

      const data = await res.json();
      loadingEl.classList.add("hidden");

      if (!data.success) {
        noResultsEl.classList.remove("hidden");
        return;
      }

      renderResults(data);
    } catch (err) {
      console.error("Search API error:", err);
      loadingEl.classList.add("hidden");
      noResultsEl.classList.remove("hidden");
    }
  }

  // 6. Render Results
  function renderResults(data) {
    const direct = data.direct || [];
    const transfers = data.transfers || [];
    const total = direct.length + transfers.length;

    if (total === 0) {
      noResultsEl.classList.remove("hidden");
      return;
    }

    summaryRouteText.textContent = `${originInput.value} → ${destInput.value}`;
    summaryMetaText.textContent = `${data.dayOfWeek}, ${data.searchDate} • ${total} itinerary option${total > 1 ? "s" : ""}`;
    countAll.textContent = total;
    countDirect.textContent = direct.length;
    countTransfers.textContent = transfers.length;

    // Render Direct Cards
    directContainer.innerHTML = "";
    if (direct.length > 0) {
      directSection.classList.remove("hidden");
      direct.forEach(item => {
        const leg = item.legs[0];
        const card = createDirectCard(leg, item.totalDuration, item.isOvernight);
        directContainer.appendChild(card);
      });
    } else {
      directSection.classList.add("hidden");
    }

    // Render Multi-Leg Transfer Cards
    transferContainer.innerHTML = "";
    if (transfers.length > 0) {
      transferSection.classList.remove("hidden");
      transfers.forEach(item => {
        const card = createTransferCard(item, data.searchDate);
        transferContainer.appendChild(card);
      });
    } else {
      transferSection.classList.add("hidden");
    }

    resultsWrapper.classList.remove("hidden");
    resultsWrapper.scrollIntoView({ behavior: "smooth" });
  }

  // Card Generator: Direct Train
  function createDirectCard(leg, duration, isOvernight) {
    const card = document.createElement("div");
    card.className = "bg-[#090934]/80 border border-slate-800 hover:border-cyan-500/40 rounded-xl p-5 shadow-lg transition duration-200 group";

    card.innerHTML = `
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <!-- Train Info -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/50 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition">
            <i class="fa-solid fa-train"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-white text-base">${leg.trainName || "Express Train"}</h3>
              <span class="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">#${leg.trainID}</span>
              <span class="text-xs px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800/40 text-cyan-300 font-semibold">${leg.trainType || "Express"}</span>
            </div>
            <p class="text-xs text-slate-400 mt-0.5">Terminal: <span class="text-slate-300">${leg.terminalStation || leg.arrivalStation}</span></p>
          </div>
        </div>

        <!-- Timetable Itinerary Bar -->
        <div class="flex items-center gap-4 sm:gap-8 justify-between md:justify-center flex-1 max-w-md mx-auto">
          <div class="text-left">
            <div class="text-xl sm:text-2xl font-bold font-mono-numbers text-white">${leg.departureTime}</div>
            <div class="text-xs text-slate-400 font-medium truncate max-w-[100px]">${leg.departureStation}</div>
          </div>

          <div class="flex-1 flex flex-col items-center px-2">
            <span class="text-[11px] font-semibold text-cyan-400 mb-1">${duration}</span>
            <div class="w-full flex items-center">
              <div class="w-2 h-2 rounded-full bg-cyan-400"></div>
              <div class="h-0.5 flex-1 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500"></div>
              <div class="w-2 h-2 rounded-full bg-blue-500"></div>
            </div>
            <span class="text-[10px] text-slate-500 mt-1">${isOvernight ? "Overnight • +1 Day" : "Direct Non-Stop"}</span>
          </div>

          <div class="text-right">
            <div class="text-xl sm:text-2xl font-bold font-mono-numbers text-white">${leg.arrivalTime}</div>
            <div class="text-xs text-slate-400 font-medium truncate max-w-[100px]">${leg.arrivalStation}</div>
          </div>
        </div>

        <!-- Action CTA -->
        <div class="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="view-route-map-btn px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 font-semibold text-xs border border-slate-700 transition flex items-center gap-1.5"
              data-train-id="${leg.trainID}"
              data-train-name="${leg.trainName || 'Train'}"
            >
              <i class="fa-solid fa-map-location-dot"></i>
              <span>View Route</span>
            </button>
            <a
              href="../Booking/Booking Form/booking_form.php?trainID=${leg.trainID}"
              class="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition duration-150 shadow-md active:scale-95"
            >
              Select
            </a>
          </div>
          <span class="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <i class="fa-solid fa-circle-check text-[9px]"></i> Running Today
          </span>
        </div>
      </div>
    `;

    return card;
  }

  // Card Generator: Multi-Leg Transfer Itinerary
  function createTransferCard(item, searchDate) {
    const card = document.createElement("div");
    card.className = "bg-[#090934]/90 border border-slate-800 rounded-2xl p-6 shadow-xl transition space-y-6";

    const leg1 = item.legs[0];
    const leg2 = item.legs[1];
    const isOvernight = item.isOvernightLayover;

    const uniqueId = `hotel-module-${leg1.trainID}-${leg2.trainID}`;

    card.innerHTML = `
      <!-- Transit Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div class="flex items-center gap-2.5">
          <span class="px-2.5 py-1 rounded-md text-xs font-bold uppercase ${isOvernight ? 'bg-amber-950/80 text-amber-300 border border-amber-800/40' : 'bg-sky-950 text-sky-300 border border-sky-800/40'}">
            ${isOvernight ? '<i class="fa-solid fa-moon mr-1"></i> Overnight Transit' : '<i class="fa-solid fa-shuffle mr-1"></i> Same-Day Transfer'}
          </span>
          <span class="text-sm font-semibold text-slate-300">Via ${item.layoverStation} Junction</span>
        </div>
        <div class="flex items-center gap-3 text-xs text-slate-400 font-mono-numbers">
          <span>Total Duration: <strong class="text-white">${item.totalDuration}</strong></span>
          <span>•</span>
          <span>Layover: <strong class="text-cyan-400">${item.layoverDuration}</strong></span>
        </div>
      </div>

      <!-- Legs Timeline -->
      <div class="space-y-4">
        <!-- Leg 1 -->
        <div class="flex items-start gap-4 p-4 rounded-xl bg-[#040424]/60 border border-slate-800/70">
          <div class="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
          <div class="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
            <div class="sm:col-span-4">
              <div class="text-sm font-bold text-white">${leg1.trainName || "Train"} <span class="text-xs text-slate-400 font-normal font-mono">#${leg1.trainID}</span></div>
              <div class="text-xs text-slate-400">${leg1.trainType}</div>
            </div>
            <div class="sm:col-span-8 flex items-center justify-between sm:justify-end gap-6">
              <div class="text-left">
                <span class="text-base font-bold font-mono-numbers text-white">${leg1.departureTime}</span>
                <span class="block text-xs text-slate-400">${leg1.departureStation}</span>
              </div>
              <i class="fa-solid fa-arrow-right text-slate-600 text-xs"></i>
              <div class="text-right">
                <span class="text-base font-bold font-mono-numbers text-white">${leg1.arrivalTime}</span>
                <span class="block text-xs text-slate-400">${leg1.arrivalStation}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Layover Station Divider -->
        <div class="flex items-center gap-3 px-4 py-2 rounded-lg bg-amber-950/20 border border-amber-900/30 text-xs">
          <i class="fa-solid fa-clock text-amber-400"></i>
          <span class="text-slate-300">
            <strong>${item.layoverDuration}</strong> layover at <strong>${item.layoverStation}</strong>.
            ${isOvernight ? 'Next connecting train departs the following morning.' : 'Change platforms for Leg 2.'}
          </span>
          ${isOvernight ? `<button type="button" class="ml-auto text-amber-300 hover:text-amber-200 underline font-semibold toggle-hotel-btn" data-target="${uniqueId}">Find Places to Stay</button>` : ''}
        </div>

        <!-- Leg 2 -->
        <div class="flex items-start gap-4 p-4 rounded-xl bg-[#040424]/60 border border-slate-800/70">
          <div class="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
          <div class="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
            <div class="sm:col-span-4">
              <div class="text-sm font-bold text-white">${leg2.trainName || "Train"} <span class="text-xs text-slate-400 font-normal font-mono">#${leg2.trainID}</span></div>
              <div class="text-xs text-slate-400">${leg2.trainType}</div>
            </div>
            <div class="sm:col-span-8 flex items-center justify-between sm:justify-end gap-6">
              <div class="text-left">
                <span class="text-base font-bold font-mono-numbers text-white">${leg2.departureTime}</span>
                <span class="block text-xs text-slate-400">${leg2.departureStation}</span>
              </div>
              <i class="fa-solid fa-arrow-right text-slate-600 text-xs"></i>
              <div class="text-right">
                <span class="text-base font-bold font-mono-numbers text-white">${leg2.arrivalTime}</span>
                <span class="block text-xs text-slate-400">${leg2.arrivalStation}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Optional Hotel Suggestions Container for Overnight Layovers -->
      ${isOvernight ? `
        <div id="${uniqueId}" class="p-4 rounded-xl bg-[#040424] border border-slate-800 space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-hotel text-cyan-400"></i>
              <h4 class="text-sm font-bold text-white">Recommended Overnight Stay Near ${item.layoverStation}</h4>
            </div>
            <span class="text-xs text-slate-400">Check-in: ${searchDate}</span>
          </div>
          <div class="hotel-cards-grid grid grid-cols-1 md:grid-cols-3 gap-3" data-station="${item.layoverStation}" data-checkin="${searchDate}">
            <div class="text-xs text-slate-500 animate-pulse">Loading transit hotel options...</div>
          </div>
        </div>
      ` : ""}
    `;

    // Load hotels if overnight
    if (isOvernight) {
      setTimeout(() => loadHotelsForLayover(card.querySelector(".hotel-cards-grid"), item.layoverStation, searchDate), 100);
    }

    return card;
  }

  // 7. Hotel API Fetcher
  async function loadHotelsForLayover(container, station, checkinDate) {
    if (!container) return;
    try {
      const res = await fetch(`../../Server/api/layoverHotels.php?station=${encodeURIComponent(station)}&checkin=${encodeURIComponent(checkinDate)}`);
      const data = await res.json();

      container.innerHTML = "";
      if (!data.hotels || data.hotels.length === 0) {
        container.innerHTML = `<div class="text-xs text-slate-500 col-span-3">No hotels found. <a href="${data.bookingDeepLink}" target="_blank" class="text-cyan-400 underline">Search on Booking.com</a></div>`;
        return;
      }

      data.hotels.forEach(h => {
        const item = document.createElement("div");
        item.className = "bg-[#090934] border border-slate-800 rounded-lg overflow-hidden flex flex-col justify-between hover:border-slate-700 transition";
        item.innerHTML = `
          <div class="h-28 w-full overflow-hidden relative">
            <img src="${h.thumbnail}" alt="${h.name}" class="w-full h-full object-cover" />
            <span class="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/70 text-cyan-300 backdrop-blur-sm">${h.badge}</span>
          </div>
          <div class="p-3 flex-1 flex flex-col justify-between space-y-2">
            <div>
              <h5 class="text-xs font-bold text-white line-clamp-1">${h.name}</h5>
              <div class="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                <span class="text-amber-400 font-bold">${h.rating}</span>
                <span>•</span>
                <span class="text-[10px] text-slate-400">${h.distance}</span>
              </div>
            </div>
            <div class="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span class="text-xs font-bold text-white font-mono-numbers">${h.estimatedPrice}</span>
              <a href="${data.bookingDeepLink}" target="_blank" rel="noopener noreferrer" class="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                <span>Book</span>
                <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
              </a>
            </div>
          </div>
        `;
        container.appendChild(item);
      });

    } catch (err) {
      console.error("Hotel loading failed:", err);
      container.innerHTML = `<div class="text-xs text-slate-500 col-span-3">Explore transit hotels on <a href="https://www.booking.com" target="_blank" class="text-cyan-400 underline">Booking.com</a></div>`;
    }
  }

  // 8. Tab Filters (All, Direct, Transits)
  filterAllBtn.addEventListener("click", () => setFilter("all"));
  filterDirectBtn.addEventListener("click", () => setFilter("direct"));
  filterTransfersBtn.addEventListener("click", () => setFilter("transfers"));

  function setFilter(type) {
    [filterAllBtn, filterDirectBtn, filterTransfersBtn].forEach(b => {
      b.className = "filter-tab-btn px-3 py-1.5 rounded-md text-slate-400 hover:text-white transition";
    });

    if (type === "all") {
      filterAllBtn.className = "filter-tab-btn px-3 py-1.5 rounded-md bg-cyan-500 text-slate-950 font-bold transition";
      directSection.classList.remove("hidden");
      transferSection.classList.remove("hidden");
    } else if (type === "direct") {
      filterDirectBtn.className = "filter-tab-btn px-3 py-1.5 rounded-md bg-cyan-500 text-slate-950 font-bold transition";
      directSection.classList.remove("hidden");
      transferSection.classList.add("hidden");
  // 9. Interactive Railway Map Modal Triggering
  const mapModal = document.getElementById("map-modal");
  const closeMapModalBtn = document.getElementById("close-map-modal-btn");
  const mapModalTitle = document.getElementById("map-modal-title");
  const mapModalSubtitle = document.getElementById("map-modal-subtitle");

  if (closeMapModalBtn) {
    closeMapModalBtn.addEventListener("click", () => {
      mapModal.classList.add("hidden");
    });
  }

  // Delegate click for "View Route" buttons
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".view-route-map-btn");
    if (!btn) return;

    const trainID = btn.dataset.trainId;
    const trainName = btn.dataset.trainName;

    mapModalTitle.textContent = `${trainName} (Train #${trainID})`;
    mapModalSubtitle.textContent = "Loading route track and station waypoints...";
    mapModal.classList.remove("hidden");

    // Initialize or resize map
    const map = window.initTransitMap("transit-map-container");

    try {
      const res = await fetch(`../../Server/api/getTrainRoutePath.php?trainID=${trainID}`);
      const data = await res.json();

      if (!data.success) {
        mapModalSubtitle.textContent = "Could not load route coordinates for this train.";
        return;
      }

      mapModalSubtitle.textContent = `${data.stopsCount} stops • ${data.train.startStation} to ${data.train.endStation}`;
      
      // Call your Leaflet rendering function!
      if (typeof window.renderTrainRouteOnMap === "function") {
        window.renderTrainRouteOnMap(map, data);
      }
    } catch (err) {
      console.error("Map route fetch error:", err);
      mapModalSubtitle.textContent = "Failed to load railway route geometry.";
    }
  });
});
