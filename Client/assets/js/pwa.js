/**
 * Traventure PWA & Ambient Connectivity Controller
 */
(function () {
  const SW_PATH = '../sw.js'; // Relative to pages in Client/* subdirectories
  let bannerEl = null;
  let bannerTimeout = null;

  function initServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        // Resolve SW path whether page is at /Client/ or /Client/Subdir/
        const isClientRoot = window.location.pathname.endsWith('/Client/') || window.location.pathname.endsWith('/Client/index.html');
        const swUrl = isClientRoot ? './sw.js' : '../sw.js';

        navigator.serviceWorker
          .register(swUrl)
          .then((reg) => {
            console.log('[PWA] Service Worker registered with scope:', reg.scope);
          })
          .catch((err) => {
            console.warn('[PWA] Service Worker registration failed:', err);
          });
      });
    }
  }

  function createBanner() {
    if (bannerEl) return bannerEl;

    bannerEl = document.createElement('div');
    bannerEl.id = 'traventure-connectivity-banner';
    bannerEl.className = 'hidden fixed top-0 left-0 right-0 z-[100] px-4 py-2.5 text-xs font-semibold backdrop-blur-md transition-all duration-300 shadow-xl border-b';
    document.body.prepend(bannerEl);
    return bannerEl;
  }

  function showOfflineBanner() {
    const el = createBanner();
    if (bannerTimeout) clearTimeout(bannerTimeout);

    el.className = 'fixed top-0 left-0 right-0 z-[100] px-4 py-2.5 text-xs font-semibold bg-[#090934]/95 border-b border-amber-500/50 text-amber-300 shadow-lg shadow-amber-950/40 flex items-center justify-between transition-all duration-300';
    el.innerHTML = `
      <div class="flex items-center gap-2.5">
        <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
        <i class="fa-solid fa-wifi-slash text-amber-400"></i>
        <span><strong>Offline Mode</strong> • Mountain tunnel or hill-country transit zone. Serving timetables from IndexedDB.</span>
      </div>
      <span class="hidden sm:inline-block text-[10px] uppercase font-mono-numbers px-2 py-0.5 rounded bg-amber-950/80 border border-amber-700/60 text-amber-300">
        IndexedDB Active
      </span>
    `;
    el.classList.remove('hidden');

    window.dispatchEvent(new CustomEvent('traventure:connectivity', { detail: { online: false } }));
  }

  function showOnlineBanner() {
    const el = createBanner();
    if (bannerTimeout) clearTimeout(bannerTimeout);

    el.className = 'fixed top-0 left-0 right-0 z-[100] px-4 py-2.5 text-xs font-semibold bg-[#090934]/95 border-b border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-950/40 flex items-center justify-between transition-all duration-300';
    el.innerHTML = `
      <div class="flex items-center gap-2.5">
        <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
        <i class="fa-solid fa-circle-check text-emerald-400"></i>
        <span><strong>Reconnected</strong> • Live railway schedule feeds and real-time seat locks restored.</span>
      </div>
      <span class="hidden sm:inline-block text-[10px] uppercase font-mono-numbers px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/60 text-emerald-300">
        Live Sync
      </span>
    `;
    el.classList.remove('hidden');

    window.dispatchEvent(new CustomEvent('traventure:connectivity', { detail: { online: true } }));

    // Automatically synchronize pending offline outbox queue actions
    if (window.TraventureStore && typeof window.TraventureStore.flushOutboxQueue === 'function') {
      window.TraventureStore.flushOutboxQueue()
        .then((syncedCount) => {
          if (syncedCount > 0) {
            console.log(`[PWA Sync] Automatically flushed ${syncedCount} queued action(s) to cloud.`);
          }
        })
        .catch((err) => {
          console.warn('[PWA Sync] Background outbox flush error:', err);
        });
    }

    bannerTimeout = setTimeout(() => {
      el.classList.add('hidden');
    }, 3500);
  }

  let deferredPrompt = null;

  function setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;

      // Provide native 1-click PWA install pill in the ambient banner
      const banner = createBanner();
      if (!document.getElementById('pwa-install-pill')) {
        const installPill = document.createElement('button');
        installPill.id = 'pwa-install-pill';
        installPill.type = 'button';
        installPill.className = 'ml-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition active:scale-95';
        installPill.innerHTML = `<i class="fa-solid fa-download text-[11px]"></i><span>Install Traventure App</span>`;
        installPill.addEventListener('click', async () => {
          if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
              installPill.remove();
            }
            deferredPrompt = null;
          }
        });
        banner.appendChild(installPill);
      }
    });
  }

  function setupConnectivityListeners() {
    window.addEventListener('offline', () => {
      showOfflineBanner();
    });

    window.addEventListener('online', () => {
      showOnlineBanner();
    });

    // Check initial state
    if (!navigator.onLine) {
      showOfflineBanner();
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initServiceWorker();
    setupConnectivityListeners();
    setupInstallPrompt();
  });

  window.TraventurePWA = {
    isOnline: () => navigator.onLine,
    showOfflineBanner,
    showOnlineBanner
  };
})();
