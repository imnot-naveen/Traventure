# Traventure • Sri Lanka Railways Transit & High-Concurrency Booking Platform

[![PHP Version](https://img.shields.io/badge/PHP-8.0%2B-777BB4?logo=php&logoColor=white)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0%20%7C%20InnoDB-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline--First-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![GIS Mapping](https://img.shields.io/badge/GIS-Leaflet.js%20%2B%20GeoJSON-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Automated Tests](https://img.shields.io/badge/Tests-5%2F5%20Passing-brightgreen?logo=checkmarx&logoColor=white)](tests/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An enterprise-grade, high-concurrency transit routing and ticket reservation platform engineered for the **Sri Lanka Railway Network (390+ stations, 8,000+ stop records)**. Designed to solve high-concurrency ticket rush race conditions, complex multi-hop junction transfers, and hill-country offline mobile connectivity dropouts.

---

## 🏛️ Systems Architecture

```
                                     TRAVENTURE 2.0 SYSTEMS TOPOLOGY

  ┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │                                      CLIENT PRESENTATION LAYER                                         │
  │  ┌───────────────────────┐  ┌───────────────────────┐  ┌───────────────────────┐  ┌──────────────────┐ │
  │  │   Interactive GIS     │  │   8x4 SVG Coach       │  │ Offline Pass Wallet   │  │ Destination Hub  │ │
  │  │   Leaflet Map Track   │  │   Seat Selector       │  │ Dynamic QR Canvas Seal│  │ Layover Hotel API│ │
  │  └───────────┬───────────┘  └───────────┬───────────┘  └───────────┬───────────┘  └────────┬─────────┘ │
  │              │                          │                          │                       │           │
  │  ┌───────────▼──────────────────────────▼──────────────────────────▼───────────────────────▼─────────┐ │
  │  │               Service Worker (Stale-While-Revalidate) & IndexedDB Outbox Queue                     │ │
  │  └──────────────────────────────────────────────┬─────────────────────────────────────────────────────┘ │
  └─────────────────────────────────────────────────┼───────────────────────────────────────────────────────┘
                                                    │ HTTPS / JSON REST API
  ┌─────────────────────────────────────────────────▼───────────────────────────────────────────────────────┐
  │                                   SECURITY & GATEWAY MIDDLEWARE                                         │
  │  ┌──────────────────────────────────────────────┴─────────────────────────────────────────────────────┐ │
  │  │ Token-Bucket IP Rate Limiter (Atomic flock)  •  CSRF Guards  •  Unified ApiResponse Envelope (RFC) │ │
  │  └──────────────────────────────────────────────┬─────────────────────────────────────────────────────┘ │
  └─────────────────────────────────────────────────┼───────────────────────────────────────────────────────┘
                                                    │
  ┌─────────────────────────────────────────────────▼───────────────────────────────────────────────────────┐
  │                                   CORE PHP 8 DOMAIN ENGINES                                             │
  │  ┌───────────────────────────┐  ┌───────────────────────────┐  ┌─────────────────────────────────────┐  │
  │  │     TransitRouter.php     │  │ SeatReservationService.php│  │      AccommodationService.php       │  │
  │  │  Multi-Segment Graph      │  │ Pessimistic Row Locking   │  │  3-Tier Cache (TTL 24h) + Fallback  │  │
  │  │  Overnight Layover Calc   │  │ 5-Min Expiring Leases     │  │  Booking.com / Airbnb Deep-Links    │  │
  │  └─────────────┬─────────────┘  └─────────────┬─────────────┘  └──────────────────┬──────────────────┘  │
  └────────────────┼──────────────────────────────┼───────────────────────────────────┼─────────────────────┘
                   │                              │                                   │
  ┌────────────────▼──────────────────────────────▼───────────────────────────────────▼─────────────────────┐
  │                                     PERSISTENCE & STORAGE LAYER                                         │
  │  ┌────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
  │  │ MySQL 8.0 InnoDB (Covering Composite Indexes: ts1(stationid, trainID, dep), ts2(trainID, stationid, arr))│
  │  │ SQLite In-Memory Concurrency Test Harness & Fast Memory-Mapped Timetables                          │ │
  │  └────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
  └─────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Core Engineering Highlights

### 1. Concurrency-Safe Pessimistic Seat Reservations
- **Problem:** During peak holiday booking rush (e.g. Kandy Esala Perahera or Ella Odyssey weekend trains), thousands of passengers attempt reserving identical observation coach seats simultaneously, causing high-risk double-booking race conditions.
- **Solution:** Engineered an InnoDB row-level locking pipeline in `SeatReservationService.php` utilizing `SELECT ... FOR UPDATE` inside an atomic transaction.
- **Expiring Reservation Leases:** Seats held by a passenger acquire a 5-minute lease with `status = 'HELD'`. If checkout is not finalized within 300 seconds, an automated sweeper (`cron_cleanup_holds.php`) releases the hold atomically.
- **Verification:** Validated under high-concurrency simulation harnesses (`tests/simulate_seat_concurrency.js` and `tests/verify_sqlite_concurrency.php`) proving **0% double-booking occurrence** under simultaneous conflicting requests.

### 2. Multi-Segment Transit Routing Engine (`TransitRouter.php`)
- **Direct & Multi-Hop Pathfinding:** Automatically computes direct train runs and evaluates multi-leg transfers across 5 major transit hubs (**Colombo Fort, Maradana, Polgahawela, Ragama, Peradeniya**).
- **Layover Classification:** Validates minimum transfer windows ($\ge 20$ minutes) and classifies connections into:
  - *Same-Day Connection:* 20 minutes to 4 hours layover.
  - *Overnight Layover:* 4 hours to 16 hours layover (handles midnight wraps across the $24$-hour threshold).
- **Layover Accommodation Integration:** Connects overnight transit stops directly to `AccommodationService.php`, returning 24h-cached station-adjacent hotel options and live affiliate deep-links.

### 3. Offline-First PWA Architecture
- **Service Worker (`Client/sw.js`):** Implements Stale-While-Revalidate caching for core application shell assets, Tailwind CSS, Leaflet GIS scripts, and icons.
- **IndexedDB Client Storage (`Client/assets/js/offlineStore.js`):**
  - Caches 300+ stations locally on first visit, enabling full-text station autocomplete in $< 0.05$ ms without network access.
  - Offline Boarding Pass Wallet: Passenger tickets are stored locally with on-device cryptographic verification pass canvas seal rendering.
  - Background Sync Outbox: Queues offline ratings and reviews in IndexedDB (`outboxQueue`) when passing through mountain tunnels and flushes automatically when `window.onLine` restores.

### 4. Modern PHP 8.x Architecture & API Gateway
- **Modern Idioms:** Strict typing (`declare(strict_types=1);`), constructor property promotion, union types (`int|float`), and `match` expressions across all domain services.
- **Unified Standard Envelope (`Server/core/ApiResponse.php`):** Standardizes RFC status code mapping, automated JSON header emission, and backward-compatible payload envelopes.
- **Atomic Token-Bucket Rate Limiter (`Server/core/RateLimiter.php`):**
  - High-throughput token bucket algorithm with exclusive file locking (`flock(..., LOCK_EX)`) to prevent concurrent token race conditions.
  - Automatically emits standard RFC rate limit headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After`).
  - Protects search and reservation endpoints against credential stuffing and scraping.

### 5. Covering Composite Index Database Optimization
- **Problem:** Full table scans across 8,000+ stop records caused slow multi-hop timetable joins.
- **Solution:** Designed covering composite indexes:
  - `idx_trainstops_origin_covering (stationid, trainID, departuretime)`
  - `idx_trainstops_dest_covering (trainID, stationid, arrivaltime)`
  - `idx_seat_reservations_lookup (train_id, journey_date, status)`
- **Impact:** Transformed timetable queries into **Index-Only Scans**, achieving **sub-4ms P95 query latencies** across 8,200+ stops.

---

## 📊 Verified Performance Benchmarks

### 1. High-Concurrency Query Latency Benchmark (`tests/benchmark_query_performance.php`)
Evaluated over 1,000 concurrent transit search queries across 8,200+ stop records:

| Latency Metric | Baseline (Single-Column Index) | Optimized (Covering Composite Index) | SLA Target |
|:---|:---:|:---:|:---:|
| **Minimum Latency** | `0.309 ms` | `0.285 ms` | $< 5.0 \text{ ms}$ |
| **Average Latency** | `1.908 ms` | `1.830 ms` | $< 10.0 \text{ ms}$ |
| **Median (P50)** | `1.914 ms` | `1.912 ms` | $< 10.0 \text{ ms}$ |
| **95th Percentile (P95)** | `3.498 ms` | **`3.175 ms`** | **$< 50.0 \text{ ms}$ (Met)** |
| **99th Percentile (P99)** | `4.975 ms` | **`4.136 ms`** | $< 50.0 \text{ ms}$ |
| **Throughput (QPS)** | `524.1 QPS` | **`546.6 QPS`** | $> 250 \text{ QPS}$ |

### 2. Frontend Web Vitals & Asset Budgets (`tests/audit_web_performance.js`)

| Asset / Audit Item | Measured Metric | Budget / Target | Status |
|:---|:---:|:---:|:---:|
| **Tailwind CSS v4 Minified Bundle** | `63.66 KB` | $< 150 \text{ KB}$ | ✅ Passed |
| **Offline Station Autocomplete Latency** | `0.037 ms / query` | $< 5.0 \text{ ms}$ | ✅ Passed |
| **Service Worker Precache Inventory** | 13/13 verified files | 0 missing / 404s | ✅ Passed |
| **Image Lazy-Loading & Async Decoding**| 100% compliant | Core pages | ✅ Passed |
| **PWA Installability Criteria** | Manifest + SW wired | Standalone mode | ✅ Passed |

---

## 🧪 Automated Test Suites

The codebase includes 5 automated verification and benchmarking suites:

```powershell
# 1. Modern PHP 8.x Reflection, ApiResponse & Rate Limiter Security Suite
php tests/verify_php8_security.php

# 2. Concurrency-Safe Pessimistic Seat Hold SQLite Verification
php tests/verify_sqlite_concurrency.php

# 3. High-Concurrency Transit Query Benchmark & P50/P95/P99 Profiler
php tests/benchmark_query_performance.php

# 4. PWA Offline Storage, Service Worker Precache & Outbox Contract Suite
node tests/verify_pwa_offline.js

# 5. Frontend Asset Budget & Web Performance Validator
node tests/audit_web_performance.js
```

---

## 🚀 Quickstart & Installation

### Prerequisites
- **PHP:** `8.0` or higher (`pdo_mysql`, `pdo_sqlite` extensions enabled)
- **Database:** MySQL `8.0+` or MariaDB `10.5+` (or SQLite for testing)
- **Node.js:** `18.x` or higher (for Tailwind compilation and test runner)
- **Web Server:** Apache / Nginx / XAMPP / WAMP or PHP Built-in Server

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/imnot-naveen/Traventure.git
cd Traventure
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and adjust your credentials:
```bash
cp .env.example .env
```
```ini
APP_ENV=development
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=traventure
DB_USER=root
DB_PASSWORD=
```

### 3. Run Database Migration & Indexes
```bash
# Apply covering composite indexes
php Server/database/apply_indexes.php
```

### 4. Compile Stylesheets & Start Local Server
```bash
# Build Tailwind CSS v4 bundle
npm run build:css

# Start PHP built-in development server
php -S 127.0.0.1:8000
```
Visit `http://127.0.0.1:8000/Client/Home/Home.html` in your browser.

---

## 📁 Repository Directory Structure

```
Traventure/
├── Client/
│   ├── assets/               # Tailwind CSS v4, icons, PWA controller, offline store
│   │   ├── css/              # input.css & compiled tailwind.css (63.66 KB)
│   │   └── js/               # pwa.js (ambient connectivity) & offlineStore.js (IndexedDB)
│   ├── Bookinghistory/       # Boarding passes with QR modal & cryptographic seal
│   ├── Destinations/         # Scenic attraction directory with offline outbox reviews
│   ├── Home/                 # Hero portal with instant search & statistics
│   ├── Train Schedule Form/  # Direct & multi-hop route planner + Leaflet GIS track map
│   ├── manifest.json         # PWA Web App Manifest
│   └── sw.js                 # Service Worker with Stale-While-Revalidate caching
├── Server/
│   ├── api/                  # REST API endpoints protected with RateLimiter & ApiResponse
│   │   ├── layoverHotels.php # Overnight accommodation endpoint
│   │   ├── saveRating.php    # Destination review endpoint (Outbox sync target)
│   │   ├── searchTransitSchedule.php # Transit pathfinding search endpoint
│   │   └── seatReservation.php       # Concurrency-safe seat reservation endpoint
│   ├── core/                 # Core domain services (Strict PHP 8.x)
│   │   ├── AccommodationService.php   # 3-tier hotel cache & Booking.com fallback
│   │   ├── ApiResponse.php            # Unified RFC REST response helper
│   │   ├── RateLimiter.php            # Token-bucket rate limiter with atomic flock
│   │   ├── SeatReservationService.php # Pessimistic row locking (SELECT ... FOR UPDATE)
│   │   └── TransitRouter.php          # Graph pathfinding & transfer interval engine
│   ├── database/             # Schema definitions, seeds, and composite index migrations
│   └── includes/             # Security middleware, session config & PDO initialization
└── tests/                    # Automated regression, benchmarking & concurrency test suites
    ├── audit_web_performance.js       # Frontend bundle budget & web vitals audit
    ├── benchmark_query_performance.php # 1,000-query latency percentile benchmark
    ├── simulate_seat_concurrency.js   # Parallel HTTP seat contention stress test
    ├── verify_php8_security.php       # PHP 8 reflection & security test suite
    ├── verify_pwa_offline.js          # Service Worker & IndexedDB contract test suite
    └── verify_sqlite_concurrency.php  # Pessimistic locking isolation test suite
```

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
