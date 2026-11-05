import fs from "node:fs";
const t = fs.readFileSync("state/ijs/38nzs6jzdmrnb.js", "utf8");
// station array starts with [{id:"fort",name:"Colombo Fort"...
const start = t.indexOf('i=[{id:"fort"');
if (start < 0) { console.error("station array not found"); process.exit(1); }
let i = start + 2, depth = 0, end = -1;
for (; i < t.length; i++) {
  const c = t[i];
  if (c === "[") depth++;
  else if (c === "]") { depth--; if (depth === 0) { end = i; break; } }
}
const lit = t.slice(start + 2, end + 1);
const json = lit.replace(/([{,])([A-Za-z_][A-Za-z0-9_]*):/g, '$1"$2":');
const stations = JSON.parse(json);
console.log("stations:", stations.length);
fs.writeFileSync("state/induwara_stations.json", JSON.stringify(stations, null, 1));
for (const s of stations) console.log(`${s.id}\t${s.name}\t${s.line}\t${s.kmFromFort}`);
