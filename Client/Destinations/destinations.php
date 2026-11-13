<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
$isLoggedIn = isset($_SESSION['username']);
$username = $isLoggedIn ? htmlspecialchars($_SESSION['username'], ENT_QUOTES, 'UTF-8') : '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sri Lanka Rail Destinations & Attractions | Traventure</title>
  <link rel="stylesheet" href="../assets/css/tailwind.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet" />
  <style>
    body { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; }
    .font-mono-numbers { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-[#040424] text-slate-100 min-h-screen flex flex-col antialiased">

  <!-- Navbar Placeholder -->
  <nav id="navbar-placeholder" class="relative z-50"></nav>

  <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-8">

    <!-- Header & Hero Intro -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/40 text-cyan-300 text-xs font-semibold mb-3">
          <i class="fa-solid fa-map-location-dot text-cyan-400"></i>
          <span>Railway Exploration Guide</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-black text-white tracking-tight">Explore Sri Lanka By Train</h1>
        <p class="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
          Discover handpicked destinations, misty mountain ranges, and coastal shores directly accessible from Sri Lanka Railways mainline and branch line stations.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <a href="../Train Schedule Form/scheduleForm.html" class="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition duration-150 flex items-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95">
          <i class="fa-solid fa-train"></i>
          <span>Search Train Schedules</span>
        </a>
      </div>
    </div>

    <!-- Live Filter & Search Controls -->
    <div class="bg-[#090934]/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
      <div class="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-center">
        <!-- Search bar -->
        <div class="sm:col-span-6 relative">
          <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
          <input
            type="text"
            id="destination-search-input"
            placeholder="Search by destination name, nearest station, or highlights..."
            class="w-full bg-[#040424] border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs font-medium"
          />
        </div>

        <!-- Filter tabs: Region / Line -->
        <div class="sm:col-span-6 flex items-center justify-start sm:justify-end gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button type="button" class="region-filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 text-slate-950 transition" data-filter="all">All</button>
          <button type="button" class="region-filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-400 hover:text-white transition" data-filter="hill">Hill Country</button>
          <button type="button" class="region-filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-400 hover:text-white transition" data-filter="coastal">Coastal Line</button>
          <button type="button" class="region-filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-400 hover:text-white transition" data-filter="cultural">Cultural Triangle</button>
        </div>
      </div>
    </div>

    <!-- Active Count & Sort Strip -->
    <div class="flex items-center justify-between text-xs text-slate-400 px-1">
      <span id="destinations-count-label">Loading destinations...</span>
      <span class="text-slate-500 font-mono">Linked to Sri Lanka Railway Network</span>
    </div>

    <!-- Destinations Grid -->
    <div id="destination-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Loading skeletons rendered dynamically -->
      <div class="h-96 rounded-2xl bg-[#090934]/60 border border-slate-800 animate-pulse"></div>
      <div class="h-96 rounded-2xl bg-[#090934]/60 border border-slate-800 animate-pulse"></div>
      <div class="h-96 rounded-2xl bg-[#090934]/60 border border-slate-800 animate-pulse"></div>
    </div>

    <!-- Empty State -->
    <div id="destinations-empty" class="hidden py-16 text-center space-y-3 bg-[#090934]/40 border border-slate-800 rounded-2xl">
      <i class="fa-solid fa-compass text-slate-600 text-4xl mb-2"></i>
      <h3 class="text-base font-bold text-white">No Matching Destinations Found</h3>
      <p class="text-xs text-slate-400 max-w-sm mx-auto">Try clearing your search query or choosing another railway zone.</p>
      <button type="button" id="clear-dest-search-btn" class="mt-2 px-3.5 py-1.5 rounded-lg bg-slate-800 text-cyan-400 text-xs font-semibold hover:bg-slate-700 transition">
        Reset Search Filters
      </button>
    </div>

  </main>

  <!-- Destination Reviews & Rating Modal -->
  <div id="reviews-modal" class="hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-[#090934] border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
      <!-- Modal Header -->
      <div class="p-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 id="modal-destination-title" class="text-base font-bold text-white">Destination Reviews</h3>
          <p id="modal-destination-station" class="text-xs text-cyan-400 mt-0.5"></p>
        </div>
        <button type="button" id="close-reviews-modal" class="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs transition">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
        <!-- Average Rating Summary -->
        <div id="modal-avg-rating" class="p-4 rounded-xl bg-[#040424] border border-slate-800 flex items-center justify-between"></div>

        <!-- Rating Submission Box -->
        <div id="modal-rating-form" class="p-4 rounded-xl bg-[#040424] border border-slate-800 space-y-3">
          <h4 class="text-xs font-bold text-slate-200 uppercase tracking-wider">Leave Your Review</h4>
          <div class="flex items-center gap-2">
            <span class="text-slate-400">Rating:</span>
            <div id="modal-stars-picker" class="flex items-center gap-1.5 text-slate-600 text-base cursor-pointer">
              <i class="fa-solid fa-star" data-rating="1"></i>
              <i class="fa-solid fa-star" data-rating="2"></i>
              <i class="fa-solid fa-star" data-rating="3"></i>
              <i class="fa-solid fa-star" data-rating="4"></i>
              <i class="fa-solid fa-star" data-rating="5"></i>
            </div>
            <span id="modal-rating-val-display" class="font-mono-numbers text-cyan-400 font-bold ml-1">0/5</span>
          </div>
          <textarea
            id="modal-review-text"
            rows="3"
            placeholder="Share your travel experience, best train viewpoints, or travel tips..."
            class="w-full bg-[#090934] border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
          ></textarea>
          <div class="flex items-center justify-between">
            <span id="modal-review-msg" class="text-xs font-medium"></span>
            <button
              type="button"
              id="modal-submit-rating-btn"
              class="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition active:scale-95"
            >
              Submit Review
            </button>
          </div>
        </div>

        <!-- Reviews List -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider">Traveler Feedback</h4>
          <div id="modal-reviews-list" class="space-y-2.5">
            <p class="text-slate-500">Loading reviews...</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    window.TRAVENTURE_USER = <?= json_encode($username); ?>;
  </script>
  <script src="../Navbar/navbar.js"></script>
  <script src="destinations.js"></script>
</body>
</html>
