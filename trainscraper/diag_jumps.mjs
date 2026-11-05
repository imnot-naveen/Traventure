// Diagnose time-jump / ordering issues per train.
import fs from "node:fs";
import path from "node:path";
const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\//, "").replace(/^([A-Za-z]:)/, "$1"));
const OUT = path.join(DIR, "out");
const trains = JSON.parse(fs.readFileSync(path.join(OUT, "trains-full.json"), "utf8"));

const toMin = t => { if (!t) return null; const [h, m] = t.split(":").map(Number); return h * 60 + m; };

for (const t of trains) {
  const jumps = [];
  for (let i = 1; i < t.stops.length; i++) {
    const a = toMin(t.stops[i - 1].departureTime || t.stops[i - 1].arrivalTime);
    const b = toMin(t.stops[i].arrivalTime || t.stops[i].departureTime);
    if (a == null || b == null) continue;
    if (b < a - 720 || b > a + 720) jumps.push({ at: i, from: `${t.stops[i-1].stationName}(${t.stops[i-1].departureTime||t.stops[i-1].arrivalTime})`, to: `${t.stops[i].stationName}(${t.stops[i].arrivalTime||t.stops[i].departureTime})`, delta: b - a });
  }
  if (jumps.length) {
    console.log(`\n=== ${t.trainNo} (trainID ${t.trainID}) source=${t.source} ${t.startStationName} -> ${t.endStationName} dep=${t.departureTime} arr=${t.arrivalTime} stops=${t.stopCount}`);
    for (const j of jumps) console.log(`  jump at stop ${j.at}: ${j.from} -> ${j.to} (delta ${j.delta} min)`);
    console.log("  full sequence:");
    t.stops.forEach((s, i) => console.log(`    ${String(i+1).padStart(2)}. ${s.stationName} arr=${s.arrivalTime} dep=${s.departureTime}`));
  }
}
