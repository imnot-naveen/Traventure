import fs from "node:fs";
const master = JSON.parse(fs.readFileSync("state/stationmaster.json", "utf8"));
const nameOf = id => (master.find(m => m.id === id) || { name: "?" + id }).name;
const ch = v => v < 26 ? String.fromCharCode(97 + v) : String.fromCharCode(48 + (v - 26));
const decStationCode = code => {
  const a = code.split("").map(c => (c >= "a" && c <= "z") ? c.charCodeAt(0) - 97 : c.charCodeAt(0) - 48 + 26);
  const V = a[0] + 36 * a[1] + 1296 * a[2];
  return V - 123;
};

const stops = JSON.parse(fs.readFileSync("state/stops.json", "utf8"));
const entries = Object.entries(stops).filter(([, v]) => v.stops.length > 0);
console.log("stops pages with data:", entries.length);

// trainNo extraction
let withTrainNo = 0;
const trainNos = {};
const noTrainNo = [];
for (const [code, v] of entries) {
  const tn = v.stops.map(e => e.trainModel?.trainNo).filter(Boolean);
  const uniq = [...new Set(tn)];
  if (uniq.length === 1) { withTrainNo++; (trainNos[uniq[0]] ||= []).push(code); }
  else noTrainNo.push({ code, uniq, n: v.stops.length });
}
console.log("pages with single trainNo:", withTrainNo, "without/ambiguous:", noTrainNo.length);
console.log("distinct trainNos:", Object.keys(trainNos).length);
console.log("ambiguous sample:", JSON.stringify(noTrainNo.slice(0, 10)));
console.log("trainNos sample:", Object.keys(trainNos).sort().slice(0, 40).join(","));

// station coverage from stops data
const stationsInStops = new Set();
for (const [, v] of entries) for (const e of v.stops) {
  const m = (e.stationProfileURL || "").match(/\/station\/([a-z0-9]+)\//);
  if (m) stationsInStops.add(decStationCode(m[1]));
}
console.log("\ndistinct stations in stops data:", stationsInStops.size);
const pages = JSON.parse(fs.readFileSync("state/stationpages.json", "utf8"));
const emptyIds = new Set(master.filter(m => { const c = Object.keys(pages).find(k => pages[k].id === m.id); return c && (pages[c].rows || []).length === 0; }).map(m => m.id));
console.log("empty-station pages:", emptyIds.size);
const covered = [...emptyIds].filter(id => stationsInStops.has(id));
console.log("empty-page stations NOW covered by stops data:", covered.length, covered.map(id => `${id}:${nameOf(id)}`).join(", "));

// check kandy specifically
for (const id of [144, 103, 274, 208, 84, 242, 131]) console.log(`  station ${id} (${nameOf(id)}) in stops data: ${stationsInStops.has(id)}`);

// stop counts per train
const perTrain = Object.entries(trainNos).map(([tn, codes]) => {
  // take longest page for this trainNo
  let best = null;
  for (const c of codes) if (!best || stops[c].stops.length > stops[best].stops.length) best = c;
  return { tn, pages: codes.length, stops: stops[best].stops.length, code: best };
}).sort((a, b) => b.stops - a.stops);
console.log("\ntop trains by stops:", JSON.stringify(perTrain.slice(0, 10)));
console.log("stop-count distribution:", JSON.stringify(perTrain.reduce((acc, t) => { const b = t.stops < 5 ? "<5" : t.stops < 10 ? "5-9" : t.stops < 20 ? "10-19" : t.stops < 40 ? "20-39" : "40+"; acc[b] = (acc[b] || 0) + 1; return acc; }, {})));
console.log("total trains:", perTrain.length);
