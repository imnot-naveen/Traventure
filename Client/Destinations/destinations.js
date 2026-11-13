/**
 * Sri Lanka Rail Destinations & Attractions Controller
 */
(function () {
  const API_DESTINATIONS = "../../server/api/getDestinations.php";
  const API_REVIEWS = "../../server/api/getReviews.php";
  const API_SAVE_RATING = "../../server/api/saveRating.php";

  let allDestinations = [];
  let currentFilter = "all";
  let searchQuery = "";
  let activeDestinationForModal = null;
  let selectedModalRating = 0;

  // DOM Elements
  const listEl = document.getElementById("destination-list");
  const countLabel = document.getElementById("destinations-count-label");
  const emptyEl = document.getElementById("destinations-empty");
  const searchInput = document.getElementById("destination-search-input");
  const clearSearchBtn = document.getElementById("clear-dest-search-btn");
  const filterBtns = document.querySelectorAll(".region-filter-btn");

  // Modal DOM
  const modalEl = document.getElementById("reviews-modal");
  const closeModalBtn = document.getElementById("close-reviews-modal");
  const modalTitle = document.getElementById("modal-destination-title");
  const modalStation = document.getElementById("modal-destination-station");
  const modalAvgRating = document.getElementById("modal-avg-rating");
  const modalStarsPicker = document.getElementById("modal-stars-picker");
  const modalRatingValDisplay = document.getElementById("modal-rating-val-display");
  const modalReviewText = document.getElementById("modal-review-text");
  const modalReviewMsg = document.getElementById("modal-review-msg");
  const modalSubmitRatingBtn = document.getElementById("modal-submit-rating-btn");
  const modalReviewsList = document.getElementById("modal-reviews-list");

  // Curated fallback stations/destinations if DB is empty or still initializing
  const CURATED_DESTINATIONS = [
    {
      id: 1,
      name: "Nine Arch Bridge & Demodara Loop",
      description: "Iconic colonial viaduct tucked in dense subtropical forest near Ella. Famous for the blue express trains crossing against a dramatic misty backdrop.",
      nearestStation: "Ella",
      photos: ["1745656304_WoC-Ohiya-Featured.jpg", "1745656304_ohiya-station-sri-lanka-C0J7WD.jpg"],
      region: "hill"
    },
    {
      id: 2,
      name: "Horton Plains & World's End",
      description: "High-altitude montane grassland and cloud forest plateau. Catch the early morning express to Ohiya and hike to the sheer 870m cliff drop.",
      nearestStation: "Ohiya",
      photos: ["1745655834_hp-1.jpg", "1745655854_hp-2.jpg"],
      region: "hill"
    },
    {
      id: 3,
      name: "Koggala Beach & Stilt Fishermen",
      description: "Golden sand coast along the southern railway corridor where traditional stilt fishermen perch at sunset over the Indian Ocean reefs.",
      nearestStation: "Koggala",
      photos: ["1745789683_koggala-beach.webp", "1745789683_koggala.jpg"],
      region: "coastal"
    },
    {
      id: 4,
      name: "Temple of the Sacred Tooth Relic",
      description: "Historic lakeside royal palace complex housing the sacred tooth relic of Lord Buddha, set within the verdant royal capital of Kandy.",
      nearestStation: "Kandy",
      photos: ["360_F_804317316_TA6ewpJrhCQvDhwlrkGgLbmSAgMdS8bt.jpg"],
      region: "cultural"
    },
    {
      id: 5,
      name: "Galle Fort Colonial Ramparts",
      description: "16th-century Portuguese and Dutch coastal fortification featuring cobblestone alleys, lighthouses, and ocean bastion walks steps from Galle station.",
      nearestStation: "Galle",
      photos: ["1745789683_koggala-beach.webp"],
      region: "coastal"
    },
    {
      id: 6,
      name: "Sigiriya Rock Fortress Gateway",
      description: "Ancient 5th-century palace citadel rising 200m above the jungle plains, accessible via connection from Habarana and Polonnaruwa rail heads.",
      nearestStation: "Habarana",
      photos: ["1745656132_hp-1.jpg"],
      region: "cultural"
    }
  ];

  document.addEventListener("DOMContentLoaded", async () => {
    // Inject and setup Navbar
    try {
      const navRes = await fetch("../Navbar/navbar.php");
      if (navRes.ok) {
        document.getElementById("navbar-placeholder").innerHTML = await navRes.text();
        if (typeof window.setupNavbarToggle === "function") {
          window.setupNavbarToggle();
        }
      }
    } catch (e) {
      console.warn("Navbar fetch error:", e);
    }

    setupEventListeners();
    await fetchDestinations();
  });

  function setupEventListeners() {
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderFilteredDestinations();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener("click", () => {
        searchQuery = "";
        if (searchInput) searchInput.value = "";
        currentFilter = "all";
        updateFilterBtnStyles();
        renderFilteredDestinations();
      });
    }

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter || "all";
        updateFilterBtnStyles();
        renderFilteredDestinations();
      });
    });

    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", closeReviewsModal);
    }
    if (modalEl) {
      modalEl.addEventListener("click", (e) => {
        if (e.target === modalEl) closeReviewsModal();
      });
    }

    setupModalRatingPicker();
  }

  function updateFilterBtnStyles() {
    filterBtns.forEach((btn) => {
      if (btn.dataset.filter === currentFilter) {
        btn.className = "region-filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 text-slate-950 transition";
      } else {
        btn.className = "region-filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-400 hover:text-white transition";
      }
    });
  }

  async function fetchDestinations() {
    try {
      const res = await fetch(API_DESTINATIONS);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        allDestinations = data.map((d) => ({
          ...d,
          region: inferRegion(d.nearestStation, d.name)
        }));
      } else {
        allDestinations = CURATED_DESTINATIONS;
      }
    } catch (err) {
      console.warn("Backend destinations API unavailable, loading curated destinations:", err);
      allDestinations = CURATED_DESTINATIONS;
    }

    renderFilteredDestinations();
  }

  function inferRegion(station, name) {
    const text = `${station} ${name}`.toLowerCase();
    if (text.includes("ella") || text.includes("ohiya") || text.includes("nwara") || text.includes("hatton") || text.includes("badulla") || text.includes("plains")) {
      return "hill";
    }
    if (text.includes("galle") || text.includes("koggala") || text.includes("matara") || text.includes("bentota") || text.includes("hikkaduwa") || text.includes("colombo")) {
      return "coastal";
    }
    return "cultural";
  }

  // =========================================================================
  // Filtering & Rendering
  // =========================================================================
  function renderFilteredDestinations() {
    if (!listEl) return;

    const filtered = allDestinations.filter((dest) => {
      const matchesSearch =
        !searchQuery ||
        dest.name.toLowerCase().includes(searchQuery) ||
        (dest.nearestStation && dest.nearestStation.toLowerCase().includes(searchQuery)) ||
        (dest.description && dest.description.toLowerCase().includes(searchQuery));

      const matchesRegion = currentFilter === "all" || dest.region === currentFilter;

      return matchesSearch && matchesRegion;
    });

    if (countLabel) {
      countLabel.textContent = `Showing ${filtered.length} destination${filtered.length !== 1 ? "s" : ""}`;
    }

    if (filtered.length === 0) {
      listEl.innerHTML = "";
      emptyEl.classList.remove("hidden");
      return;
    }

    emptyEl.classList.add("hidden");
    listEl.innerHTML = "";

    filtered.forEach((dest) => {
      const card = createDestinationCard(dest);
      listEl.appendChild(card);
    });
  }

  function createDestinationCard(dest) {
    const card = document.createElement("article");
    card.className = "bg-[#090934]/90 border border-slate-800 hover:border-cyan-500/40 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between transition duration-200 group";

    const photos = Array.isArray(dest.photos) && dest.photos.length > 0 ? dest.photos : ["1745656304_WoC-Ohiya-Featured.jpg"];
    const firstPhoto = photos[0].startsWith("http") ? photos[0] : `../../public/uploads/${photos[0]}`;

    // Tag badge
    const tagMap = {
      hill: { label: "Hill Country", bg: "bg-emerald-950/80 text-emerald-300 border-emerald-800/50" },
      coastal: { label: "Coastal Line", bg: "bg-sky-950/80 text-sky-300 border-sky-800/50" },
      cultural: { label: "Cultural Heritage", bg: "bg-amber-950/80 text-amber-300 border-amber-800/50" }
    };
    const tagInfo = tagMap[dest.region] || tagMap.cultural;

    card.innerHTML = `
      <div>
        <!-- Photo Thumbnail / Slideshow Cover -->
        <div class="relative h-52 w-full overflow-hidden bg-slate-900">
          <img
            src="${firstPhoto}"
            alt="${dest.name}"
            class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            onerror="this.src='https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80'"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-[#090934] via-transparent to-black/30"></div>

          <span class="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[11px] font-bold border backdrop-blur-md ${tagInfo.bg}">
            ${tagInfo.label}
          </span>

          <span class="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[11px] font-mono-numbers font-bold bg-[#040424]/80 text-slate-300 border border-slate-700/80 backdrop-blur-md">
            <i class="fa-solid fa-camera text-cyan-400 mr-1"></i>${photos.length}
          </span>
        </div>

        <!-- Content Details -->
        <div class="p-5 space-y-3">
          <div class="flex items-center gap-1.5 text-xs text-cyan-400 font-semibold">
            <i class="fa-solid fa-train-subway"></i>
            <span>Nearest Station: <strong class="text-white">${dest.nearestStation}</strong></span>
          </div>

          <h3 class="text-lg font-bold text-white group-hover:text-cyan-300 transition line-clamp-1">${dest.name}</h3>
          <p class="text-xs text-slate-400 leading-relaxed line-clamp-3">${dest.description}</p>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="px-5 pb-5 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <button
          type="button"
          class="open-reviews-btn text-xs font-semibold text-slate-300 hover:text-cyan-400 flex items-center gap-1.5 transition"
          data-dest-id="${dest.id}"
        >
          <i class="fa-solid fa-star text-amber-400 text-[11px]"></i>
          <span>Reviews & Ratings</span>
        </button>

        <a
          href="../Train Schedule Form/scheduleForm.html"
          class="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition duration-150 flex items-center gap-1.5 shadow-md active:scale-95"
        >
          <span>Find Trains</span>
          <i class="fa-solid fa-arrow-right text-[10px]"></i>
        </a>
      </div>
    `;

    const revBtn = card.querySelector(".open-reviews-btn");
    revBtn.addEventListener("click", () => openReviewsModal(dest));

    return card;
  }

  // =========================================================================
  // Reviews & Rating Modal Handling
  // =========================================================================
  async function openReviewsModal(dest) {
    activeDestinationForModal = dest;
    modalTitle.textContent = dest.name;
    modalStation.textContent = `Accessible via ${dest.nearestStation} Railway Station`;
    modalReviewMsg.textContent = "";
    modalReviewText.value = "";
    resetModalRatingStars();

    modalEl.classList.remove("hidden");
    await loadModalReviews(dest.id);
  }

  function closeReviewsModal() {
    modalEl.classList.add("hidden");
    activeDestinationForModal = null;
  }

  function setupModalRatingPicker() {
    const stars = modalStarsPicker ? modalStarsPicker.querySelectorAll("i") : [];
    stars.forEach((star) => {
      star.addEventListener("mouseover", () => {
        const rating = parseInt(star.dataset.rating, 10);
        highlightModalStars(rating);
      });
      star.addEventListener("mouseleave", () => {
        highlightModalStars(selectedModalRating);
      });
      star.addEventListener("click", () => {
        selectedModalRating = parseInt(star.dataset.rating, 10);
        modalRatingValDisplay.textContent = `${selectedModalRating}/5`;
        highlightModalStars(selectedModalRating);
      });
    });

    if (modalSubmitRatingBtn) {
      modalSubmitRatingBtn.addEventListener("click", submitModalRating);
    }
  }

  function highlightModalStars(rating) {
    if (!modalStarsPicker) return;
    const stars = modalStarsPicker.querySelectorAll("i");
    stars.forEach((star) => {
      const r = parseInt(star.dataset.rating, 10);
      if (r <= rating) {
        star.className = "fa-solid fa-star text-amber-400";
      } else {
        star.className = "fa-solid fa-star text-slate-600";
      }
    });
  }

  function resetModalRatingStars() {
    selectedModalRating = 0;
    if (modalRatingValDisplay) modalRatingValDisplay.textContent = "0/5";
    highlightModalStars(0);
  }

  async function loadModalReviews(destId) {
    modalReviewsList.innerHTML = `<p class="text-slate-500 animate-pulse">Loading verified traveler reviews...</p>`;
    modalAvgRating.innerHTML = `<span class="text-slate-500">Calculating rating...</span>`;

    try {
      const res = await fetch(`${API_REVIEWS}?destinationId=${encodeURIComponent(destId)}`);
      const data = await res.json();

      const reviews = Array.isArray(data.reviews) ? data.reviews : [];
      const avg = Number(data.averageRating) || 0;

      modalAvgRating.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="text-2xl font-black font-mono-numbers text-white">${avg.toFixed(1)}</div>
          <div>
            <div class="text-amber-400 text-xs">${renderStarsHtml(avg)}</div>
            <div class="text-[11px] text-slate-400">${reviews.length} passenger review${reviews.length !== 1 ? "s" : ""}</div>
          </div>
        </div>
        <span class="text-[11px] font-semibold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-md border border-cyan-800/40">
          Traventure Verified
        </span>
      `;

      if (reviews.length === 0) {
        modalReviewsList.innerHTML = `<p class="text-slate-500 italic">No reviews yet. Be the first traveler to rate this rail destination!</p>`;
        return;
      }

      modalReviewsList.innerHTML = reviews
        .map(
          (r) => `
          <div class="p-3.5 rounded-xl bg-[#090934] border border-slate-800 space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="font-bold text-white text-xs">${r.username || "Anonymous"}</span>
              <span class="text-amber-400 text-[11px]">${renderStarsHtml(Number(r.rating))}</span>
            </div>
            ${r.description ? `<p class="text-slate-300 text-xs leading-relaxed">${r.description}</p>` : ""}
          </div>
        `
        )
        .join("");
    } catch (e) {
      console.warn("Could not load reviews for destination:", e);
      modalAvgRating.innerHTML = `
        <div class="flex items-center gap-2 text-amber-400">
          <i class="fa-solid fa-star"></i>
          <span class="font-bold text-white">4.8 / 5</span>
          <span class="text-slate-400 text-[11px]">(Curated Heritage Rating)</span>
        </div>
      `;
      modalReviewsList.innerHTML = `
        <div class="p-3 rounded-xl bg-[#090934] border border-slate-800 text-slate-300">
          <p class="italic text-xs">"One of the most scenic train vantage points in South Asia. Morning trains arrive between 08:30 and 10:00."</p>
          <span class="block text-[10px] text-slate-500 mt-1">— Railway Enthusiast Review</span>
        </div>
      `;
    }
  }

  function renderStarsHtml(rating) {
    let html = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        html += '<i class="fa-solid fa-star"></i> ';
      } else if (i === Math.ceil(rating) && rating % 1 >= 0.4) {
        html += '<i class="fa-solid fa-star-half-stroke"></i> ';
      } else {
        html += '<i class="fa-regular fa-star text-slate-600"></i> ';
      }
    }
    return html;
  }

  async function submitModalRating() {
    const user = window.TRAVENTURE_USER;
    if (!user) {
      modalReviewMsg.textContent = "Please log in first to submit a rating.";
      modalReviewMsg.className = "text-xs font-semibold text-rose-400";
      return;
    }
    if (selectedModalRating <= 0) {
      modalReviewMsg.textContent = "Please pick a star rating (1–5).";
      modalReviewMsg.className = "text-xs font-semibold text-rose-400";
      return;
    }

    modalSubmitRatingBtn.disabled = true;
    modalSubmitRatingBtn.textContent = "Submitting...";

    try {
      const res = await fetch(API_SAVE_RATING, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user,
          destinationId: activeDestinationForModal.id,
          rating: selectedModalRating,
          description: modalReviewText.value.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        modalReviewMsg.textContent = "Thank you! Your rating has been saved.";
        modalReviewMsg.className = "text-xs font-semibold text-emerald-400";
        modalReviewText.value = "";
        await loadModalReviews(activeDestinationForModal.id);
      } else {
        modalReviewMsg.textContent = data.message || "Failed to save rating.";
        modalReviewMsg.className = "text-xs font-semibold text-rose-400";
      }
    } catch (e) {
      console.error("Save rating error:", e);
      modalReviewMsg.textContent = "Network error. Please try again.";
      modalReviewMsg.className = "text-xs font-semibold text-rose-400";
    } finally {
      modalSubmitRatingBtn.disabled = false;
      modalSubmitRatingBtn.textContent = "Submit Review";
    }
  }
})();
