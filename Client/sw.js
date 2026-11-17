/**
 * Traventure Offline-First PWA Service Worker
 *
 * Implements Stale-While-Revalidate caching for static assets,
 * Network-First with cache fallback for timetable APIs, and offline shell preservation.
 */

const CACHE_NAME = 'traventure-cache-v1';

const PRECACHE_ASSETS = [
  './assets/css/tailwind.css',
  './assets/js/offlineStore.js',
  './assets/js/pwa.js',
  './assets/icons/pwa-icon.svg',
  './assets/logo/logo.png',
  './manifest.json',
  './Train Schedule Form/scheduleForm.html',
  './Train Schedule Form/scheduleForm.js',
  './Train Schedule Form/scheduleMap.js',
  './Home/Home.html',
  './Bookinghistory/bookingHistory.php',
  './Bookinghistory/main.js',
  '../public/station_coordinates.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch((err) => {
        console.warn('[SW] Pre-caching non-fatal warning:', err);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Non-GET requests (e.g. POST seat lock, payment) always go directly to network
  if (req.method !== 'GET') {
    return;
  }

  const url = new URL(req.url);

  // Strategy 1: Railway Backend API Endpoints (Network-First, Cache Fallback)
  if (url.pathname.includes('/Server/api/')) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          if (cached) return cached;

          return new Response(
            JSON.stringify({
              success: false,
              offline: true,
              message: 'Offline mode active. Displaying cached hill-country timetables.'
            }),
            {
              headers: { 'Content-Type': 'application/json' },
              status: 503
            }
          );
        })
    );
    return;
  }

  // Strategy 2: Navigation Requests (Network-First with App Shell Fallback)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return networkRes;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          if (cached) return cached;
          return caches.match('./Train Schedule Form/scheduleForm.html');
        })
    );
    return;
  }

  // Strategy 3: Static UI Assets (Stale-While-Revalidate)
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      const fetchPromise = fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
