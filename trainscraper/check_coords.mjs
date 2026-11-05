// Validate fuzzy matches using lat/long from stops pages + coastal route ordering.
import fs from "node:fs";
import path from "node:path";
const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\//, "").replace(/^([A-Za-z]:)/, "$1"));
const STATE = path.join(DIR, "state");
const load = (f, d) => { try { return JSON.parse(fs.readFileSync(path.join(STATE, f), "utf8")); } catch { return d; } };

const stopsData = load("stops.json", {});
const master = load("stationmaster.json", []);
const theirs = load("theirstations.json", { stations: [], routes: [] });
const nameOf = id => (master.find(m => m.id === id) || {}).name;

// 1. collect coords per source station id from stops pages
const coords = {}; // srcId -> {lat,lng,n}
const decStationCode = code => {
  const a = code.split("").map(c => (c >= "a" && c <= "z") ? c.charCodeAt(0) - 97 : c.charCodeAt(0) - 48 + 26);
  return a[0] + 36 * a[1] + 1296 * a[2] - 123;
};
for (const v of Object.values(stopsData)) {
  if (!v.stops) continue;
  for (const e of v.stops) {
    const m = (e.stationProfileURL || "").match(/\/station\/([a-z0-9]+)\//);
    if (!m) continue;
    const id = decStationCode(m[1]);
    const lat = Number(e.latitude), lng = Number(e.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
    if (lat === 0 && lng === 0) continue;
    (coords[id] ||= { lat: 0, lng: 0, n: 0 });
    coords[id].lat += lat; coords[id].lng += lng; coords[id].n++;
  }
}
for (const k of Object.keys(coords)) { coords[k].lat /= coords[k].n; coords[k].lng /= coords[k].n; }

const norm = s => (s || "").toLowerCase().replace(/\s+/g, " ").trim();
const fuzzyKey = s => norm(s).replace(/[^a-z0-9]/g, "");
const lev = (a, b) => {
  const m = a.length, n = b.length;
  if (!m || !n) return Math.max(m, n);
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) { const cur = [i]; for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = cur; }
  return prev[n];
};

// 2. recompute the fuzzy pairs exactly as build.mjs does
const theirByNorm = new Map();
for (const s of theirs.stations) { const k = norm(s.name); if (!theirByNorm.has(k)) theirByNorm.set(k, []); theirByNorm.get(k).push(s.stationID); }
const matchedSrc = new Set(); const fuzzyMatches = [];
for (const m of master) { const hit = theirByNorm.get(norm(m.name)); if (hit && hit.length === 1) matchedSrc.add(m.id); }
const fuzzyCandidates = theirs.stations.filter(s => !theirs.stations.some(x => norm(x.name) === norm(s.name) && false));
const usedTsl = new Set();
for (const m of master) {
  if (matchedSrc.has(m.id)) continue;
  const a = fuzzyKey(m.name);
  let best = null;
  for (const s of theirs.stations) {
    if (usedTsl.has(s.stationID)) continue;
    const b = fuzzyKey(s.name);
    const d = lev(a, b);
    const tol = Math.max(1, Math.floor(Math.max(a.length, b.length) * 0.25));
    if (d <= tol && (!best || d < best.d)) best = { d, s };
  }
  if (best) { fuzzyMatches.push({ src: m.id, srcName: m.name, tsl: best.s.stationID, tslName: best.s.name, d: best.d }); usedTsl.add(best.s.stationID); }
}

// 3. their coastal order index
const coastal = theirs.routes[0].orderedStations.split(",").map(Number);
const tslIdx = new Map(coastal.map((id, i) => [id, i]));

console.log("fuzzy match coordinate check (coastal line runs ~lat 6.0-7.0, lon 79.8-80.2):");
for (const f of fuzzyMatches) {
  const c = coords[f.src];
  const i = tslIdx.get(f.tsl);
  const cstr = c ? `src(${c.lat.toFixed(4)},${c.lng.toFixed(4)})` : "src(NO COORDS)";
  console.log(`  ${f.srcName} -> ${f.tslName} [d=${f.d}] coastalIdx=${i} ${cstr}`);
}

// 4. build source coastal order: longest train stop sequence containing many matched coastal stations
let bestSeq = null;
for (const v of Object.values(stopsData)) {
  if (!v.stops || v.stops.length < 40) continue;
  const seq = v.stops.map(e => {
    const m = (e.stationProfileURL || "").match(/\/station\/([a-z0-9]+)\//);
    return m ? decStationCode(m[1]) : null;
  }).filter(x => x != null);
  const matchedCount = seq.filter(id => [...matchedSrc, ...fuzzyMatches.map(f => f.src)].includes(id)).length;
  if (!bestSeq || matchedCount > bestSeq.matchedCount) bestSeq = { seq, matchedCount };
}
if (bestSeq) {
  console.log(`\nlongest coastal-ish source sequence: ${bestSeq.seq.length} stops, ${bestSeq.matchedCount} matched`);
  // position check: for each source station in seq, its matched their-index should be increasing
  const srcToTsl = new Map();
  for (const m of master) { const hit = theirByNorm.get(norm(m.name)); if (hit && hit.length === 1) srcToTsl.set(m.id, hit[0]); }
  for (const f of fuzzyMatches) srcToTsl.set(f.src, f.tsl);
  let prevIdx = -1, prevName = "";
  const problems = [];
  for (const id of bestSeq.seq) {
    const t = srcToTsl.get(id);
    if (t == null) continue;
    const idx = tslIdx.get(t);
    if (idx == null) continue;
    if (idx < prevIdx) problems.push(`${nameOf(id)}(${id})->${(theirs.stations.find(s=>s.stationID===t)||{}).name} idx ${idx} goes BACK after ${prevName} idx ${prevIdx}`);
    if (idx > prevIdx) { prevIdx = idx; prevName = `${nameOf(id)}->${(theirs.stations.find(s=>s.stationID===t)||{}).name}`; }
  }
  console.log(problems.length ? "ORDER PROBLEMS:\n  " + problems.join("\n  ") : "order consistent: all matched stations appear in increasing coastal index");
}
