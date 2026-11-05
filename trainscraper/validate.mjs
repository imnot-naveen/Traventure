import fs from "node:fs";
const ml = JSON.parse(fs.readFileSync("out/stations-matchlog.json", "utf8"));
console.log("=== fuzzy matches (need review) ===");
ml.matchLog.filter(l => l.method.startsWith("fuzzy")).forEach(l => console.log(`  src ${l.src}:${l.srcName}  ->  tsl ${l.tsl}:${l.tslName}  [${l.method}]`));
console.log("\n=== exact matches ===", ml.matchLog.filter(l => l.method === "exact").length);
console.log("=== new stations ===", ml.newStations.length, "range", ml.newStations[0]?.tslId, "-", ml.newStations[ml.newStations.length - 1]?.tslId);
console.log("=== unmatched theirs ===", ml.unmatchedTheirs.map(s => `${s.stationID}:${s.name}`).join(", "));

const full = JSON.parse(fs.readFileSync("out/trains-full.json", "utf8"));
const toMin = t => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
console.log("\n=== trains with >12h jump ===");
for (const t of full) {
  for (let i = 1; i < t.stops.length; i++) {
    const a = toMin(t.stops[i - 1].departureTime), b = toMin(t.stops[i].arrivalTime);
    if (b < a - 720 || b > a + 720) {
      console.log(`  ${t.trainNo} (${t.source}) stop${i} ${t.stops[i - 1].stationName} ${t.stops[i - 1].departureTime} -> ${t.stops[i].stationName} ${t.stops[i].arrivalTime} (total stops ${t.stopCount})`);
      break;
    }
  }
}

console.log("\n=== sample trains ===");
for (const tn of ["8085", "8050", "8097", "1040 SPL", "4090"]) {
  const t = full.find(x => x.trainNo === tn);
  if (!t) { console.log(`  ${tn}: NOT FOUND`); continue; }
  console.log(`  ${tn}: trainID=${t.trainID} type=${t.type} days=${t.days.slice(0, 40)} ${t.startStationName}(${t.departureTime}) -> ${t.endStationName}(${t.arrivalTime}) stops=${t.stopCount} src=${t.source}`);
  console.log(`     first3: ${t.stops.slice(0, 3).map(s => s.stationName + "@" + s.arrivalTime).join(" | ")}`);
  console.log(`     last3:  ${t.stops.slice(-3).map(s => s.stationName + "@" + s.arrivalTime).join(" | ")}`);
}

// validate API format
const api = JSON.parse(fs.readFileSync("out/trains-addmultiple.json", "utf8"));
const bad = [];
for (const t of api) {
  for (const k of ["trainID", "name", "type", "startStation", "endStation", "departureTime", "arrivalTime", "date"]) {
    if (t[k] === undefined || t[k] === null || t[k] === "") bad.push(`${t.trainNo || t.trainID}: missing ${k}`);
  }
  if (!t.stops || !t.stops.length) bad.push(`${t.trainID}: no stops`);
  for (const s of t.stops) if (!s.stationID || !s.arrivalTime || !s.departureTime) bad.push(`${t.trainID}: bad stop ${JSON.stringify(s)}`);
}
console.log("\nAPI validation issues:", bad.length, bad.slice(0, 10));
console.log("api trains:", api.length, "sample:", JSON.stringify(api[0]).slice(0, 400));

// station id sanity: all stop stationIDs exist in stations.json
const st = JSON.parse(fs.readFileSync("out/stations.json", "utf8"));
const ids = new Set(st.map(s => s.stationID));
const missing = new Set();
for (const t of full) for (const s of t.stops) if (!ids.has(s.stationID)) missing.add(s.stationID);
console.log("\nstop stationIDs not in stations.json:", [...missing]);
console.log("duplicate stationIDs in stations.json:", st.length - ids.size);
const tids = new Set(full.map(t => t.trainID));
console.log("trains:", full.length, "unique trainIDs:", tids.size);
