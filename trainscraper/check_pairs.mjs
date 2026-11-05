// Validate each fuzzy pair from build.mjs using sequence-neighbor evidence + raw coords.
import fs from "node:fs";
import path from "node:path";
const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\//, "").replace(/^([A-Za-z]:)/, "$1"));
const STATE = path.join(DIR, "state");
const load = (f, d) => { try { return JSON.parse(fs.readFileSync(path.join(STATE, f), "utf8")); } catch { return d; } };

const stopsData = load("stops.json", {});
const master = load("stationmaster.json", []);
const theirs = load("theirstations.json", { stations: [], routes: [] });
const nameOf = id => (master.find(m => m.id === id) || {}).name;

const decStationCode = code => {
  const a = code.split("").map(c => (c >= "a" && c <= "z") ? c.charCodeAt(0) - 97 : c.charCodeAt(0) - 48 + 26);
  return a[0] + 36 * a[1] + 1296 * a[2] - 123;
};
const norm = s => (s || "").toLowerCase().replace(/\s+/g, " ").trim();
const fuzzyKey = s => norm(s).replace(/[^a-z0-9]/g, "");
const lev = (a, b) => {
  const m = a.length, n = b.length;
  if (!m || !n) return Math.max(m, n);
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) { const cur = [i]; for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = cur; }
  return prev[n];
};

// exact match map (build.mjs logic)
const theirByNorm = new Map();
for (const s of theirs.stations) { const k = norm(s.name); if (!theirByNorm.has(k)) theirByNorm.set(k, []); theirByNorm.get(k).push(s.stationID); }
const srcToTsl = new Map();
const matchLog = [];
for (const m of master) {
  const hit = theirByNorm.get(norm(m.name));
  if (hit && hit.length === 1) { srcToTsl.set(m.id, hit[0]); matchLog.push({ src: m.id, srcName: m.name, tsl: hit[0], tslName: theirs.stations.find(s=>s.stationID===hit[0]).name, method: "exact" }); }
}
// fuzzy exactly like build.mjs: master order, candidates = theirs not already exact-matched
const fuzzyCandidates = theirs.stations.filter(s => !matchLog.some(l => l.tsl === s.stationID));
const fuzzyMatches = [];
for (const m of master) {
  if (srcToTsl.has(m.id)) continue;
  const a = fuzzyKey(m.name);
  let best = null;
  for (const s of fuzzyCandidates) {
    const b = fuzzyKey(s.name);
    const d = lev(a, b);
    const tol = Math.max(1, Math.floor(Math.max(a.length, b.length) * 0.25));
    if (d <= tol && (!best || d < best.d)) best = { d, s };
  }
  if (best) { srcToTsl.set(m.id, best.s.stationID); fuzzyMatches.push({ src: m.id, srcName: m.name, tsl: best.s.stationID, tslName: best.s.name, d: best.d }); fuzzyCandidates.splice(fuzzyCandidates.indexOf(best.s), 1); }
}
console.log(`exact=${matchLog.length} fuzzy=${fuzzyMatches.length}`);

// their coastal index
const coastal = theirs.routes[0].orderedStations.split(",").map(Number);
const tslIdx = new Map(coastal.map((id, i) => [id, i]));
const tslName = id => (theirs.stations.find(s => s.stationID === id) || {}).name;

// coords: raw per-entry for suspects + average for all
const rawCoords = {}; // srcId -> [[lat,lng,trainNo],...]
const sequences = []; // {trainNo, ids:[]}
for (const [code, v] of Object.entries(stopsData)) {
  if (!v.stops) continue;
  const ids = [];
  for (const e of v.stops) {
    const m = (e.stationProfileURL || "").match(/\/station\/([a-z0-9]+)\//);
    if (!m) continue;
    const id = decStationCode(m[1]);
    ids.push(id);
    const lat = Number(e.latitude), lng = Number(e.longitude);
    const tn = e.trainModel && e.trainModel.trainNo;
    if (Number.isFinite(lat) && Number.isFinite(lng) && !(lat === 0 && lng === 0)) (rawCoords[id] ||= []).push([lat, lng, tn]);
  }
  if (ids.length) sequences.push({ code, ids, trainNo: (v.stops[0].trainModel||{}).trainNo });
}
const avgCoord = id => {
  const r = rawCoords[id]; if (!r || !r.length) return null;
  const n = r.length;
  return { lat: r.reduce((s, x) => s + x[0], 0) / n, lng: r.reduce((s, x) => s + x[1], 0) / n, n };
};

// neighbor evidence per fuzzy pair
console.log("\n=== FUZZY PAIR VALIDATION (build.mjs's actual 18) ===");
for (const f of fuzzyMatches) {
  const c = avgCoord(f.src);
  const idx = tslIdx.get(f.tsl);
  // find contexts
  const ctxs = [];
  for (const seq of sequences) {
    for (let i = 0; i < seq.ids.length; i++) {
      if (seq.ids[i] !== f.src) continue;
      const before = [], after = [];
      for (let j = i - 1; j >= 0 && before.length < 3; j--) { const t = srcToTsl.get(seq.ids[j]); if (t != null) before.push(`${nameOf(seq.ids[j])}#${tslIdx.get(t) ?? "?"}`); }
      for (let j = i + 1; j < seq.ids.length && after.length < 3; j++) { const t = srcToTsl.get(seq.ids[j]); if (t != null) after.push(`${nameOf(seq.ids[j])}#${tslIdx.get(t) ?? "?"}`); }
      if (before.length || after.length) ctxs.push({ tn: seq.trainNo, before: before.reverse(), after });
    }
    if (ctxs.length >= 3) break;
  }
  const coordStr = c ? `coord=(${c.lat.toFixed(4)},${c.lng.toFixed(4)}) x${c.n}` : "coord=NONE";
  console.log(`\n${f.srcName} -> ${f.tslName} [d=${f.d}] theirIdx=${idx} ${coordStr}`);
  // does the bracketing hold?
  let verdict = "UNKNOWN";
  const bs = ctxs.flatMap(c => c.before.map(x => Number(x.split("#")[1]))).filter(Number.isFinite);
  const as = ctxs.flatMap(c => c.after.map(x => Number(x.split("#")[1]))).filter(Number.isFinite);
  if (bs.length && as.length) {
    const maxB = Math.max(...bs), minA = Math.min(...as);
    verdict = (idx > maxB && idx < minA) ? "OK (inside bracket)" : `MISMATCH (need idx in (${maxB},${minA}))`;
  }
  console.log(`  verdict: ${verdict}`);
  for (const cx of ctxs.slice(0, 3)) console.log(`  train ${cx.tn}: ...${cx.before.join(",")} < [${f.srcName}] < ${cx.after.join(",")}`);
}

// suspect raw coords
console.log("\n=== RAW COORDS FOR SUSPECTS ===");
for (const f of fuzzyMatches.filter(x => ["Ragama", "Kinigama", "Bambaranda", "Beliaththa", "Kumbalgama", "Wewurukannala"].includes(x.srcName))) {
  console.log(`${f.srcName} -> ${f.tslName}:`, JSON.stringify((rawCoords[f.src] || []).slice(0, 6)));
}
// sanity: a few known-good coastal stations' coords
console.log("\n=== SANITY: known coastal stations ===");
for (const nm of ["Galle", "Matara", "Colombo Fort", "Kalutara South", "Hikkaduwa"]) {
  const m = master.find(x => norm(x.name) === norm(nm));
  if (m) console.log(`${nm}:`, JSON.stringify((rawCoords[m.id] || []).slice(0, 3)));
}
