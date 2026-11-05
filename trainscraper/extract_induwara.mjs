import fs from "node:fs";
const t = fs.readFileSync("state/ijs/2g7b5cd-er8sm.js", "utf8");

// 1. extract D=[...] array by bracket matching
const start = t.indexOf("D=[");
if (start < 0) { console.error("D=[ not found"); process.exit(1); }
let i = start + 2, depth = 0, end = -1;
for (; i < t.length; i++) {
  const c = t[i];
  if (c === "[") depth++;
  else if (c === "]") { depth--; if (depth === 0) { end = i; break; } }
}
const arrLit = t.slice(start + 2, end + 1);
console.log("array literal length:", arrLit.length);

// it's valid JSON? has unquoted keys and maybe trailing stuff. Try JSON.parse after converting
// The literal uses {number:"1077"} style -> convert to JSON
const json = arrLit
  .replace(/([{,])([A-Za-z_][A-Za-z0-9_]*):/g, '$1"$2":')
  .replace(/'([^']*)'/g, '"$1"');
let trains;
try { trains = JSON.parse(json); } catch (e) { console.error("JSON parse failed:", e.message); console.log(json.slice(0, 300)); process.exit(1); }
console.log("trains:", trains.length);
fs.writeFileSync("state/induwara_trains.json", JSON.stringify(trains, null, 1));

// 2. find station map: look for something like {fort:{...}, kandy:...} or stations list with names
for (const kw of ['"fort"', 'stationNames', 'label:"Colombo', 'name:"Colombo', 'stations=']) {
  const idxs = []; let p = -1;
  while ((p = t.indexOf(kw, p + 1)) >= 0 && idxs.length < 5) idxs.push(p);
  console.log(JSON.stringify(kw), "->", idxs);
}

// 3. summary of trains
for (const tr of trains) console.log(`${tr.number} ${tr.name} [${tr.category}/${tr.days}] stops=${tr.stops.length} ${tr.stops[0].station} -> ${tr.stops[tr.stops.length-1].station}`);
