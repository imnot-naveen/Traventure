/**
 * Traventure Client-Side IndexedDB Offline Timetable & Station Store
 *
 * Provides resilient offline storage for 390+ railway stations and
 * cached multi-leg transit itineraries across cellular dead-zones (hill-country tunnels).
 */

(function () {
  const DB_NAME = 'traventure_offline_db';
  const DB_VERSION = 2;

  let dbPromise = null;

  function openDatabase() {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject(new Error('IndexedDB not supported in this browser.'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Store 1: Station Master Records
        if (!db.objectStoreNames.contains('stations')) {
          const stationStore = db.createObjectStore('stations', { keyPath: 'StationID' });
          stationStore.createIndex('name', 'name', { unique: false });
        }

        // Store 2: Cached Timetable Queries
        if (!db.objectStoreNames.contains('cachedTimetables')) {
          const timetableStore = db.createObjectStore('cachedTimetables', { keyPath: 'cacheKey' });
          timetableStore.createIndex('cachedAt', 'cachedAt', { unique: false });
        }

        // Store 3: User Booked Itineraries & Boarding Passes
        if (!db.objectStoreNames.contains('userBookings')) {
          db.createObjectStore('userBookings', { keyPath: 'bookingID' });
        }

        // Store 4: Outbox Sync Queue for Offline Submissions
        if (!db.objectStoreNames.contains('outboxQueue')) {
          const outboxStore = db.createObjectStore('outboxQueue', { keyPath: 'id', autoIncrement: true });
          outboxStore.createIndex('actionType', 'actionType', { unique: false });
          outboxStore.createIndex('status', 'status', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        console.error('[IndexedDB] Connection error:', event.target.error);
        reject(event.target.error);
      };
    });

    return dbPromise;
  }

  /**
   * Bulk-saves station master records into the 'stations' store.
   */
  async function saveStations(stations) {
    if (!Array.isArray(stations) || stations.length === 0) return 0;
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const tx = db.transaction('stations', 'readwrite');
      const store = tx.objectStore('stations');

      stations.forEach((station) => {
        const stationId = Number(station.StationID || station.stationID || station.id);
        if (stationId) {
          store.put({
            StationID: stationId,
            name: station.name || station.stationName || `Station #${stationId}`,
            latitude: station.latitude || null,
            longitude: station.longitude || null
          });
        }
      });

      tx.oncomplete = () => resolve(stations.length);
      tx.onerror = () => reject(tx.error);
    });
  }

  /**
   * Retrieves all cached stations from IndexedDB.
   */
  async function getAllStations() {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const tx = db.transaction('stations', 'readonly');
      const store = tx.objectStore('stations');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Retrieves a cached timetable search by origin, destination, and journey date.
   */
  async function getCachedTimetable(originId, destId, date) {
    const db = await openDatabase();
    const cacheKey = `${originId}_${destId}_${date}`;

    return new Promise((resolve, reject) => {
      const tx = db.transaction('cachedTimetables', 'readonly');
      const store = tx.objectStore('cachedTimetables');
      const request = store.get(cacheKey);

      request.onsuccess = () => resolve(request.result ? request.result.data : null);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Saves or updates a user boarding pass in IndexedDB for offline ticket presentation.
   */
  async function cacheBooking(booking) {
    if (!booking || !booking.bookingID) return;
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const tx = db.transaction('userBookings', 'readwrite');
      const store = tx.objectStore('userBookings');
      store.put({
        ...booking,
        cachedAt: Date.now()
      });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  /**
   * Bulk-saves an array of user bookings into IndexedDB for offline digital wallet access.
   */
  async function cacheAllBookings(bookings) {
    if (!Array.isArray(bookings) || bookings.length === 0) return 0;
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const tx = db.transaction('userBookings', 'readwrite');
      const store = tx.objectStore('userBookings');

      bookings.forEach((booking) => {
        if (booking && (booking.bookingID || booking.id)) {
          const bookingID = Number(booking.bookingID || booking.id);
          store.put({
            ...booking,
            bookingID,
            cachedAt: Date.now()
          });
        }
      });

      tx.oncomplete = () => resolve(bookings.length);
      tx.onerror = () => reject(tx.error);
    });
  }

  /**
   * Retrieves all cached user bookings from IndexedDB.
   */
  async function getAllBookings() {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const tx = db.transaction('userBookings', 'readonly');
      const store = tx.objectStore('userBookings');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Caches a multi-leg timetable query response in IndexedDB.
   */
  async function cacheTimetable(originId, destId, date, data) {
    const cacheKey = `${originId}_${destId}_${date}`;
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const tx = db.transaction('cachedTimetables', 'readwrite');
      const store = tx.objectStore('cachedTimetables');
      const record = {
        cacheKey,
        originId: Number(originId),
        destId: Number(destId),
        date,
        data,
        cachedAt: Date.now()
      };
      store.put(record);
      tx.oncomplete = () => resolve(record);
      tx.onerror = () => reject(tx.error);
    });
  }

  /**
   * Performs an instant client-side offline fuzzy search across cached stations.
   */
  async function searchOfflineStations(query, limit = 10) {
    const stations = await getAllStations();
    if (!query || !query.trim()) {
      return stations.slice(0, limit);
    }
    const q = query.trim().toLowerCase();
    const matches = stations.filter((station) => station.name && station.name.toLowerCase().includes(q));

    matches.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (nameA === q && nameB !== q) return -1;
      if (nameA !== q && nameB === q) return 1;

      const aStarts = nameA.startsWith(q);
      const bStarts = nameB.startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      return nameA.localeCompare(nameB);
    });

    return matches.slice(0, limit);
  }

  /**
   * Enqueues an action into the outbox queue when offline.
   */
  async function queueOutboxAction(actionType, payload) {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const tx = db.transaction('outboxQueue', 'readwrite');
      const store = tx.objectStore('outboxQueue');
      const item = {
        actionType,
        payload,
        status: 'PENDING',
        createdAt: Date.now()
      };
      const req = store.add(item);
      req.onsuccess = () => resolve(req.result);
      tx.oncomplete = () => { };
      tx.onerror = () => reject(tx.error);
    });
  }

  /**
   * Retrieves all pending actions from the outbox queue.
   */
  async function getPendingOutboxActions() {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const tx = db.transaction('outboxQueue', 'readonly');
      const store = tx.objectStore('outboxQueue');
      const req = store.getAll();

      req.onsuccess = () => {
        const all = req.result || [];
        resolve(all.filter((item) => item.status === 'PENDING'));
      };
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Removes an outbox action once successfully synchronized with the backend.
   */
  async function markOutboxActionComplete(id) {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const tx = db.transaction('outboxQueue', 'readwrite');
      const store = tx.objectStore('outboxQueue');
      store.delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  /**
   * Flushes and synchronizes any pending offline outbox actions with the cloud backend.
   *
   * @returns {Promise<number>} Number of successfully synchronized actions.
   */
  async function flushOutboxQueue() {
    if (!navigator.onLine) {
      return 0;
    }
    const pending = await getPendingOutboxActions();
    if (!pending || pending.length === 0) {
      return 0;
    }

    let syncedCount = 0;
    for (const item of pending) {
      try {
        if (item.actionType === 'SAVE_RATING') {
          const response = await fetch('../../Server/api/saveRating.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.payload)
          });

          if (response.ok) {
            await markOutboxActionComplete(item.id);
            syncedCount++;
          }
        }
      } catch (err) {
        console.warn(`[Outbox Sync] Action #${item.id} sync deferred:`, err);
      }
    }
    return syncedCount;
  }

  window.TraventureStore = {
    openDatabase,
    saveStations,
    getAllStations,
    getCachedTimetable,
    cacheBooking,
    cacheAllBookings,
    getAllBookings,
    cacheTimetable,
    searchOfflineStations,
    queueOutboxAction,
    getPendingOutboxActions,
    markOutboxActionComplete,
    flushOutboxQueue
  };
})();
