import fs from "node:fs";
const master = JSON.parse(fs.readFileSync("state/stationmaster.json", "utf8"));
const theirs = JSON.parse(fs.readFileSync("state/theirstations.json", "utf8"));
const ml = JSON.parse(fs.readFileSync("out/stations-matchlog.json", "utf8"));

const srcById = new Map(master.map(m => [m.id, m.name]));
const theirById = new Map(theirs.stations.map(s => [s.stationID, s.name]));
const norm = s => (s || "").toLowerCase().replace(/\s+/g, " ").trim();

// 1. any tsl id assigned twice?
const byTsl = {};
for (const l of ml.matchLog) (byTsl[l.tsl] ||= []).push(l);
const dupTsl = Object.entries(byTsl).filter(([, v]) => v.length > 1);
console.log("tsl IDs matched more than once:", dupTsl.length, JSON.stringify(dupTsl));

// 2. fuzzy matches where source name exists in theirs exactly (should have been exact)
const theirByNorm = new Map(theirs.stations.map(s => [norm(s.name), s.stationID]));
console.log("\nfuzzy match review:");
for (const l of ml.matchLog.filter(x => x.method.startsWith("fuzzy"))) {
  const srcExact = theirByNorm.get(norm(l.srcName));
  const srcAlsoInSrc = master.filter(m => norm(m.name) === norm(l.srcName)).map(m => m.id);
  const theirAlsoInSrc = master.filter(m => norm(m.name) === norm(l.tslName)).map(m => m.id);
  console.log(`  src${l.src}:${l.srcName} -> tsl${l.tsl}:${l.tslName} [${l.method}] | srcNameInTheirs=${srcExact ?? "-"} | srcNameAlsoAtSrcIds=${srcAlsoInSrc} | theirNameAlsoAtSrcIds=${theirAlsoInSrc}`);
}

// 3. are there source stations whose name exactly equals a theirs name but got a NEW id instead?
const newById = new Map(ml.newStations.map(s => [s.srcId, s]));
let missed = [];
for (const m of master) {
  const exact = theirByNorm.get(norm(m.name));
  if (exact != null && newById.has(m.id)) missed.push(`${m.id}:${m.name} -> should be tsl ${exact}`);
}
console.log("\nexact-name source stations wrongly given NEW ids:", missed.length, missed);

// 4. which source stations are actually on coastal line (their line) vs elsewhere — sanity for fuzzy
console.log("\nunmatched theirs (kept, no source data):", ml.unmatchedTheirs.map(s => `${s.stationID}:${s.name}`).join(", "));
