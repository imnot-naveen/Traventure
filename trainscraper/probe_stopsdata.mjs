import fs from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";

const r = await fetch("https://trainschedule.lk/js/stops-map.js", { headers: { "user-agent": UA } });
const js = await r.text();
console.log("stops-map.js status", r.status, "len", js.length);
console.log(js.slice(0, 3000));

// check stationsData on several stops pages
const s = JSON.parse(fs.readFileSync("state/schedules.json", "utf8"));
const hrefs = [];
for (const v of Object.values(s)) for (const row of (v.rows || [])) if (row.stopsHref && row.stopsHref.split("/")[2].length === 9) hrefs.push(row.stopsHref);
const uniq = [...new Set(hrefs)];
console.log("\nchecking stationsData across stops pages:");
let withData = 0;
for (const h of uniq.slice(0, 25)) {
  const res = await fetch("https://trainschedule.lk" + h, { headers: { "user-agent": UA } });
  const t = await res.text();
  const m = t.match(/var stationsData = (\[[\s\S]*?\]);/);
  const len = m ? m[1].length : -1;
  if (len > 4) withData++;
  console.log(`  ${h.split("/")[2]}: dataLen=${len}${len > 4 ? " " + m[1].slice(0, 200) : ""}`);
  await sleep(150);
}
console.log("withData:", withData);
