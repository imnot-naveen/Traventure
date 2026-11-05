import fs from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";
const ch = v => v < 26 ? String.fromCharCode(97 + v) : String.fromCharCode(48 + (v - 26));
const statCode = id => { const V = id + 123; return ch(V % 36) + ch(Math.floor(V / 36) % 36) + ch(Math.floor(V / 1296) % 36) + ch((2 * (id % 10)) % 36); };
const encFrom = id => ch(0) + ch(Math.floor(id / 36)) + ch(id % 36);
const encTo = id => ch((2 * (id % 10)) % 36) + ch(id % 36) + ch(Math.floor(id / 36));
const routeCode = (f, t) => encFrom(f) + encTo(t) + "a";

async function get(p, opts = {}) {
  const r = await fetch("https://trainschedule.lk" + p, { headers: { "user-agent": UA, ...(opts.headers || {}) }, method: opts.method || "GET", body: opts.body });
  return { status: r.status, text: await r.text() };
}

// 1. hidden station ids beyond 396 and the 5 gaps
const ids = [];
for (let i = 397; i <= 440; i++) ids.push(i);
for (const g of [78, 273, 299, 312, 323]) ids.push(g);
console.log("--- hidden/gap station pages ---");
for (const id of ids) {
  const { status, text } = await get(`/station/${statCode(id)}/probe`);
  if (status === 200) {
    const title = (text.match(/<title>([^<]*)<\/title>/) || [])[1];
    const trs = (text.match(/<tr/g) || []).length;
    console.log(`  id=${id} status=200 trs=${trs} title=${title}`);
  }
  await sleep(120);
}

// 2. other sitemaps / robots
console.log("\n--- sitemap variants ---");
for (const p of ["/sitemap.xml", "/sitemap-index.xml", "/sitemap_index.xml", "/sitemap1.xml", "/sitemap-stations.xml", "/sitemap-stations", "/sitemap", "/robots.txt"]) {
  const { status, text } = await get(p);
  console.log(`  ${p}: ${status} len=${text.length}`);
}

// 3. api-ish endpoints
console.log("\n--- api probes ---");
const apiProbes = [
  "/api", "/api/schedule", "/api/schedules", "/api/trains", "/api/stations",
  "/Schedule/GetSchedules", "/Home/GetSchedules", "/Schedule?from=56&to=144",
  "/train/8059", "/trains/8059", "/train/8059/kandy", "/timetable/8059",
  "/Search", "/search", "/Home/Search",
];
for (const p of apiProbes) {
  const { status, text } = await get(p);
  console.log(`  GET ${p}: ${status} len=${text.length}${status === 200 ? " title=" + ((text.match(/<title>([^<]*)/) || [])[1] || "").slice(0, 60) : ""}`);
}

// 4. POST Search with proper fields (form names) - maybe needs both + date
console.log("\n--- POST /Search variants ---");
const bodies = [
  new URLSearchParams({ "ScheduleModel.TrainModel.SelectedStartStaionID": "144", "ScheduleModel.TrainModel.SelectedEndStaionID": "56" }),
  new URLSearchParams({ "ScheduleModel.TrainModel.SelectedStartStaionID": "56", "ScheduleModel.TrainModel.SelectedEndStaionID": "144" }),
  new URLSearchParams({ "ScheduleModel.TrainModel.SelectedStartStaionID": "56", "ScheduleModel.TrainModel.SelectedEndStaionID": "182" }),
];
for (const b of bodies) {
  for (const path of ["/Search", "/Home/Search", "/Schedule/Search"]) {
    const { status, text } = await get(path, { method: "POST", body: b, headers: { "content-type": "application/x-www-form-urlencoded" } });
    const rows = (text.match(/train-type-column/g) || []).length;
    console.log(`  POST ${path} [${b.get("ScheduleModel.TrainModel.SelectedStartStaionID")}->${b.get("ScheduleModel.TrainModel.SelectedEndStaionID")}]: ${status} len=${text.length} typeCells=${rows} noData=${text.includes("No train schedules found")}`);
  }
}
