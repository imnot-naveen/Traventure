import fs from "node:fs";
const stops = JSON.parse(fs.readFileSync("state/stops.json", "utf8"));
const pages = JSON.parse(fs.readFileSync("state/stationpages.json", "utf8"));
const types = JSON.parse(fs.readFileSync("state/traintypes.json", "utf8"));

// field presence in stops entries
const withData = Object.values(stops).filter(v => v.stops.length > 0);
const fieldCount = {};
let trainName = null, runningDays = null, trainType = null;
for (const v of withData) for (const e of v.stops) {
  for (const k of Object.keys(e)) fieldCount[k] = (fieldCount[k] || 0) + 1;
  if (e.trainModel?.trainName && !trainName) trainName = { tn: e.trainModel.trainNo, name: e.trainModel.trainName };
  if (e.runningDays) runningDays = e.runningDays;
  if (e.trainModel?.trainType && !trainType) trainType = { tn: e.trainModel.trainNo, type: e.trainModel.trainType };
}
console.log("field counts (of", withData.reduce((a, v) => a + v.stops.length, 0), "entries):");
console.log(JSON.stringify(fieldCount, null, 1));
console.log("trainName sample:", JSON.stringify(trainName), "runningDays sample:", JSON.stringify(runningDays), "trainType sample:", JSON.stringify(trainType));

// days from station pages
const daysByTrain = {};
for (const v of Object.values(pages)) for (const r of v.rows) {
  (daysByTrain[r.trainNo] ||= {})[r.days] = (daysByTrain[r.trainNo][r.days] || 0) + 1;
}
const daySets = Object.values(daysByTrain).map(o => Object.keys(o));
const uniqDays = [...new Set(daySets.map(d => d.join(" | ")))];
console.log("\ndistinct day-strings:", uniqDays.length);
uniqDays.slice(0, 20).forEach(d => console.log("  ", d));
const multi = Object.entries(daysByTrain).filter(([, o]) => Object.keys(o).length > 1);
console.log("trains with conflicting days:", multi.length, JSON.stringify(multi.slice(0, 5)));

// trainNos in pages vs stops vs types
const pageTrains = new Set(Object.keys(daysByTrain));
const stopTrains = new Set(withData.map(v => v.stops.map(e => e.trainModel?.trainNo).find(Boolean)).filter(Boolean));
const typeTrains = new Set(Object.keys(types));
console.log("\npage trains:", pageTrains.size, "stop trains:", stopTrains.size, "typed trains:", typeTrains.size);
console.log("in pages not stops:", [...pageTrains].filter(t => !stopTrains.has(t)).length, [...pageTrains].filter(t => !stopTrains.has(t)).slice(0, 40).join(","));
console.log("in stops not pages:", [...stopTrains].filter(t => !pageTrains.has(t)).length, [...stopTrains].filter(t => !pageTrains.has(t)).slice(0, 40).join(","));
console.log("in stops not typed:", [...stopTrains].filter(t => !typeTrains.has(t)).length, [...stopTrains].filter(t => !typeTrains.has(t)).slice(0, 60).join(","));

// train number format
const nums = [...stopTrains];
console.log("\ntrainNo formats:", nums.filter(t => /^\d+$/.test(t)).length, "numeric,", nums.filter(t => !/^\d+$/.test(t)).length, "suffixed:", nums.filter(t => !/^\d+$/.test(t)).join(","));
console.log("min/max numeric:", Math.min(...nums.filter(t => /^\d+$/.test(t)).map(Number)), Math.max(...nums.filter(t => /^\d+$/.test(t)).map(Number)));
