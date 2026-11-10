<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['username'])) {
    header("Location: ../Login/LoginPage.html");
    exit();
}

$username = htmlspecialchars($_SESSION['username']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Bookings & Boarding Passes | Traventure</title>
    <!-- Tailwind CSS -->
    <link rel="stylesheet" href="../assets/css/tailwind.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">
    <style>
      body { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; }
      .font-mono-numbers { font-family: 'JetBrains Mono', monospace; }
    </style>
</head>
<body class="bg-[#040424] text-slate-100 min-h-screen flex flex-col antialiased">
    
    <!-- Navbar Component -->
    <nav id="navbar-placeholder" class="relative z-50"></nav>

    <main class="flex-1 pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/40 text-cyan-300 text-xs font-semibold mb-2">
                    <i class="fa-solid fa-ticket text-cyan-400"></i>
                    <span>Passenger Portal</span>
                </div>
                <h1 class="text-2xl sm:text-3xl font-extrabold text-white">Your Railway Boarding Passes</h1>
                <p class="text-slate-400 text-xs sm:text-sm mt-1">Review your confirmed itineraries, seat classes, and digital boarding tickets.</p>
            </div>
            <a href="../Train Schedule Form/scheduleForm.html" class="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-2 shadow-md">
                <i class="fa-solid fa-plus"></i>
                <span>Book Another Journey</span>
            </a>
        </div>

        <!-- Filter Controls -->
        <div class="bg-[#090934]/90 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl">
            <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div class="sm:col-span-5 relative">
                    <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                    <input
                        type="text"
                        id="search-input"
                        placeholder="Search by destination or train..."
                        class="w-full bg-[#040424] border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs font-medium"
                    >
                </div>
                <div class="sm:col-span-4 flex items-center gap-2">
                    <input
                        type="date"
                        id="date-from"
                        class="w-full bg-[#040424] border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 text-xs [color-scheme:dark]"
                    >
                    <span class="text-slate-500 text-xs font-bold">to</span>
                    <input
                        type="date"
                        id="date-to"
                        class="w-full bg-[#040424] border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 text-xs [color-scheme:dark]"
                    >
                </div>
                <div class="sm:col-span-3 flex items-center gap-2">
                    <button id="search-btn" class="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition">
                        Filter
                    </button>
                    <select id="filter-status" class="bg-[#040424] border border-slate-700/80 rounded-xl px-3 py-2.5 text-slate-300 text-xs focus:outline-none focus:border-cyan-400">
                        <option value="all">All</option>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Bookings Container -->
        <div class="space-y-6">
            <!-- Loading Spinner -->
            <div id="loading-spinner" class="text-center py-16">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-cyan-500/20 border-t-cyan-400 mb-3"></div>
                <p class="text-slate-400 text-xs font-medium">Loading your boarding passes...</p>
            </div>
            
            <!-- Error State -->
            <div id="error-message" class="hidden text-center py-12 bg-rose-950/20 border border-rose-900/40 rounded-2xl p-6">
                <p class="text-rose-400 text-xs font-semibold mb-3">Could not load booking history.</p>
                <button id="retry-btn" class="px-4 py-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-white text-xs font-semibold transition">Retry</button>
            </div>
            
            <!-- Empty State -->
            <div id="no-results" class="hidden text-center py-16 bg-[#090934]/60 border border-slate-800 rounded-2xl p-8">
                <i class="fa-solid fa-ticket-simple text-4xl text-slate-600 mb-3"></i>
                <h3 class="text-base font-bold text-white mb-1">No Bookings Found</h3>
                <p class="text-xs text-slate-400 max-w-sm mx-auto">You haven't reserved any train journeys yet. Explore our live timetable to book your first trip!</p>
            </div>
            
            <!-- List of Boarding Pass Cards -->
            <div id="booking-list" class="hidden space-y-4"></div>

            <!-- Pagination -->
            <div class="flex items-center justify-between pt-6 border-t border-slate-800/80 text-xs text-slate-400">
                <span id="page-info">Page 1 of 1</span>
                <div class="flex items-center gap-2">
                    <button id="prev-page" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition">Previous</button>
                    <button id="next-page" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition">Next</button>
                </div>
            </div>
        </div>

    </main>

    <!-- Footer -->
    <footer id="footer" class="mt-auto py-8 text-center text-xs text-slate-500 border-t border-slate-800/80">
        <p>© 2026 Traventure • Digital Railway Ticketing</p>
    </footer>

    <!-- ========================================================================= -->
    <!-- YOUR HANDS-ON MISSION: THE DIGITAL BOARDING PASS CARD TEMPLATE            -->
    <!-- ========================================================================= -->
    <template id="booking-template">
        <!-- Replace/Style this template to look like a sleek digital boarding pass! -->
        <div class="booking-card bg-[#090934]/90 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-6 shadow-xl transition space-y-4 relative overflow-hidden group">
            
            <!-- Header: Train Name + Status Badge -->
            <div class="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-800/50 flex items-center justify-center text-cyan-400 text-sm">
                        <i class="fa-solid fa-train"></i>
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <h3 class="train-name font-bold text-white text-sm"></h3>
                            <span class="train-number text-[11px] font-mono-numbers px-2 py-0.5 rounded bg-slate-800 text-slate-300"></span>
                        </div>
                        <span class="text-[11px] text-slate-400">Booking ID: <strong class="booking-id-value text-slate-300 font-mono-numbers"></strong></span>
                    </div>
                </div>
                <span class="booking-status text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800/50"></span>
            </div>

            <!-- Journey Stations & Timeline -->
            <div class="flex items-center justify-between gap-4 py-2">
                <div class="text-left">
                    <span class="text-[11px] uppercase tracking-wider text-slate-500 font-bold block">From</span>
                    <span class="from-station-name text-sm sm:text-base font-bold text-white"></span>
                    <span class="departure-time text-xs font-mono-numbers text-slate-400 block mt-0.5"></span>
                </div>

                <div class="flex-1 flex flex-col items-center px-4">
                    <span class="journey-date-value text-[11px] font-medium text-cyan-400 mb-1"></span>
                    <div class="w-full flex items-center">
                        <div class="w-2 h-2 rounded-full bg-cyan-400"></div>
                        <div class="h-0.5 flex-1 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500"></div>
                        <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                    <span class="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-semibold">One-Way Ticket</span>
                </div>

                <div class="text-right">
                    <span class="text-[11px] uppercase tracking-wider text-slate-500 font-bold block">To</span>
                    <span class="to-station-name text-sm sm:text-base font-bold text-white"></span>
                    <span class="arrival-time text-xs font-mono-numbers text-slate-400 block mt-0.5"></span>
                </div>
            </div>

            <!-- Footer: Passengers, Class, Fare, and Actions -->
            <div class="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                <div class="flex items-center gap-4">
                    <div>
                        <span class="text-slate-500 text-[11px]">Passengers:</span>
                        <strong class="passenger-count-value text-white ml-1 font-mono-numbers"></strong>
                    </div>
                    <div>
                        <span class="text-slate-500 text-[11px]">Class:</span>
                        <strong class="class-value text-cyan-400 ml-1"></strong>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <div class="text-right mr-2">
                        <span class="text-slate-500 text-[11px]">Fare:</span>
                        <strong class="price-value text-white ml-1 font-mono-numbers text-sm font-bold"></strong>
                    </div>
                    <button type="button" class="view-qr-btn px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-semibold text-xs border border-cyan-500/30 transition flex items-center gap-1.5">
                        <i class="fa-solid fa-qrcode"></i>
                        <span>Boarding QR</span>
                    </button>
                    <button type="button" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5" onclick="window.print()">
                        <i class="fa-solid fa-print"></i>
                        <span>Print</span>
                    </button>
                </div>
            </div>

        </div>
    </template>

    <!-- Digital Boarding Pass QR Modal -->
    <div id="qr-modal" class="hidden fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-[#090934] border border-slate-700/80 rounded-2xl w-full max-w-sm flex flex-col items-center p-6 shadow-2xl relative text-center">
        <!-- Close Button -->
        <button id="close-qr-modal-btn" type="button" class="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition">
          <i class="fa-solid fa-xmark text-sm"></i>
        </button>

        <!-- Verification Badge -->
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-300 text-xs font-semibold mb-4">
          <i class="fa-solid fa-shield-halved text-cyan-400"></i>
          <span>Official Verification Code</span>
        </div>

        <h3 id="qr-modal-booking-id" class="text-base font-bold text-white font-mono-numbers">TRV-1005-492</h3>
        <p id="qr-modal-train-info" class="text-xs text-slate-400 mt-0.5">Express Train (#1005)</p>
        <p id="qr-modal-passenger-info" class="text-xs text-cyan-400 font-semibold mt-1">2 Passengers • Confirmed</p>

        <!-- QR Image Display -->
        <div class="mt-5 p-3 rounded-2xl bg-white/5 border border-slate-700/60 shadow-inner">
          <img id="qr-modal-img" src="" alt="Boarding Pass QR" class="w-52 h-52 object-contain rounded-lg" />
        </div>

        <p class="text-[11px] text-slate-500 mt-4 leading-relaxed">
          Present this dynamic cryptographic QR code to railway staff or station ticket gates for inspection.
        </p>
      </div>
    </div>

    <!-- Scripts -->
    <script src="../Navbar/navbar.js"></script>
    <script type="module" src="main.js"></script>
    <script>
      document.addEventListener("DOMContentLoaded", () => {
        fetch("../Navbar/navbar.php")
          .then(res => res.text())
          .then(html => {
            const el = document.getElementById("navbar-placeholder");
            if (el) {
              el.innerHTML = html;
              if (window.setupNavbarToggle) window.setupNavbarToggle();
            }
          }).catch(() => {});
      });
    </script>
</body>
</html>
