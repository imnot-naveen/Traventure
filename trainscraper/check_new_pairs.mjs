// Validate the two NEW fuzzy pairs created by the deny cascade: Mirigama->Sinigama, Rathgama->Rajgama
import fs from "node:fs";
import path from "node:path";
const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\//, "").replace(/^([A-Za-z]:)/, "$1"));
const STATE = path.join(DIR, "state");
const load = (f, d) => { try { return JSON.parse(fs.readFileSync(path.join(STATE, f), "utf8")); } catch { return d; } };

const stopsData = load("stops.json", {});
const master = load("stationmaster.json", []);
const theirs = load("theirstations.json", { stations: [], routes: [] });
const ml = JSON.parse(fs.readFileSync(path.join(DIR, "out", "stations-matchlog.json"), "utf8"));

const decStationCode = code => {
  const a = code.split("").map(c => (c >= "a" && c <= "z") ? c.charCodeAt(0) - 97 : c.charCodeAt(0) - 48 + 26);
  return a[0] + 36 * a[1] + 1296 * a[2] - 123;
};

// all coords per src station
const rawCoords = {};
const sequences = [];
for (const [code, v] of Object.entries(stopsData)) {
  if (!v.stops) continue;
  const ids = [];
  for (const e of v.stops) {
    const m = (e.stationProfileURL || "").match(/\/station\/([a-z0-9]+)\//);
    if (!m) continue;
    const id = decStationCode(m[1]);
    ids.push(id);
    const lat = Number(e.latitude), lng = Number(e.longitude);
    if (Number.isFinite(lat) && Number.isFinite(lng) && !(lat === 0 && lng === 0)) (rawCoords[id] ||= []).push([lat, lng]);
  }
  if (ids.length) sequences.push({ ids, trainNo: (v.stops[0].trainModel || {}).trainNo });
}
const avg = id => {
  const r = rawCoords[id]; if (!r || !r.length) return null;
  return { lat: r.reduce((s, x) => s + x[0], 0) / r.length, lng: r.reduce((s, x) => s + x[1], 0) / r.length, n: r.length };
};

const coastal = theirs.routes[0].orderedStations.split(",").map(Number);
const tslIdx = new Map(coastal.map((id, i) => [id, i]));
const tslName = id => (theirs.stations.find(s => s.stationID === id) || {}).name;
const nameOf = id => (master.find(m => m.id === id) || {}).name;

// srcToTsl from matchlog
const srcToTsl = new Map(ml.matchLog.map(l => [l.src, l.tsl]));

const targets = ml.matchLog.filter(l => ["Seenigama"].includes(l.srcName));
for (const f of targets) {
  const c = avg(f.src);
  const idx = tslIdx.get(f.tsl);
  console.log(`\n=== ${f.srcName} -> ${f.tslName} [${f.method}] tslIdx=${idx} coord=${c ? `(${c.lat.toFixed(4)},${c.lng.toFixed(4)})x${c.n}` : "NONE"}`);
  // sequence contexts
  let shown = 0;
  for (const seq of sequences) {
    for (let i = 0; i < seq.ids.length && shown < 4; i++) {
      if (seq.ids[i] !== f.src) continue;
      const before = [], after = [];
      for (let j = i - 1; j >= 0 && before.length < 4; j--) { const t = srcToTsl.get(seq.ids[j]); if (t != null) before.push(`${nameOf(seq.ids[j])}#${tslIdx.get(t) ?? "?"}`); }
      for (let j = i + 1; j < seq.ids.length && after.length < 4; j++) { const t = srcToTsl.get(seq.ids[j]); if (t != null) after.push(`${nameOf(seq.ids[j])}#${tslIdx.get(t) ?? "?"}`); }
      if (before.length || after.length) { console.log(`  train ${seq.trainNo}: ...${before.reverse().join(",")} < [${f.srcName}] < ${after.join(",")}`); shown++; }
    }
    if (shown >= 4) break;
  }
  if (!shown) console.log("  (no sequence context with mapped neighbors)");
}

// sanity: coords of tsl Sinigama / Rajgama if known (find src station with same name? no) - print nearby coastal stations' coords
console.log("\n=== coastal reference coords (src stations matched to coastal tsl) ===");
for (const nm of ["Hikkaduwa", "Galle", "Unawatuna", "Koggala", "Talpe", "Ambalangoda", "Bentota", "Seenigama", "Telwatte", "Ahungalle", "Dodanduwa", "Boossa"]) {
  const m = master.find(x => x.name === nm);
  if (m) { const c = avg(m.id); if (c) console.log(`  ${nm}: (${c.lat.toFixed(4)},${c.lng.toFixed(4)})`); }
}
// Mirigama main-line reference
console.log("\n=== main-line reference coords ===");
for (const nm of ["Mirigama", "Veyangoda", "Polgahawela", "Ragama", "Gampaha", "Kandy", "Peradeniya"]) {
  const m = master.find(x => x.name === nm);
  if (m) { const c = avg(m.id); console.log(`  ${nm}: ${c ? `(${c.lat.toFixed(4)},${c.lng.toFixed(4)})` : "NO COORDS"}`); }
}
