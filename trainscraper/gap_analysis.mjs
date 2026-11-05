// Gap analysis: what does induwara.lk add on top of the trainschedule.lk scrape?
import fs from "node:fs";
const load = f => JSON.parse(fs.readFileSync("state/" + f, "utf8"));
const iw = load("induwara_trains.json");
const iws = load("induwara_stations.json");
const ours = JSON.parse(fs.readFileSync("out/trains-full.json", "utf8"));
const ourStations = JSON.parse(fs.readFileSync("out/stations.json", "utf8"));

const norm = s => (s || "").toLowerCase().replace(/\s+/g, " ").trim();
const ourNums = new Set(ours.map(t => String(t.trainNo)));

console.log("=== induwara trains: already in our data? ===");
const missing = [];
for (const t of iw) {
  const exists = ourNums.has(String(t.number));
  console.log(`  ${exists ? "HAVE" : "GAP"} ${t.number} ${t.name} (${t.stops.length} stops)`);
  if (!exists) missing.push(t);
}
console.log(`\nmissing trains: ${missing.length} of ${iw.length}`);

// stations: which induwara stations are in our source station list (by name)?
console.log("\n=== induwara stations vs our source stations ===");
const ourByName = new Map();
for (const s of ourStations) { const k = norm(s.name); if (!ourByName.has(k)) ourByName.set(k, []); ourByName.get(k).push(s); }
const exact = [], fuzzy = [], unknown = [];
for (const s of iws) {
  const hit = ourByName.get(norm(s.name));
  if (hit && hit.length === 1) { exact.push({ iw: s, ours: hit[0] }); continue; }
  // careful fuzzy: lev within tolerance, but list for review
  const lev = (a, b) => { const m = a.length, n = b.length; let prev = Array.from({ length: n + 1 }, (_, i) => i); for (let i = 1; i <= m; i++) { const cur = [i]; for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = cur; } return prev[n]; };
  let best = null;
  for (const s2 of ourStations) {
    const d = lev(norm(s.name), norm(s2.name));
    const tol = Math.max(1, Math.floor(Math.max(norm(s.name).length, norm(s2.name).length) * 0.25));
    if (d <= tol && (!best || d < best.d)) best = { d, s2 };
  }
  if (best) fuzzy.push({ iw: s, ours: best.s2, d: best.d });
  else unknown.push(s);
}
console.log(`exact: ${exact.length}, fuzzy: ${fuzzy.length}, no match: ${unknown.length}`);
console.log("\nfuzzy (REVIEW):");
for (const f of fuzzy) console.log(`  iw:${f.iw.id} "${f.iw.name}" -> ours:${f.ours.srcStationID} "${f.ours.name}" d=${f.d} (ourTsl=${f.ours.stationID})`);
console.log("\nno match (new stations):");
for (const s of unknown) console.log(`  ${s.id} "${s.name}" (${s.line}, km ${s.kmFromFort})`);

// Which of the missing trains' stops hit stations we have NO schedule data for?
const ourNoSched = new Set(ourStations.filter(s => !s.hasScheduleData).map(s => norm(s.name)));
console.log("\n=== stops of missing trains: do we have schedule data for them? ===");
for (const t of missing) {
  const gapStops = t.stops.filter(st => { const nm = (iws.find(x => x.id === st.station) || {}).name; return nm && ourNoSched.has(norm(nm)); });
  console.log(`  ${t.number} ${t.name}: ${t.stops.length} stops, ${gapStops.length} at gap stations`);
}
