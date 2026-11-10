<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
$isLoggedIn = isset($_SESSION['username']);
$username = $isLoggedIn ? htmlspecialchars($_SESSION['username']) : '';
?>

<div class="fixed top-0 left-0 right-0 z-50 bg-[#040424]/90 backdrop-blur-md border-b border-slate-800/80 transition-all duration-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      
      <!-- Brand Logo -->
      <a href="../Home/Home.html" class="flex items-center gap-2.5 group">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-lg shadow-md shadow-cyan-500/20 group-hover:scale-105 transition">
          T
        </div>
        <span class="text-lg font-black tracking-tight text-white group-hover:text-cyan-400 transition">TRAVENTURE</span>
      </a>

      <!-- Desktop Nav Links -->
      <div class="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-300">
        <a href="../Home/Home.html" class="hover:text-cyan-400 transition">Home</a>
        <a href="../Train Schedule Form/scheduleForm.html" class="hover:text-cyan-400 transition flex items-center gap-1.5">
          <i class="fa-solid fa-train-subway text-xs text-cyan-400"></i>
          <span>Train Schedule</span>
        </a>
        <a href="../Destinations/destinations.html" class="hover:text-cyan-400 transition">Destinations</a>
        <a href="../About/About.html" class="hover:text-cyan-400 transition">About Us</a>
      </div>

      <!-- Auth Action / User Profile -->
      <div class="hidden md:flex items-center gap-3">
        <?php if ($isLoggedIn): ?>
          <a href="../Bookinghistory/bookingHistory.php" class="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5">
            <i class="fa-solid fa-ticket text-cyan-400"></i>
            <span>My Bookings</span>
          </a>
          <a href="../Profile/profile.php" class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition">
            <div class="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-xs font-bold">
              <?= strtoupper(substr($username, 0, 1)) ?>
            </div>
            <span class="text-xs font-semibold text-white"><?= $username ?></span>
          </a>
        <?php else: ?>
          <a href="../Login/LoginPage.html" class="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition active:scale-95">
            Log In
          </a>
        <?php endif; ?>
      </div>

      <!-- Mobile Menu Toggle -->
      <div class="md:hidden flex items-center">
        <button id="mobile-menu-toggle" type="button" class="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition">
          <i class="fa-solid fa-bars text-sm"></i>
        </button>
      </div>

    </div>
  </div>

  <!-- Mobile Dropdown Menu -->
  <div id="mobile-nav-drawer" class="hidden md:hidden px-4 pt-2 pb-4 space-y-2 bg-[#090934] border-b border-slate-800 text-sm font-semibold">
    <a href="../Home/Home.html" class="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition">Home</a>
    <a href="../Train Schedule Form/scheduleForm.html" class="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition">Train Schedule</a>
    <a href="../Destinations/destinations.html" class="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition">Destinations</a>
    <a href="../About/About.html" class="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition">About Us</a>
    
    <div class="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
      <?php if ($isLoggedIn): ?>
        <a href="../Bookinghistory/bookingHistory.php" class="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition">My Bookings</a>
        <a href="../Profile/profile.php" class="block px-3 py-2 rounded-lg text-cyan-400 font-bold hover:bg-slate-800 transition">My Profile (<?= $username ?>)</a>
      <?php else: ?>
        <a href="../Login/LoginPage.html" class="w-full text-center py-2.5 rounded-lg bg-cyan-500 text-slate-950 font-bold transition">Log In</a>
      <?php endif; ?>
    </div>
  </div>
</div>
