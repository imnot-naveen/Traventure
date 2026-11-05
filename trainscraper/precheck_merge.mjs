import fs from "node:fs";
const master = JSON.parse(fs.readFileSync("state/stationmaster.json", "utf8"));
const iw = JSON.parse(fs.readFileSync("state/induwara_trains.json", "utf8"));
const full = JSON.parse(fs.readFileSync("out/trains-full.json", "utf8"));

console.log("max src id:", Math.max(...master.map(m => m.id)));
// nanu / ohiya / pattipola / haputale / bandarawela / ella / badulla / gampola / nawalapitiya / kadugannawa in master?
for (const n of ["nanu", "oya", "pattipola", "ohiya", "haputale", "bandarawela", "ella", "badulla", "gampola", "nawalapitiya", "kadugannawa", "chilaw", "negombo", "kankes"]) {
  const hits = master.filter(m => m.name.toLowerCase().includes(n));
  console.log(`  master contains "*${n}*":`, hits.map(h => h.id + ":" + h.name).join(", ") || "NONE");
}

// iw stops per gap train: which stations used
const have = new Set(full.map(t => String(t.trainNo)));
const gap = iw.filter(t => !have.has(String(t.number)));
console.log("\ngap trains:", gap.map(t => t.number).join(","));
const used = [...new Set(gap.flatMap(t => t.stops.map(s => s.station)))];
console.log("stations used by gap trains:", used.length);

// duplicate station stops in current output?
let dupTrains = [];
for (const t of full) {
  const seen = new Set(); let d = 0;
  for (const s of t.stops) { if (seen.has(s.srcStationID)) d++; seen.add(s.srcStationID); }
  if (d) dupTrains.push(`${t.trainNo}(${d} dups)`);
}
console.log("\ntrains with duplicate src stations in stops:", dupTrains.length, dupTrains.slice(0, 20));

// types of existing night mail trains
for (const tn of ["1035", "4085", "4089", "1015", "6079"]) {
  const t = full.find(x => x.trainNo === tn);
  console.log(`type of ${tn}:`, t ? `${t.type} | days=${t.days}` : "not present");
}
// 1036 stops
const t1036 = iw.find(t => t.number === "1036");
console.log("\niw 1036 stops:", t1036.stops.map(s => s.station).join(","));
