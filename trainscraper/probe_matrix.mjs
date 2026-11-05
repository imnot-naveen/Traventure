import fs from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const BASE = "https://trainschedule.lk";
const ch = v => v < 26 ? String.fromCharCode(97 + v) : String.fromCharCode(48 + (v - 26));
const encFrom = id => ch(0) + ch(Math.floor(id / 36)) + ch(id % 36);
const encTo = id => ch((2 * (id % 10)) % 36) + ch(id % 36) + ch(Math.floor(id / 36));
const routeCode = (f, t) => encFrom(f) + encTo(t) + "a";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";
const master = JSON.parse(fs.readFileSync("state/stationmaster.json", "utf8"));
const nameOf = id => (master.find(m => m.id === id) || { name: "?" }).name;
const idByName = {};
for (const m of master) idByName[m.name.toLowerCase()] = m.id;

const pairs = JSON.parse(fs.readFileSync("state/schedules.json", "utf8"));
console.log("--- route pairs (98) row counts ---");
for (const [k, v] of Object.entries(pairs)) {
  if (v.why === "route") {
    const [f, t] = k.split("-").map(Number);
    console.log(`${k} ${nameOf(f)} -> ${nameOf(t)}: ${v.rows.length} rows${v.rows.length ? " ends=" + [...new Set(v.rows.map(r => r.endsAt))].join("|") : ""}`);
  }
}

const rowRe = /<td><font color="green"><strong>([^<]+)<\/strong><\/font><\/td>\s*<td><font color="red"><strong>([^<]+)<\/strong><\/font><\/td>\s*<td>([^<]*)<\/td>\s*<td>([^<]*)<\/td>\s*<td><a[^>]*id="([^"]*)"[^>]*href="([^"]*)"[^>]*>[^<]*<\/a><\/td>\s*<td class="train-type-column">([^<]*)<\/td>/g;
async function probe(f, t) {
  const url = `${BASE}/schedule/${routeCode(f, t)}/x`;
  const r = await fetch(url, { headers: { "user-agent": UA } });
  const html = await r.text();
  const rows = []; let m; rowRe.lastIndex = 0;
  while ((m = rowRe.exec(html))) rows.push({ dep: m[1].trim(), arr: m[2].trim(), endsAt: m[4].trim(), trainNo: m[5].trim() });
  return rows;
}

console.log("\n--- targeted probes ---");
const probes = [
  [56, 285], [56, 182], [56, 79], [56, 209], [56, 28], [56, 144], [56, 103], [56, 208],
  [285, 144], [182, 144], [56, 19], [56, 127], [56, 347], [56, 38],
  [79, 56], [209, 56], [28, 56], [19, 56],
];
for (const [f, t] of probes) {
  const rows = await probe(f, t);
  console.log(`${f}(${nameOf(f)}) -> ${t}(${nameOf(t)}): ${rows.length} rows${rows.length ? " | " + rows.slice(0, 4).map(r => `${r.trainNo} dep${r.dep} ends=${r.endsAt}`).join(" ; ") : ""}`);
  await sleep(300);
}
