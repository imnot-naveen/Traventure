import fs from "node:fs";

const BASE = "https://trainschedule.lk";
const ch = v => v < 26 ? String.fromCharCode(97 + v) : String.fromCharCode(48 + (v - 26));
const encFrom = id => ch(0) + ch(Math.floor(id / 36)) + ch(id % 36);
const encTo = id => ch((2 * (id % 10)) % 36) + ch(id % 36) + ch(Math.floor(id / 36));
const routeCode = (f, t) => encFrom(f) + encTo(t) + "a";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";

const master = JSON.parse(fs.readFileSync("state/stationmaster.json", "utf8"));
const nameOf = id => (master.find(m => m.id === id) || {}).name;

const pairs = JSON.parse(fs.readFileSync("state/schedules.json", "utf8"));
// find empty-in keys that SHOULD have data: hub 56 (Colombo Fort) -> 144 (Kandy)
const keys = ["56-144", "144-56", "56-182", "182-56", "144-19", "56-103", "103-56"];
for (const k of keys) {
  const [f, t] = k.split("-").map(Number);
  const url = `${BASE}/schedule/${routeCode(f, t)}/probe-train-timetable`;
  const r = await fetch(url, { headers: { "user-agent": UA } });
  const html = await r.text();
  const inState = pairs[k];
  console.log(`\n=== ${k} (${nameOf(f)} -> ${nameOf(t)}) status=${r.status} len=${html.length} stateRows=${inState ? inState.rows.length : "n/a"} hasTrainType=${html.includes("Train Type")}`);
  // find table area
  const idx = html.indexOf("Train Type");
  console.log("around Train Type:", JSON.stringify(html.slice(Math.max(0, idx - 300), idx + 200)));
  // count <td> occurrences
  console.log("td count:", (html.match(/<td/g) || []).length, "tr count:", (html.match(/<tr/g) || []).length);
  fs.writeFileSync(`probe_${k}.html`, html);
}
