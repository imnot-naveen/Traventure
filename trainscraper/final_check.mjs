import fs from "node:fs";
const full = JSON.parse(fs.readFileSync("out/trains-full.json", "utf8"));

// 1. duplicate stops within any train
let dupTrains = [];
for (const t of full) {
  const seen = new Set();
  let d = 0;
  for (const s of t.stops) { const k = s.srcStationID; if (seen.has(k)) d++; seen.add(k); }
  if (d) dupTrains.push(`${t.trainNo}(${d})`);
}
console.log("trains with duplicate stations in stops:", dupTrains.length, dupTrains.slice(0, 10));

// 2. structural sanity across all trains
let noTimes = 0, badOrder = 0, missingStation = 0;
const stn = new Set(JSON.parse(fs.readFileSync("out/stations.json", "utf8")).map(s => s.stationID));
for (const t of full) {
  if (t.stops.length !== t.stopCount) console.log("stopCount mismatch", t.trainNo);
  if (t.startStation !== t.stops[0].stationID || t.endStation !== t.stops[t.stops.length - 1].stationID) console.log("endpoint mismatch", t.trainNo);
  for (const s of t.stops) {
    if (!s.arrivalTime || !s.departureTime) noTimes++;
    if (!stn.has(s.stationID)) missingStation++;
  }
  if (t.departureTime !== t.stops[0].departureTime || t.arrivalTime !== t.stops[t.stops.length - 1].arrivalTime) console.log("train time mismatch", t.trainNo);
}
console.log("stops missing times:", noTimes, "| stops with unknown stationID:", missingStation);

// 3. source breakdown
const bySrc = {};
for (const t of full) bySrc[t.source] = (bySrc[t.source] || 0) + 1;
console.log("by source:", JSON.stringify(bySrc));
console.log("total trains:", full.length, "| total stops:", full.reduce((a, t) => a + t.stopCount, 0));

// 4. spot-check the gap trains
for (const tn of ["1077", "4017", "6301", "4085"]) {
  const t = full.find(x => x.trainNo === tn);
  console.log(`\n${tn}: ${t.startStationName}(${t.departureTime}) -> ${t.endStationName}(${t.arrivalTime}) type=${t.type} days=${t.days} stops=${t.stopCount} id=${t.trainID}`);
  console.log("  " + t.stops.map(s => `${s.stationName} ${s.arrivalTime.slice(0, 5)}`).join(" | "));
}
