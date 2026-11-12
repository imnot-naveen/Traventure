<?php
session_start();

// Not logged in
if (!isset($_SESSION['username'])) {
    header("Location: ../../Login/LoginPage.html");
    exit();
}

// Only allow users with userType = 'Traveller'
if ($_SESSION['userType'] !== "Traveller") {
    header("Location: ../../Unauthorized/unauthorized.php");
    exit();
}

$sessionUserId = isset($_SESSION['userID']) ? (int)$_SESSION['userID'] : 0;
$sessionUsername = htmlspecialchars($_SESSION['username'], ENT_QUOTES, 'UTF-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Select Seats & Complete Booking | Traventure</title>
  <link rel="stylesheet" href="../../assets/css/tailwind.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet" />
  <script src="https://js.stripe.com/v3/"></script>
  <style>
    body { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; }
    .font-mono-numbers { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-[#040424] text-slate-100 min-h-screen flex flex-col antialiased">

  <!-- Focused Checkout Header -->
  <header class="sticky top-0 z-40 bg-[#040424]/90 backdrop-blur-md border-b border-slate-800/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <a href="../../Train Schedule Form/scheduleForm.html" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition">
          <i class="fa-solid fa-arrow-left text-[11px]"></i>
          <span>Back to Schedules</span>
        </a>
        <div class="hidden sm:flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-sm">
            T
          </div>
          <span class="text-sm font-extrabold tracking-tight text-white">TRAVENTURE</span>
          <span class="text-slate-600">/</span>
          <span class="text-xs font-semibold text-cyan-400">Seat Selection & Checkout</span>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#090934] border border-slate-800 text-xs">
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span class="text-slate-400">Passenger:</span>
          <span class="font-bold text-white"><?= $sessionUsername ?></span>
        </div>
      </div>
    </div>
  </header>

  <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">

    <!-- Page Heading & Journey Strip -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/40 text-cyan-300 text-xs font-semibold mb-2">
          <i class="fa-solid fa-couch text-cyan-400"></i>
          <span>Concurrency-Safe Coach Reservation</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Choose Your Coach Seats</h1>
        <p class="text-xs sm:text-sm text-slate-400 mt-1">Lock your preferred window or aisle seats for 5 minutes while completing Stripe checkout.</p>
      </div>

      <div class="flex items-center gap-3 bg-[#090934]/90 border border-slate-800 rounded-xl px-4 py-2.5">
        <label for="journey-date-input" class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Journey Date</label>
        <input
          type="date"
          id="journey-date-input"
          class="bg-[#040424] border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono-numbers text-white focus:outline-none focus:border-cyan-400 [color-scheme:dark]"
        />
      </div>
    </div>

    <!-- Live 5-Minute Hold Countdown Banner (Visible once seats are locked) -->
    <div id="hold-countdown-banner" class="hidden rounded-2xl bg-emerald-950/30 border border-emerald-500/40 p-4 sm:p-5 shadow-lg shadow-emerald-950/20">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-start sm:items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <i class="fa-solid fa-lock animate-pulse"></i>
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-sm font-bold text-white">Seats Temporarily Locked</span>
              <div id="hold-seats-badges" class="flex flex-wrap gap-1.5"></div>
            </div>
            <p class="text-xs text-slate-300 mt-0.5">Your seats are reserved exclusively for your account until the timer expires.</p>
          </div>
        </div>

        <div class="flex items-center gap-3 sm:text-right shrink-0">
          <div class="px-4 py-2 rounded-xl bg-[#040424] border border-slate-800">
            <span class="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Hold Expires In</span>
            <span id="hold-timer-display" class="text-xl font-extrabold font-mono-numbers text-cyan-400">05:00</span>
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="mt-3.5 h-1.5 w-full rounded-full bg-[#040424] overflow-hidden border border-slate-800/80">
        <div id="hold-progress-bar" class="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-1000" style="width: 100%"></div>
      </div>
    </div>

    <!-- Conflict / Warning Alert Banner -->
    <div id="seat-alert-banner" class="hidden rounded-xl bg-rose-950/40 border border-rose-500/50 p-4 flex items-start justify-between gap-3">
      <div class="flex items-start gap-3">
        <i class="fa-solid fa-triangle-exclamation text-rose-400 mt-0.5"></i>
        <div>
          <h4 id="seat-alert-title" class="text-sm font-bold text-rose-200">Seat Conflict Detected</h4>
          <p id="seat-alert-message" class="text-xs text-rose-300/90 mt-0.5"></p>
        </div>
      </div>
      <button type="button" id="seat-alert-close" class="text-rose-300 hover:text-white text-xs px-2 py-1">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <!-- Main 2-Column Workspace -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

      <!-- Left Column: Interactive Train Coach Map -->
      <section class="lg:col-span-7 bg-[#090934]/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5">

        <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div class="flex items-center gap-2.5">
            <span class="px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-800/50 text-cyan-300 text-xs font-bold" id="coach-class-badge">
              1st Class Observation Car
            </span>
            <span class="text-xs text-slate-400">32 Seats • Rows 1–8</span>
          </div>

          <button type="button" id="refresh-seats-btn" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition">
            <i class="fa-solid fa-arrows-rotate text-[11px]"></i>
            <span>Refresh Map</span>
          </button>
        </div>

        <!-- Seat Status Legend -->
        <div class="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-300 bg-[#040424]/70 border border-slate-800/80 rounded-xl px-4 py-3">
          <div class="flex items-center gap-2">
            <span class="w-4 h-4 rounded bg-[#040424] border border-slate-600 inline-block"></span>
            <span>Available</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-4 h-4 rounded bg-[#00d9ff] border border-cyan-300 inline-block"></span>
            <span>Selected</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-4 h-4 rounded bg-emerald-500/25 border border-emerald-400 inline-block"></span>
            <span>Your Lock</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-4 h-4 rounded bg-amber-500/20 border border-amber-500/50 inline-block"></span>
            <span>Held (Other)</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-4 h-4 rounded bg-slate-800 border border-slate-700 opacity-50 inline-block"></span>
            <span>Booked</span>
          </div>
          <div class="flex items-center gap-1.5 ml-auto text-cyan-400 font-semibold">
            <span class="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800/60 text-[10px]">W</span>
            <span>Window</span>
          </div>
        </div>

        <!-- Coach Chassis Frame -->
        <div class="relative rounded-3xl bg-[#040424] border-2 border-slate-800 p-4 sm:p-6 max-w-md mx-auto">
          <!-- Front Nosecone Indicator -->
          <div class="mb-5 pb-3 border-b border-dashed border-slate-800 flex flex-col items-center text-center">
            <div class="w-24 h-1.5 rounded-full bg-gradient-to-r from-transparent via-cyan-500/70 to-transparent mb-2"></div>
            <span class="text-[11px] uppercase tracking-widest font-bold text-slate-400">
              <i class="fa-solid fa-caret-up text-cyan-400 mr-1"></i> Front of Coach • Direction of Travel
            </span>
          </div>

          <!-- Column Headers -->
          <div class="grid grid-cols-5 gap-2.5 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">
            <div>A <span class="text-cyan-500/80">(W)</span></div>
            <div>B</div>
            <div class="text-slate-600">Aisle</div>
            <div>C</div>
            <div>D <span class="text-cyan-500/80">(W)</span></div>
          </div>

          <!-- Loading Skeleton -->
          <div id="coach-loading" class="py-16 text-center space-y-3">
            <i class="fa-solid fa-circle-notch fa-spin text-cyan-400 text-2xl"></i>
            <p class="text-xs text-slate-400">Synchronizing live seat availability...</p>
          </div>

          <!-- Dynamic Seat Rows -->
          <div id="coach-seat-grid" class="hidden space-y-2.5"></div>

          <!-- Rear Coach Indicator -->
          <div class="mt-5 pt-3 border-t border-dashed border-slate-800 text-center text-[10px] uppercase tracking-widest text-slate-600 font-semibold">
            Rear Exit & Vestibule
          </div>
        </div>
      </section>

      <!-- Right Column: Train Details, Passenger Inputs & Reservation Action -->
      <aside class="lg:col-span-5 space-y-5">

        <!-- Train Summary Card -->
        <div id="train-details" class="bg-[#090934]/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div class="animate-pulse h-20 bg-slate-800/40 rounded-xl"></div>
        </div>

        <!-- Booking Form Card -->
        <form id="booking-form" class="bg-[#090934]/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
          <h2 class="text-lg font-extrabold text-white flex items-center gap-2">
            <i class="fa-solid fa-ticket text-cyan-400 text-sm"></i>
            <span>Passenger & Fare Summary</span>
          </h2>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="passenger-count" class="block text-xs font-semibold text-slate-300 mb-1.5">Adults (Full Fare)</label>
              <input
                type="number"
                id="passenger-count"
                min="1"
                max="8"
                value="1"
                class="w-full bg-[#040424] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono-numbers text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label for="kids-count" class="block text-xs font-semibold text-slate-300 mb-1.5">Kids (Half Fare)</label>
              <input
                type="number"
                id="kids-count"
                min="0"
                max="6"
                value="0"
                class="w-full bg-[#040424] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono-numbers text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="class" class="block text-xs font-semibold text-slate-300 mb-1.5">Coach Class</label>
              <select
                id="class"
                class="w-full bg-[#040424] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="first">1st Class (Observation)</option>
                <option value="second">2nd Class (Reserved)</option>
                <option value="third">3rd Class (Standard)</option>
              </select>
            </div>

            <div>
              <label for="payment-option" class="block text-xs font-semibold text-slate-300 mb-1.5">Payment Option</label>
              <select
                id="payment-option"
                class="w-full bg-[#040424] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Card">Stripe Card Checkout</option>
              </select>
            </div>
          </div>

          <!-- Selected Seats Breakdown -->
          <div class="p-4 rounded-xl bg-[#040424] border border-slate-800 space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-400 font-semibold uppercase tracking-wider">Selected Seats</span>
              <span id="seat-requirement-hint" class="text-cyan-400 font-semibold">0 / 1 seats chosen</span>
            </div>
            <div id="selected-seats-summary" class="flex flex-wrap gap-2 min-h-[28px] items-center">
              <span class="text-xs text-slate-500 italic">Click seats on the coach map to select</span>
            </div>
          </div>

          <!-- Total Fare Strip -->
          <div class="flex items-center justify-between pt-2 border-t border-slate-800">
            <div>
              <span class="block text-xs text-slate-400">Total Estimated Fare</span>
              <span class="text-[11px] text-slate-500">Includes all selected passengers</span>
            </div>
            <div id="total-amount" class="text-2xl font-black font-mono-numbers text-cyan-400">LKR 0.00</div>
          </div>

          <!-- Action Buttons: Step 1 Lock -> Step 2 Pay -->
          <div class="space-y-3 pt-1">
            <button
              type="button"
              id="lock-seats-btn"
              disabled
              class="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-950 font-extrabold text-sm transition duration-150 shadow-lg shadow-cyan-500/15 flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <i class="fa-solid fa-lock text-xs"></i>
              <span>Lock Selected Seats (5 Min Hold)</span>
            </button>

            <button
              type="submit"
              id="proceed-payment-btn"
              disabled
              class="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800/70 disabled:text-slate-500 disabled:border disabled:border-slate-700 disabled:cursor-not-allowed text-slate-950 font-extrabold text-sm transition duration-150 flex items-center justify-center gap-2"
            >
              <i class="fa-solid fa-credit-card text-xs"></i>
              <span>Proceed to Payment</span>
            </button>
          </div>
        </form>
      </aside>

    </div>
  </main>

  <script>
    window.TRAVENTURE_BOOKING_CTX = <?= json_encode([
      'userID' => $sessionUserId,
      'username' => $sessionUsername
    ], JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT); ?>;
  </script>
  <script src="seatSelector.js"></script>
  <script src="booking_form.js"></script>
</body>
</html>
